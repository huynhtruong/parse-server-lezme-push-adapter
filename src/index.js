"use strict";
// LezmeParsePushAdapter is the default implementation of
// PushAdapter, it uses GCM for android push and APNS
// for ios push.
import log from 'npmlog';

/* istanbul ignore if */
if (process.env.VERBOSE || process.env.VERBOSE_PARSE_SERVER_PUSH_ADAPTER) {
  log.level = 'verbose';
}

import LezmePushAdapter from './LezmePushAdapter';
export default LezmePushAdapter;

module.exports = LezmePushAdapter;