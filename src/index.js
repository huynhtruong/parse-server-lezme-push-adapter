"use strict";
// LezmePushAdapter is the enhancement of
// PushAdapter, it uses GCM for android push and APNS
// for ios push. It supports multi-topic of GCM
import log from 'npmlog';

/* istanbul ignore if */
if (process.env.VERBOSE || process.env.VERBOSE_PARSE_SERVER_PUSH_ADAPTER) {
  log.level = 'verbose';
}

import LezmePushAdapter from './LezmePushAdapter';

module.exports = LezmePushAdapter;