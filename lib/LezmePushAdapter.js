'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _parse = require('parse');

var _parse2 = _interopRequireDefault(_parse);

var _npmlog = require('npmlog');

var _npmlog2 = _interopRequireDefault(_npmlog);

var _MGCM = require('./MGCM');

var _MGCM2 = _interopRequireDefault(_MGCM);

var _MAPNS = require('./MAPNS');

var _MAPNS2 = _interopRequireDefault(_MAPNS);

var _parseServerPushAdapter = require('parse-server-push-adapter');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LOG_PREFIX = 'lezme-parse-server-push-adapter';

var LezmePushAdapter = function () {
  function LezmePushAdapter() {
    var pushConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, LezmePushAdapter);

    this.supportsPushTracking = true;

    this.validPushTypes = ['ios', 'osx', 'tvos', 'android', 'fcm'];
    this.senderMap = {};
    // used in PushController for Dashboard Features
    this.feature = {
      immediatePush: true
    };
    var pushTypes = Object.keys(pushConfig);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = pushTypes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var pushType = _step.value;

        if (this.validPushTypes.indexOf(pushType) < 0) {
          throw new _parse2.default.Error(_parse2.default.Error.PUSH_MISCONFIGURED, 'Push to ' + pushType + ' is not supported');
        }
        switch (pushType) {
          case 'ios':
          case 'tvos':
          case 'osx':
            this.senderMap[pushType] = new _MAPNS2.default(pushConfig[pushType]);
            break;
          case 'android':
          case 'fcm':
            this.senderMap[pushType] = new _MGCM2.default(pushConfig[pushType]);
            break;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  _createClass(LezmePushAdapter, [{
    key: 'getValidPushTypes',
    value: function getValidPushTypes() {
      return this.validPushTypes;
    }
  }, {
    key: 'send',
    value: function send(data, installations) {
      var _this = this;

      var deviceMap = _parseServerPushAdapter.utils.classifyInstallations(installations, this.validPushTypes);
      var sendPromises = [];

      var _loop = function _loop(pushType) {
        var sender = _this.senderMap[pushType];
        var devices = deviceMap[pushType];

        if (Array.isArray(devices) && devices.length > 0) {
          if (!sender) {
            _npmlog2.default.verbose(LOG_PREFIX, 'Can not find sender for push type ' + pushType + ', ' + data);
            var results = devices.map(function (device) {
              return Promise.resolve({
                device: device,
                transmitted: false,
                response: { 'error': 'Can not find sender for push type ' + pushType + ', ' + data }
              });
            });
            sendPromises.push(Promise.all(results));
          } else {
            sendPromises.push(sender.send(data, devices));
          }
        }
      };

      for (var pushType in deviceMap) {
        _loop(pushType);
      }
      return Promise.all(sendPromises).then(function (promises) {
        // flatten all
        return [].concat.apply([], promises);
      });
    }
  }]);

  return LezmePushAdapter;
}();

exports.default = LezmePushAdapter;