//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    imgUrls: ['http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 3000,
    duration: 1000,
    navItems:[
      // {
      //   name:'日报',
      //   url:'day'
      // },
      // {
      //   name:'月报',
      //   url:'month',
      //   isSplot:true
      // },
      // {
      //   name:'出方明细',
      //   url:'daydetail'
      // },
      // {
      //   name:'历次送方量',
      //   url:'msitehistroy'
      // },
      // {
      //   name:'状态监控',
      //   url:'stationmonitor',
      //   isSplot:true
      // },
      {
        name: '机台在线状态',
        url: 'status',
        isSplot: true
      }
      // {
      //   name:'报表',
      //   url:'bill'
      // }
    ]
  },
  onLoad: function () {
    console.log('onLoad')
  }
    
})
