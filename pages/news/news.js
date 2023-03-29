var listTemplate = {
  "index": 0,
  "totalpage": 0,
  "currentpage": 0,
  "items": [],
  "bottomInVisiable": true,
};
Page({
  data: {
    list0: Object.assign({}, listTemplate),
    list1: Object.assign({}, listTemplate),
    list2: Object.assign({}, listTemplate),
    list3: Object.assign({}, listTemplate),
    tabs: ["专业急救 ", "医学知识 ", "养生保健 ", "运动健康 "],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    locked: false,
  },
  switchListByIndex(){
    switch (parseInt(this.data.activeIndex)) {
      case 0:
        return this.data.list0;
      case 1:
        return this.data.list1;
      case 2:
        return this.data.list2;
      case 3:
        return this.data.list3;
    }
  },
  switchByEIndex(number){
    switch (parseInt(number)) {
      case 0:
        return this.data.list0;
      case 1:
        return this.data.list1;
      case 2:
        return this.data.list2;
      case 3:
        return this.data.list3;
    }
  }
  ,
  itemclick: function (event){
    console.log(event.currentTarget)
    wx.navigateTo({
      url: '/pages/newsdetail/newsdetail?aid=' + event.currentTarget.dataset.aid 
      + '&title=' + event.currentTarget.dataset.title + '&time=' + event.currentTarget.dataset.time 
      + '&source=' + event.currentTarget.dataset.source
    })
  }
  ,
  netRequest: function (classid, goallist,isMore) {
    var that = this
    var classandpagejson={}
    if(isMore){
      if (goallist.currentpage + 1 > goallist.totalpage){
        setTimeout(function () {
          that.setData({
            "bottomInVisiable": true,
            "locked":false
          })
        }, 2000) 
        return
      }else{
        classandpagejson = {
          'classid': classid,
          'page': goallist.currentpage + 1
        }
      }
    }else{
      classandpagejson = {
        'classid': classid
      }
    }
    console.log(classandpagejson)
      wx.request({
        url: 'https://wx.all-help.com/mobile/article/getArticleListByCid.json',
        method: 'POST',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: classandpagejson,
        success: function (res) {
          console.log(res)
          var name = "list" + (classid - 1).toString()
          var datajson = {}
          if(isMore){
            datajson[name] = Object.assign({}, ...goallist, {
              items: goallist.items.concat(res.data.data.dataList),
              "totalpage": res.data.data.totalPage,
              "currentpage": res.data.data.page
            })
          }else{
            datajson[name] = Object.assign({}, ...goallist, {
              items: res.data.data.dataList,
              "totalpage": res.data.data.totalPage,
              "currentpage": res.data.data.page,
            })
          }
          that.setData(Object.assign({},datajson,{
            locked:false
          }))
          wx.stopPullDownRefresh()
          
        }
      })
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          screenWidth: res.windowWidth,
        });
      }
    });
    this.netRequest(1, this.data.list0,false)
    this.netRequest(2, this.data.list1,false)
    this.netRequest(3, this.data.list2,false)
    this.netRequest(4, this.data.list3,false)
  },
  refreshbyindex: function (goallist,isMore) {
    if (this.data.locked == true) {
      return;
    } else {
      this.data.locked = true
      this.netRequest(parseInt(this.data.activeIndex) + 1, goallist, isMore)
    }
  },
  tabClick: function (e) {
    console.log(e)
    if (!this.data.locked) {
      var name = "list" + (e.currentTarget.id).toString()
      var datajson={}
      var temp = Object.assign({},this.switchByEIndex(e.currentTarget.id))
      datajson[name] = {}
      this.setData(Object.assign({}, {
        sliderOffset: e.currentTarget.offsetLeft,
        activeIndex: e.currentTarget.id
      },datajson))
      datajson[name] = temp
      this.setData(datajson)
    }
  }
  ,
  onPullDownRefresh: function () {
    var that=this
    setTimeout(function (){
      that.refreshbyindex(that.switchListByIndex(), false)
    },100)
  },
  scroll: function () {
  },
  onReachBottom: function () {
    this.refreshbyindex(this.switchListByIndex(),true)
  }
})