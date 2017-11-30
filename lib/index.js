"use strict";
// LezmePushAdapter is the enhancement of
// PushAdapter, it uses GCM for android push and APNS
// for ios push. It supports multi-topic of GCM

var _npmlog = require('npmlog');

var _npmlog2 = _interopRequireDefault(_npmlog);

var _LezmePushAdapter = require('./LezmePushAdapter');

var _LezmePushAdapter2 = _interopRequireDefault(_LezmePushAdapter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore if */
if (process.env.VERBOSE || process.env.VERBOSE_PARSE_SERVER_PUSH_ADAPTER) {
  _npmlog2.default.level = 'verbose';
}

module.exports = _LezmePushAdapter2.default;