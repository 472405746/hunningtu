var wxCharts = require('../../utils/tools/wxcharts.js');
// 引入配置
var config = require('../../config');
// 引入 QCloud 小程序增强 SDK
var qcloud = require('../../utils/index');

// pages/w_my_payment_record/w_my_payment_record.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: "",//日期     
    companys: ['腾狮', '富华', '宇方', '鼎立', '三星', '华盛', '太元', '大江南', '蓝翔',],
    listData: [
      { "name": "01", "1": "text1", "type": "type1" }
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //获取当前时间戳
    var timestamp = Date.parse(new Date());
    //获取当前时间
    var n = timestamp;
    var date = new Date(n);
    //年
    var Y = date.getFullYear();
    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var time = Y + "-" + M;
    this.setData({
      date: time
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  // 日期选择
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

})