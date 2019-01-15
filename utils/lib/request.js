var constants = require('./constants');
var utils = require('./utils');
var Session = require('./session');
var loginLib = require('./login');
var config = require('../../config');

var noop = function noop() { };

var buildAuthHeader = function buildAuthHeader(session) {
    var header = {};
    if (session && session.sid) {
        header["sid"] = session.sid;
    }

    if (session && session.code) {
        header["code"] = session.code;
    }

    return header;
};


function request(options) {
    var requireLogin = options.login;
    var success = options.success || noop;
    var fail = options.fail || noop;
    var complete = options.complete || noop;
    var originHeader = options.header || {};

    // 成功回调
    var callSuccess = function () {
        success.apply(null, arguments);
        complete.apply(null, arguments);
    };

    // 失败回调
    var callFail = function (error) {
        fail.call(null, error);
        complete.call(null, error);
    };
    // 是否已经进行过重试
    var hasRetried = false;

    if (requireLogin) {
        doRequestWithLogin();
    } else {
        doRequest();
    }

    // doRequest();

    // 登录后再请求
    function doRequestWithLogin() {
        loginLib.login({ success: doRequest, fail: callFail });
    }

    // 实际进行请求的方法
    function doRequest() {
        var authHeader = buildAuthHeader(Session.get());
        var session = Session.get();
        wx.request(utils.extend({}, options, {
            header: utils.extend({}, originHeader, authHeader),
            success: function (response) {
                var data = response.data;
                if (config.login && data && !data.bind) {
                    // 清除登录态
                    Session.clear();
                    wx.redirectTo({ url: '../register/index' });
                    return;
                }

                callSuccess.apply(null, arguments);
            },

            fail: callFail,
            complete: noop,
        }));
    };

};

module.exports = {
    request: request,
};