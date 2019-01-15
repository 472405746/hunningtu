var wxCharts = require('../../utils/tools/wxcharts.js');
var config = require('../../config');
var qcloud = require('../../utils/index');
var Session = require('../../utils/lib/session');
var app = getApp();
var columnChart = null;
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    var that = this;
    // 查看是否授权
    that.queryUsreInfo();
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //微信授权
      wx.login({
        success: function (res) {
          console.log("code:" + res);
          var code=res.code;
          wx.request({
            url: `${config.service.host}/WxLogin/Auth`,
            data: {
              // 根据自己的需求传参数
              // 例如：openid: getApp().globalData.openid
              signature: e.detail.signature,
              iv: e.detail.iv,
              encryptedDataStr: e.detail.encryptedData,
              code: code,
              nikeName: e.detail.userInfo.nickName,
              avatarUrl:e.detail.userInfo.avatarUrl,
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              //从数据库获取用户信息
              // that.queryUsreInfo();
              if (res.data.done>=1){
                wx.navigateTo({
                  url: '../main/index'
                })
              }else{
                wx.navigateTo({
                  url: '../noauth/index'
                })
              }
            }
          });
        }
      }
      );
      // console.log("code1111:" + res);
      //用户按了允许授权按钮
      var that = this;
      //插入登录的用户的相关信息到数据库
      
      //授权成功后，跳转进入小程序首页
      wx.switchTab({
        url: ''
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  //获取用户信息接口
  queryUsreInfo: function () {
    wx.request({
      url: '这里换成自己后台的链接',
      data: {
        // 根据自己的需求传参数
        // 例如：openid: getApp().globalData.openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // 拿到自己后台传过来的数据，自己作处理
        console.log(res.data);
      }
    })
  },

})