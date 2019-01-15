var qcloud = require('../../utils/index');
var config = require('../../config');
var app = getApp();
// 注册当页全局变量，存放搜索结果以便更新到data中
var curBooksList = [];
Page({
  data: {
    companys: [],
    companyName: "",
    companyCode: "",
    dateTime: "",
    stations:["1","2","3","4","5","6"],
    station:"",
    success:"success"
  },

  // 页面初始化
  onLoad: function (param) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - (144 * res.windowWidth / 750),//窗口高度(px)-搜索模块高度(px)
        })
      }
    })
    qcloud.request({
      url: `${config.service.host}/WxDayReport/GetAllCompanys`,
      login: false,
      success: function (res) {
        var companyName = param.companyName;
        if (companyName) {
          that.setData({
            companyName: companyName
          });
        };
        
        that.setData({
          dateTime: res.data.curDateTime
        });
         var companyCode = res.data.companyCodes[1];
          that.setData({
            companyCode: companyCode,
            companyName:res.data.companyNames[1]
          });
        that.setData({
          companyNames: res.data.companyNames,
          companyCodes: res.data.companyCodes,
        });
        var companyCode = that.data.companyCode;
        var dateTime = that.data.dateTime;
        that.search(companyCode, dateTime,that.data.station);
      }
    });
  },
  bindCompanyChange: function (e) {
    console.log("this.companyNames[e.detail.value]:" + this.data.companyNames[e.detail.value]);
    var companyName = this.data.companyNames[e.detail.value];
    var companyCode = this.data.companyCodes[e.detail.value];
    this.setData({
      companyName: companyName,
      companyCode:companyCode
    });
    this.search(this.data.companyCode, this.data.dateTime,this.data.station);
  },
  bindDateChange: function (e) {
    this.setData({
      dateTime: e.detail.value
    });
    this.search(this.data.companyCoce, this.data.dateTime,this.data.station);
  },
  bindStationChange:function(e){
      var station=this.data.stations[e.detail.value];
      this.setData({
        station:station
      });
       console.log("station"+station);
       this.search(this.data.companyCode, this.data.dateTime,station);
  },
  search: function (code, dateTime,siteCode) {
    wx.showToast({
      title: '正在查找数据数据',
      icon: "loading",
      duration: 300000
    });
    var that = this;
    console.log("code:" + code);
    console.log("dateTime:" + dateTime);
    qcloud.request({
      url: `${config.service.host}/WxDayReport/MAmountHistory`,
      login: true,
      data: {
        CompanyCode: code,
        GatherDateTime: dateTime,
        Station:siteCode
      },
      success: function (res) {
        wx.hideToast();
        var data = res.data.data;
        if (res.data.data.length > 0) {
          that.setData({
            status: "success",
             booksList: data,
             totalAmount:res.data.totalAmount
          })
        } else {
          that.setData({
            booksList: null,
            status:"fail"
          })
          wx.showToast({
            title: '沒有找到符合条件的是数据',
            duration: 2000
          });
        }
      }
    });
  },

  // 上拉加载
  dropLoad: function () {
    var that = this;
    if (this.data.pageCurrent < this.data.pagesTotal) {
      //锁定上拉加载
      that.setData({
        dropLoadFunc: null
      })
      that.loadMore();
    }
  },
  dropLoadFunc:function(){
    console.log("1111111111111111111111111");
  },
  //input清除按钮显示
  typeIng: function (e) {
    var that = this;
    if (e.detail.value) {
      that.setData({
        cancel: true
      })
    } else {
      that.setData({
        cancel: false
      })
    }
  },
  //清除输入框
  clearInput: function () {

    this.setData({
      keyword: null,
      cancel: false,
      focus: true
    })
  },
  // 分享搜索结果
  onShareAppMessage: function () {
    return {
      title: '自定义分享标题',
      desc: '自定义分享描述',
      path: '/pages/result'
    }
  },
  clearStationInput:function(){
    this.setData({
        station:""
    });
    this.search(this.data.companyCode, this.data.dateTime,"");
  }
})