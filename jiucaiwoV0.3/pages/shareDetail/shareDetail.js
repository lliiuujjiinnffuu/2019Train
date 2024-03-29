// pages/mainpage/shareDetail/shareDetail.js
var wxCharts = require("../../utils/wxcharts.js");
var daylineChart = null;
var yuelineChart = null;
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataNum : [],
    saveBtnContent: '+ 自选',
    isSelected: false,
    market: "",
    num: "",
    name: "",
    max: "",
    min: "",
    kaipan: "",
    price: "",
    present: "",
    forecast: "",
    dayData: [],
    daySP: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      num: options.num,
      market: options.market,
      isSelected:options.isSelected
    })
    if(this.data.isSelected){
      this.setData({
        saveBtnContent: '已添加'
      })
    }
    this.getShareInf();

  },
  getShareInf: function() {
    var that = this;
    wx.request({
      url: "http://hq.sinajs.cn/list=" + this.data.market + this.data.num.toLowerCase(),
      //仅为示例，并非真实的接口地址

      header: {
        'content-type': 'text/json' // 默认值l
      },
      success(res) {
        //   console.log(res.data);
        var temp = res.data.split("\"");
        var result = temp[1].split(",");
        // that.data.name = result[0];
        that.data.name = decodeURIComponent(result[0]);
        switch (that.data.market) {
          case "sh":
          case "sz":
            {
              that.data.max = result[4];
              that.data.min = result[5];
              that.data.kaipan = result[1];
              if (that.data.kaipan == 0) {
                that.data.kaipan = result[2];
              }
              that.data.price = result[3];
              if (that.data.price == 0) {
                that.data.price = result[2];
                that.data.present = "-";
              } else {
                var present = (result[3] - result[2]) * 100 / result[2];
                present = present.toFixed(2);
                that.data.present = ""
                if (present > 0) {
                  that.data.present = "+"
                }
                that.data.present = that.data.present + present;
              }
            }
            break;
          case "hk":
            {
              that.data.max = result[4];
              that.data.min = result[5];
              that.data.kaipan = result[2];
              if (that.data.kaipan == 0) {
                that.data.kaipan = result[3];
              }
              that.data.price = result[6];
              if (that.data.price == 0) {
                that.data.price = result[3];
                that.data.present = "-";
              } else {
                var present = (result[6] - result[3]) * 100 / result[3];
                present = present.toFixed(2);
                that.data.present = "";
                if (present > 0) {
                  that.data.present = "+"
                }
                that.data.present = that.data.present + present;

              }
            }
            break;
          case "gb_":
            {
              that.data.max = result[6];
              that.data.min = result[7];
              that.data.kaipan = result[5];
              if (that.data.kaipan == 0) {
                that.data.kaipan = result[26];
              }
              that.data.price = result[1];
              if (that.data.price == 0) {
                that.data.price = result[26];
                that.data.present = "-";
              } else {
                that.data.present = "";
                var present = (result[1] - result[26]) * 100 / result[26];
                present = present.toFixed(2);
                if (present > 0) {
                  that.data.present = "+"
                }
                that.data.present = that.data.present + present;

              }
            }
            break;
        }
        that.setData({
          name: that.data.name,
          max: that.data.max,
          min: that.data.min,
          kaipan: that.data.kaipan,
          price: that.data.price,
          present: that.data.present,
          forecast: that.data.forecast,
        })
        console.log(that.data.name);
        var marketTag = that.data.market == 'gb_' ? 'us' : that.data.market == 'hk' ? 'hk' : 'hs'
        var klineUrl;
        if (that.data.market == 'sh') {
          klineUrl = 'http://img1.money.126.net/data/' + marketTag + '/kline/day/history/2019/0' + that.data.num + '.json'
        } else if (that.data.market == 'sz') {
          klineUrl = 'http://img1.money.126.net/data/' + marketTag + '/kline/day/history/2019/1' + that.data.num + '.json'
        } else {
          klineUrl = 'http://img1.money.126.net/data/' + marketTag + '/kline/day/history/2019/' + that.data.num + '.json'
        }
        wx.request({
          url: klineUrl, //仅为示例，并非真实的接口地址
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res.data)
            that.data.name = res.data.name;
            for (var temi = 7; temi > 0; temi--) {
              that.data.dayData = that.data.dayData.concat([res.data.data[res.data.data.length - temi]]);
            }
            that.setData({
              dayData: that.data.dayData,
              name: that.data.name
            })
            console.log(that.data.dayData); {
              var windowWidth = 320;
              try {
                var res = wx.getSystemInfoSync();
                windowWidth = res.windowWidth;
              } catch (e) {
                console.error('getSystemInfoSync failed!');
              }

              for (var j = 0; j < 7; j++) {
                console.log(that.data.dayData[j])
                that.data.daySP = that.data.daySP.concat(that.data.dayData[j][2]);
                that.data.dataNum = that.data.dataNum.concat(that.data.dayData[j][0].substr(that.data.dayData[j][0].length - 3, that.data.dayData[j][0].length))
              }
              that.data.dataNum = that.data.dataNum.concat("明天");
              that.setData({
                daySP: that.data.daySP,
                dataNum: that.data.dataNum
              })
              yuelineChart = new wxCharts({ //当月用电折线图配置
                canvasId: 'yueEle',
                type: 'line',
                categories: that.data.dataNum, //categories X轴
                animation: true,
                // background: '#f5f5f5',

                series: [{
                    name: '实际',
                    data: that.data.daySP,
                    format: function(val, name) {
                      return val.toFixed(2) ;
                    }
                  },
                  {
                    name: '预测',
                    data: [null, null, null, null, null,null, that.data.daySP[6],6],
                    format: function(val, name) {
                      return val.toFixed(2) ;
                    }
                  }
                ],
                xAxis: {
                  disableGrid: true
                },
                yAxis: {
                  title: '股票',
                  format: function(val) {
                    return val.toFixed(2);
                  },
                  max: that.data.max * 1.3,
                  min: that.data.min * 0.7
                },
                width: windowWidth,
                height: 400,
                dataPointShape: true,
                dataLabel: true, 
                legend: false,
                extra: {
                  lineStyle: 'curve'
                }
              });
            }
          }
        })


      }
    })

  },

  goBackPage: function() {
    wx.navigateBack({
      delta: -1
    });
  },
  getMothElectro: function() {
    // var that = this;
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    for (var j = 0; j < 7; j++) {
      //  console.log(that.data.dayData)
      //   this.data.daySP = this.data.daySP.concat(this.data.dayData[j][2]);
    }
    this.setData({
      //   daySP:this.data.daySP,
    })
    yuelineChart = new wxCharts({ //当月用电折线图配置
      canvasId: 'yueEle',
      type: 'line',
      categories: ['1', '2', '3', '4', '5', '6', '7'], //categories X轴
      animation: true,
      // background: '#f5f5f5',

      series: [{
          name: '实际',
          data: this.data.daySP,
          format: function(val, name) {
            return val.toFixed(2) + 'kWh';
          }
        },
        {
          name: '预测',
          data: [0, 0, 0, 0, 0, 0, 0],
          format: function(val, name) {
            return val.toFixed(2) + 'kWh';
          }
        }
      ],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '股票',
        format: function(val) {
          return val.toFixed(2);
        },
        max: 20,
        min: 0
      },
      width: windowWidth,
      height: 400,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
  save: function() {
    var that = this;
    if (!this.data.isSelected) {
      wx.request({
        url: 'http://106.15.182.82:8080/addSaveShare?username='+ app.globalData.openid+'&sharenum=' + that.data.num,
      })
      this.data.isSelected = true,
        this.data.saveBtnContent = "已添加",
        console.log(this.data.saveBtnContent),
        this.setData({
          saveBtnContent: "已添加"
        })
    } else {
      wx.request({
        url: 'http://106.15.182.82:8080/deleteSaveShare?username=' + app.globalData.openid + '&shareNum=' + that.data.num,
      })
      this.data.isSelected = false,
        this.data.saveBtnContent = "+自选"
      this.setData({
        saveBtnContent: "+自选"
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})