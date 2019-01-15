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
    companyKyes: "",
    companyValues: "",
    dateTime: "",
    pageCurrent: null,
    pagesTotal: null,
    scrollHeight: null,//滚动区域高度
    cancel: true,  //是否显示输入框清除按钮
    dropLoadFunc: "dropLoad"
  },

  // 页面初始化
  onLoad: function (param) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - (119 * res.windowWidth / 750),//窗口高度(px)-搜索模块高度(px)
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

        var index = param.index;
        if (index) {
          var companyCode = res.data.companyCodes[index];
          that.setData({
            companyCode: companyCode
          });
        }
        that.setData({
          companyNames: res.data.companyNames,
          companyCodes: res.data.companyCodes,
        });
        var companyCode = that.data.companyCode;
        var dateTime = that.data.dateTime;
        that.search(companyCode, dateTime);
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
    this.search(this.data.companyCode, this.data.dateTime);
  },
  bindDateChange: function (e) {
    this.setData({
      dateTime: e.detail.value
    });
    this.search(this.data.companyCoce, this.data.dateTime);
  },

  search: function (code, dateTime) {
    wx.showToast({
      title: '正在查找数据数据',
      icon: "loading",
      duration: 3000
    });
    var that = this;
    console.log("code:" + code);
    console.log("dateTime:" + dateTime);
    qcloud.request({
      url: `${config.service.host}/WxDayReport/GetDayDetay`,
      login: true,
      data: {
        CompanyCode: code,
        BeginTime: dateTime
      },
      success: function (res) {
        wx.hideToast();
        var data = res.data.Data;
        if (res.data.Data.length > 0) {
          that.setData({
            status: "success",
            booksList: data
          })
        } else {
          that.setData({
            booksList: null
          })
          wx.showToast({
            title: '沒有找到符合条件的是数据',
            duration: 2000
          });
        }
      }
    });
  },
  //搜索按钮事件
  formSubmit: function (e) {
    var that = this;
    var code = this.data.companyCode;
    var date = this.data.dateTime;
    that.search(code, date);
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

  //加载更多
  loadMore: function () {
    var that = this;
    var page = parseInt(that.data.pageCurrent) + 1;
    hotapp.request({
      url: 'http://api.diviniti.cn/jmu/library/search/' + that.data.keyword + '/page/' + page + '/count/20',
      success: function (res) {

        if (res.data.status == "success") {
          // 更新数据
          curBooksList = curBooksList.concat(res.data.booksList)
          that.setData({
            booksList: curBooksList,
            pageCurrent: res.data.pageCurrent
          })
        } else {
          // 无搜索结果
          console.log("没有结果")
        }
      },
      complete: function () {
        //启动上拉加载
        that.setData({
          dropLoadFunc: "dropLoad"
        })
      }
    })
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
  }
})