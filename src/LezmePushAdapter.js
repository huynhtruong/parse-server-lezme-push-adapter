'use strict';
import Parse from 'parse';
import log from 'npmlog';
import MGCM from './MGCM';
import { utils } from 'parse-server-push-adapter';
import { APNS } from 'parse-server-push-adapter';

const LOG_PREFIX = 'lezme-parse-server-push-adapter';

export class LezmePushAdapter {

  supportsPushTracking = true;

  constructor(pushConfig = {}) {
    this.validPushTypes = ['ios', 'osx', 'tvos', 'android', 'fcm'];
    this.senderMap = {};
    // used in PushController for Dashboard Features
    this.feature = {
      immediatePush: true
    };
    let pushTypes = Object.keys(pushConfig);

    for (let pushType of pushTypes) {
      if (this.validPushTypes.indexOf(pushType) < 0) {
        throw new Parse.Error(Parse.Error.PUSH_MISCONFIGURED,
                              'Push to ' + pushType + ' is not supported');
      }
      switch (pushType) {
        case 'ios':
        case 'tvos':
        case 'osx':
          this.senderMap[pushType] = new APNS(pushConfig[pushType]);
          break;
        case 'android':
        case 'fcm':
          this.senderMap[pushType] = new MGCM.MGCM(pushConfig[pushType]);
          break;
      }
    }
  }

  getValidPushTypes() {
    return this.validPushTypes;
  }

  send(data, installations) {
    let deviceMap = utils.classifyInstallations(installations, this.validPushTypes);
    let sendPromises = [];
    for (let pushType in deviceMap) {
      let sender = this.senderMap[pushType];
      let devices = deviceMap[pushType];

      if(Array.isArray(devices) && devices.length > 0) {
        if (!sender) {
          log.verbose(LOG_PREFIX, `Can not find sender for push type ${pushType}, ${data}`)
          let results = devices.map((device) => {
            return Promise.resolve({
              device,
              transmitted: false,
              response: {'error': `Can not find sender for push type ${pushType}, ${data}`}
            })
          });
          sendPromises.push(Promise.all(results));
        } else {
          sendPromises.push(sender.send(data, devices));
        }
      }
    }
    return Promise.all(sendPromises).then((promises) => {
      // flatten all
      return [].concat.apply([], promises);
    })
  }
}
