var wxCharts = require('../../utils/tools/wxcharts.js');
// 引入配置
var config = require('../../config');
// 引入 QCloud 小程序增强 SDK
var qcloud = require('../../utils/index');

var app = getApp();
var columnChart = null;
Page({
    data: {
        chartTitle: '总成交量00',
        isMainChartDisplay: true,
    },
    onLoad:function(){
        // this.getData(11,22,33);
    },
    getData:function(yearAndMonth){
        wx.showToast({
            title:'正在计算数据....',
            icon: 'loading',
            duration: 200000
        });
        qcloud.request({
            url: `${config.service.host}/WxMonthReport`,
            login: true,
             data: {
                 monthTime:yearAndMonth
            },
            success: (response) => {
                wx.hideToast();
                this.setData({ 
                  date: response.data.cuDateTime,
                  companys:response.data.companys,
                  months:response.data.months,
                  data:response.data.data
                });
                console.log('綁定成功');
            }
        });


    },
    bindDateChange:function(e){
        console.log("e.detail.value:"+e.detail.value);
        this.setData({ 
         date: e.detail.value
        }) 
       this.getData(e.detail.value );
    },
    backToMainChart: function () {
        this.setData({
            chartTitle: chartData.main.title,
            isMainChartDisplay: true
        });
        columnChart.updateData({
            categories: chartData.main.categories,
            series: [{
                name: '成交量11',
                data: chartData.main.data,
                format: function (val, name) {
                    return val.toFixed(2) + '';
                }
            }]
        });
    },
    onReady: function (e) {
         this.getData();
    }
});