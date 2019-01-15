var qcloud = require('../../utils/index');
var config = require('../../config');

Page({
    data: {
        booksList: [],
        refeshTime:"",
        loadingstatus:false
    },
    onLoad: function () {
         wx.showToast({
            title: '正在获取数据...',
            mask:true,
            icon: "loading",
            duration: 10000000
        });
        var that=this;
        //  that.search();
        setInterval(function(){
               that.search();
        },15000);
    },
    search: function () {
        var that = this;
        this.setData({
            loadingstatus:false
        })
        
        qcloud.request({
            url: `${config.service.host}/WxDayReport/StationMonitor`,
            login: true,
            success: function (res) {
                wx.hideToast();
                that.setData({
                    booksList: res.data.list,
                    refeshTime:res.data.refeshTime,
                    loadingstatus:true
                });
            }
        });
    }
});