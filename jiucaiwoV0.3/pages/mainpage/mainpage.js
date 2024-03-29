// pages/mainpage/mainpage.js
const app = getApp();

Page({
  data: {
    unreadNum: 0,
    messagesData: null,
    fbInput: null,
    modalName: null,
    inputValue: null,
    userInfo: null,
    newspage: 1,
    marketName: ["沪深", "港股", "美股"],
    TabCur: 0,
    indexItems: null,
    ggstockIndexs: [{
      name: "恒生指数",
      num: "hkHSI",
      price: "-",
      present: "-",
      forecast: "-"
    }, {
      name: "国企指数",
      num: "hkHSCEI",
      price: "-",
      present: "-",
      forecast: "-"
    }, {
      name: "红筹指数",
      num: "hkHSCCI",
      price: "-",
      present: "-",
      forecast: "-"
    }],

    hsstockIndexs: [{
      name: "上证指数",
      num: "sh000001",
      price: "-",
      present: "-",
      forecast: "-"
    }, {
      name: "深圳成指",
      num: "sz399001",
      price: "-",
      present: "-",
      forecast: "-"
    }, {
      name: "创业板指",
      num: "sz399006",
      price: "-",
      present: "-",
      forecast: "-"
    }],
    mgstockIndexs: [{
      name: "道琼斯",
      num: "gb_dji",
      price: "-",
      present: "-",
      forecast: "-"
    }, {
      name: "纳斯达克",
      num: "gb_ixic",
      price: "",
      present: "-",
      forecast: "-"
    }, {
      name: "标普500",
      num: "gb_inx",
      price: "-",
      present: "-",
      forecast: "-"
    }],

    PageCur: 'myOption',
    newsTitles: []

  },

  NavChange(e) {
    var that = this;
    if (e.currentTarget.dataset.cur =="messagesPage"){
      wx.request({
        url: 'http://106.15.182.82:8080/changeIsReadByUserName?username=' + app.globalData.openid,
        success(res) {
          console.log(res.data);
        }
      })
      that.setData({
        unreadNum:0
      })
    }
    this.setData({
      PageCur: e.currentTarget.dataset.cur,
      modalName: null,
    })
  },
  /**
   * 页面的初始数据
   */

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(app.globalData.openid);
    // console.log(app.globalData.userInfo);

    this.getMessages();


    this.data.userInfo = app.globalData.userInfo;
    this.setData({
      userInfo: this.data.userInfo,
    })
    this.refreshIndex();

    this.getNewsTitle();
  },

  getNewsTitle: function() {
    var that = this;
    var newsUrl = "http://api.dagoogle.cn/news/nlist?cid=4&psize=1";
    wx.request({
      url: newsUrl + "&page=" + that.data.newspage,
      //仅为示例，并非真实的接口地址

      header: {
        'content-type': 'text/json' // 默认值
      },
      success(res) {
        console.log(res.data.data.list);
        that.data.newsTitles = that.data.newsTitles.concat(res.data.data.list);
        that.setData({
          newsTitles: that.data.newsTitles
        })
      }
    })
  },
  refreshIndex: function() {
    var that = this
    var hsurl = 'https://hq.sinajs.cn/list='
    var ggurl = 'https://hq.sinajs.cn/list='
    var mgurl = 'https://hq.sinajs.cn/list='
    //沪深
    {
      for (var i = 0; i < that.data.hsstockIndexs.length; i++) {
        // console.log(app.globalData.hsstockIndexs[i].num),
        hsurl = hsurl + that.data.hsstockIndexs[i].num + ',';
      }
      var hsindex = 0;
      wx.request({
        url: hsurl,
        //仅为示例，并非真实的接口地址

        header: {
          'content-type': 'text/json' // 默认值
        },
        success(res) {
          var line = res.data.split(";");
          for (var j = 0; j < that.data.hsstockIndexs.length; j++) {
            var x = line[j].split("\"");
            var result = x[1].split(",");
            //console.log(result[3]);
            that.data.hsstockIndexs[hsindex].price = result[3];
            if (that.data.hsstockIndexs[hsindex].price == 0) {
              that.data.hsstockIndexs[hsindex].price = result[2];
              that.data.hsstockIndexs[hsindex].present = "-";
            } else {
              var present = (result[3] - result[2]) * 100 / result[2];
              present = present.toFixed(2);
              that.data.hsstockIndexs[hsindex].present = ""
              if (present > 0) {
                that.data.hsstockIndexs[hsindex].present = "+"
              }
              that.data.hsstockIndexs[hsindex].present = that.data.hsstockIndexs[hsindex].present + present;
            }

            that.setData({
              hsstockIndexs: that.data.hsstockIndexs
            })
            hsindex++;
            // that.stockIndexs[i].price = result[4];
          }
        },

      })
    }
    //港股
    {
      for (var i = 0; i < that.data.ggstockIndexs.length; i++) {
        // console.log(app.globalData.hsstockIndexs[i].num),
        ggurl = ggurl + that.data.ggstockIndexs[i].num + ',';
      }
      var ggindex = 0;
      wx.request({
        url: ggurl,
        //仅为示例，并非真实的接口地址

        header: {
          'content-type': 'text/json' // 默认值
        },
        success(res) {
          var line = res.data.split(";");
          for (var j = 0; j < that.data.ggstockIndexs.length; j++) {
            var x = line[j].split("\"");
            var result = x[1].split(",");
            //console.log(result[6]);
            that.data.ggstockIndexs[ggindex].price = result[6];
            if (that.data.ggstockIndexs[ggindex].price == 0) {
              that.data.ggstockIndexs[ggindex].price = result[3];
              that.data.ggstockIndexs[ggindex].present = "-";
            } else {
              var present = (result[6] - result[3]) * 100 / result[3];
              present = present.toFixed(2);
              that.data.ggstockIndexs[ggindex].present = "";
              if (present > 0) {
                that.data.ggstockIndexs[ggindex].present = "+"
              }
              that.data.ggstockIndexs[ggindex].present = that.data.ggstockIndexs[ggindex].present + present;
            }

            that.setData({
              ggstockIndexs: that.data.ggstockIndexs
            })
            ggindex++;
            // that.stockIndexs[i].price = result[4];
          }
        },

      })
    }
    //美股
    {
      for (var i = 0; i < that.data.mgstockIndexs.length; i++) {
        // console.log(app.globalData.hsstockIndexs[i].num),
        mgurl = mgurl + that.data.mgstockIndexs[i].num + ',';
      }
      var mgindex = 0;
      wx.request({
        url: mgurl,
        //仅为示例，并非真实的接口地址

        header: {
          'content-type': 'text/json' // 默认值
        },
        success(res) {
          var line = res.data.split(";");
          for (var j = 0; j < that.data.mgstockIndexs.length; j++) {
            var x = line[j].split("\"");
            var result = x[1].split(",");
            //console.log(result[1]);
            that.data.mgstockIndexs[mgindex].price = result[1];
            if (that.data.mgstockIndexs[mgindex].price == 0) {
              that.data.mgstockIndexs[mgindex].price = result[26];
              that.data.mgstockIndexs[mgindex].present = "-";
            } else {
              that.data.mgstockIndexs[mgindex].present = "";
              var present = (result[1] - result[26]) * 100 / result[26];
              present = present.toFixed(2);
              if (present > 0) {
                that.data.mgstockIndexs[mgindex].present = "+"
              }
              that.data.mgstockIndexs[mgindex].present = that.data.mgstockIndexs[mgindex].present + present;
            }

            that.setData({
              mgstockIndexs: that.data.mgstockIndexs
            })
            mgindex++;
            // that.stockIndexs[i].price = result[4];
          }
        },

      })
    }
    setTimeout(this.refreshIndex, 3000)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  refreshItem: function() {


    var that = this
    var url = 'https://hq.sinajs.cn/list='
    //沪深
    {
      for (var i = 0; i < that.data.indexItems.length; i++) {
        // console.log(app.globalData.hsstockIndexs[i].num),
        url = url + that.data.indexItems[i].market + that.data.indexItems[i].shareNum + ',';
      }
      url = url.toLowerCase();
      var itemindex = 0;
      //console.log(url)
      wx.request({
        url: url,
        //仅为示例，并非真实的接口地址

        header: {
          'content-type': 'text/json' // 默认值
        },
        success(res) {
          var line = res.data.split(";");
          for (var j = 0; j < that.data.indexItems.length; j++) {
            var x = line[j].split("\"");
            var result = x[1].split(",");

            switch (that.data.indexItems[itemindex].market) {
              case "sh":
              case "sz":
                {
                  that.data.indexItems[itemindex].price = result[3];
                  if (that.data.indexItems[itemindex].price == 0) {
                    that.data.indexItems[itemindex].price = result[2];
                    that.data.indexItems[itemindex].present = "-";
                  } else {
                    var present = (result[3] - result[2]) * 100 / result[2];
                    present = present.toFixed(2);
                    that.data.indexItems[itemindex].present = ""
                    if (present > 0) {
                      that.data.indexItems[itemindex].present = "+"
                    }
                    that.data.indexItems[itemindex].present = that.data.indexItems[itemindex].present + present;
                  }
                }
                break;
              case "hk":
                {
                  that.data.indexItems[itemindex].price = result[6];
                  if (that.data.indexItems[itemindex].price == 0) {
                    that.data.indexItems[itemindex].price = result[3];
                    that.data.indexItems[itemindex].present = "-";
                  } else {
                    var present = (result[6] - result[3]) * 100 / result[3];
                    present = present.toFixed(2);
                    that.data.indexItems[itemindex].present = "";
                    if (present > 0) {
                      that.data.indexItems[itemindex].present = "+"
                    }
                    that.data.indexItems[itemindex].present = that.data.indexItems[itemindex].present + present;

                  }
                }
                break;
              case "gb_":
                {
                  that.data.indexItems[itemindex].price = result[1];
                  if (that.data.indexItems[itemindex].price == 0) {
                    that.data.indexItems[itemindex].price = result[26];
                    that.data.indexItems[itemindex].present = "-";
                  } else {
                    that.data.indexItems[itemindex].present = "";
                    var present = (result[1] - result[26]) * 100 / result[26];
                    present = present.toFixed(2);
                    if (present > 0) {
                      that.data.indexItems[itemindex].present = "+"
                    }
                    that.data.indexItems[itemindex].present = that.data.indexItems[itemindex].present + present;

                  }
                }
                break;
            }
            that.setData({
              indexItems: that.data.indexItems
            })
            itemindex++;
            // that.stockIndexs[i].price = result[4];
          }
        },

      })
    }
    setTimeout(this.refreshItem, 3000)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  marketSelect: function(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
    })

  },

  NavtoNewsPage: function(e) {
    wx.navigateTo({
      url: '../newsPage/newsPage?newsaid=' + this.data.newsTitles[e.currentTarget.dataset.cur].aid,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  NavtoShare: function(e) {
    console.log(e);
    wx.navigateTo({
      url: '../shareDetail/shareDetail?market=' + e.currentTarget.dataset.cur[0] + "&num=" + e.currentTarget.dataset.cur[1] + "&isSelected=" + e.currentTarget.dataset.cur[2],
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  getInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  getFbIput: function(e) {
    this.setData({
      fbInput: e.detail.value
    })
  },
  showModal: function(e) {
    if (this.data.modalName != null) {
      this.setData({
        modalName: null
      })
    } else {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    }
  },
  hideModal: function(e) {
    var that = this;
    switch (this.data.modalName) {
      case 'feedbackModal':
        if (this.data.fbInput != null && this.data.fbInput != "") {

          wx.request({
            url: 'http://106.15.182.82:8080/sendSuggestion?username=' + app.globalData.openid + '&content=' + that.data.fbInput,
          })
          wx.showToast({
            title: '发送成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '请填写内容，再发送',
            icon: 'none',
            duration: 2000
          })
        }
        this.setData({
          fbInput: null
        })
        break;
      case "selectModal":
        this.onShow();
        break;

    }
    this.setData({
      modalName: null
    })
  },
  onReady: function() {

  },
  navToSp: function() {
    wx.navigateTo({
      url: '../searchPage/searchPage',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })

  },
  addOrDelShare: function(e) {
    var that = this;
    var isSelected = e.currentTarget.dataset.cur[0];
    var num = e.currentTarget.dataset.cur[1];
    var index = e.currentTarget.dataset.cur[2];
    if (!isSelected) {
      wx.request({
        url: 'http://106.15.182.82:8080/addSaveShare?username=' + app.globalData.openid + '&sharenum=' + num,
      })
      this.data.indexItems[index].isSelected = true;
      this.setData({
        indexItems: this.data.indexItems
      })
    } else {
      wx.request({
        url: 'http://106.15.182.82:8080/deleteSaveShare?username=' + app.globalData.openid + '&shareNum=' + num,
      })
      this.data.indexItems[index].isSelected = false;
      this.setData({
        indexItems: this.data.indexItems
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    wx.request({
      url: 'http://106.15.182.82:8080/searchSaveShareByUserName?username=' + app.globalData.openid,
      success(res) {
        console.log(res.data);
        app.globalData.mySelect = res.data;
        that.setData({
          indexItems: res.data
        })
        for (var i = 0; i < that.data.indexItems.length; i++) {
          that.data.indexItems[i].isSelected = true;
          that.data.indexItems[i].index = i;
        }
        that.setData({
          indexItems: that.data.indexItems
        })
        that.refreshItem();
      }
    })
  },

  getMessages: function() {
    var that = this;
    let map = {}; // 处理过后的数据对象
    let temps = []; // 临时变量


    wx.request({
      url: 'http://106.15.182.82:8080/getMessageByUserName?username=' + app.globalData.openid,
      success(res) {
        console.log(res.data);
        for (let key in res.data) {
          let ekey = res.data[key].date;
          if (res.data[key].isread == 0) {
            that.data.unreadNum++;
          }
          temps = map[ekey] || [];
          temps.push({
            date: res.data[key].date,
            contents: res.data[key],
          });
          map[ekey] = temps;
        }
        that.data.messagesData = map;
        that.setData({
          messagesData: that.data.messagesData,
          unreadNum: that.data.unreadNum
        })


      }
    })

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
    console.log(this.data.newspage);
    this.setData({
      newspage: this.data.newspage + 1
    })
    this.getNewsTitle();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})