var app = getApp();
var constants = require('../../utils/lib/constants');
var config = require('../../config');
var qcloud = require('../../utils/index');

var Session = require('../../utils/lib/session');

Page({
    data: {
        load: false,
        hasUserInfo: false,
        code: "",
        isdisabled:false
    },
    onLoad: function (options) {
        var session = Session.get();
        var that = this;
        if (session && session.sid) {
            wx.redirectTo({ url: '../main/index' });
        } else {
            that.getUserInfo();
        }
    },
    getUserInfo: function () {
        var that = this
        wx.login({
            success: _getUserInfo
        })

        function _getUserInfo(loginResult) {
            wx.getUserInfo({
                success: function (userResult) {
                    var code = loginResult.code;
                    that.setData({
                        hasUserInfo: true,
                        userInfo: userResult.userInfo,
                        code: code
                    });
                    Session.set({
                        userInfo: userResult.userInfo,
                        code: code
                    });
                    var session = Session.get();

                    var sid="";
                    if(session&&session.sid){
                        sid=session.sid;
                    };
                    

                    wx.request({
                        url: `${config.service.host}/WxRegister/SessionCheck`,
                        data: {},
                        header: { code: loginResult.code ,sid:sid},
                        method: 'GET',
                        success: function (res) {
                            Session.set({
                                userInfo: userResult.userInfo,
                                sid: res.data.sid
                            });
                            if (res.data.bind) {
                                wx.redirectTo({ url: '../main/index' });
                                that.update()
                            }
                        },
                        fail: function () {
                            // fail
                        },
                        complete: function () {
                            // complete
                        }
                    });
                }
            })
        }
    },
    formSubmit: function (e) {
        var that = this;

        //todo 表单验证
        var user = e.detail.value.user;
        var pwd = e.detail.value.password;

        if (!user || !pwd) {
            wx.showModal({
                title: '提示',
                content: '手机号码及密码不能为空哦！',
                showCancel: false,
                confirmColor: '#338FFC',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
            return false;
        }

        //更改绑定按钮loading状态
        that.setData({
            load: true,
            isdisabled:true         
        });

        var session = Session.get();

        var sid="";
        if(session&&session.sid){
            sid=session.sid;
        };
        var code="";
        if(session&&session.code){
            code=session.code;
        }
        wx.request({
            url: `${config.service.host}/WxRegister`,
            login: false,
            data: {
                mobile: user,
                pwd: pwd,
                code:code,
                sid:sid
            },
            success: (response) => {
                session.sid=response.data.sid;
                session.bind=response.data.bind;
                Session.set(session);

                if (response.data.bind) {
                    wx.showToast({
                        title: '綁定成功！',
                        icon: 'loading',
                        duration: 2000
                    });
                    wx.redirectTo({ url: '../main/index' });
                } else {
                    wx.showToast({
                        title: '您输入的手机和邀请码不合法，请联系管理员！',
                        duration: 2000
                    });
                    that.setData({
                        load: false,
                        isdisabled:false
                    });
                }
            }
        });
    }
});