Page({
    data: {
        aidtypes:[]
    },
    onLoad: function () {
      var that=this
      wx.request({
        url: 'https://wx.all-help.com/mobile/knowledgeListWX.json',
        method:'POST',
        success: function (res) {
           console.log(res)
           that.setData({ aidtypes: res.data.data.dataList}) 
        },
        fail:function(res){
        }
      },
      )
    },
    itemclick:function(event){
      console.log(event.currentTarget)
      wx.navigateTo({
        url: '/pages/aiddetail/aiddetail?aidurl=' + event.currentTarget.dataset.aidurl + '&aidname='+event.currentTarget.dataset.aidname
      })
    }
});