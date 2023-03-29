// pages/newsdetail/newsdetail.js
var WxParse = require('../../wxParse/wxParse.js')
var article=''
var author='网络'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    time:"",
    source:""
  },
  onHtmlParse:function(){

    // var x = dom.getElementsByClassName("text-content")[0]
  //  article = article.replace(/<script.*?>[\s\S]*?<\/script>/ig, "")
    article = article.match(/<div class=\"text\">[\s\S]*?<div class="copyright-tip">/ig)[0]
    WxParse.wxParse('article', 'html', article, this, 5)
  }
  ,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      title: options.title,
      time:options.time,
      source: options.source != "" ? options.source:"网络"
    })
  
    wx.request({
      url: "https://wx.all-help.com/mobile/article/detail/" + options.aid,
      method: 'GET',
      success: function (res) {
        article=res.data
        that.onHtmlParse()
      }
    })
  }
})