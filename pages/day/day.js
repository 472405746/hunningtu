
var wxCharts = require('../../utils/tools/wxcharts.js');
var config = require('../../config');
var qcloud = require('../../utils/index');
var app = getApp();
var columnChart = null;
Page({
    data: {
        chartTitle: '当日产量',
        isMainChartDisplay: true,
        chartData:[],
        tablevisiable:false
    },
    onLoad: function () {
        // this.getData(11,22,33);
    },
    getData: function (dateTime) {
        wx.showToast({
            title: '正在加载数据....',
            icon: 'loading',
            duration: 100000
        });

        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        };
        qcloud.request({
            url: `${config.service.host}/WxDayReport`,
            login: false,
            data: {
                dateTime: dateTime
            },
            success: (response) => {
                wx.stopPullDownRefresh({
                    complete: function (res) {
                        console.log("11111111"+ new Date())
                    }
                })
                wx.hideToast();
                
                this.setData({
                    date: response.data.cuDateTime,
                    listData: response.data.chartData.tableData,
                    chartData:response.data.chartData.categories,
                    tablevisiable:true
                });
                columnChart = new wxCharts({
                    canvasId: 'columnCanvas',
                    type: 'column',
                    animation: true,
                    categories: response.data.chartData.categories,
                    series: [{
                        name: '产量',
                        data: response.data.chartData.data,
                        format: function (val, name) {
                            return val;
                        }
                    }],
                    yAxis: {
                        format: function (val) {
                            return val + '方';
                        },
                        title: '',
                        min: 0
                    },
                    xAxis: {
                        disableGrid: false,
                        type: 'calibration'
                    },
                    extra: {
                        column: {
                            width: 25
                        }
                    },
                    width: windowWidth,
                    height: 250,
                });
            }
        });


    },

    onPullDownRefresh: function () {
        this.getData();
        console.log('onPullDownRefresh', new Date())
    },
    stopPullDownRefresh: function () {
        wx.stopPullDownRefresh({
            complete: function (res) {
                console.log(res, new Date())
            }
        })
    },
    // 点击日期组件确定事件 
    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value
        })
        this.getData(e.detail.value);
    },
    backToMainChart: function () {
        return;
    },
    touchHandler: function (e) {
        console.log("index:"+index);
        var index = columnChart.getCurrentDataIndex(e);
        if(index>-1){
            console.log(this.data.chartData[index]);
            //  wx.navigateTo({ url: '../register/index' });
            wx.navigateTo({
              url: '../daydetail/daydetail?companyName='+this.data.chartData[index]+"&index="+index,
              success: function(res){
                // success
              },
              fail: function() {
                // fail
              },
              complete: function() {
                // complete
              }
            })
        }else{
            console.log("NAN");
        }
    },
    onReady: function (e) {
        this.getData(null);
    }
});