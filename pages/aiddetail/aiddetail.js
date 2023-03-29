Page({
    data: {
      "video":"",
      "img":"",
      "switchs":[],
      "subfolders": [
      ],
      "scenes": [
      ],
      "duration":0,
    },
    onLoad: function (options) {
      var that = this
      wx.setNavigationBarTitle({
        title: options.aidname.indexOf(" ") != -1 ? options.aidname : options.aidname.substring(0,5)
      })
      wx.request({
        url: options.aidurl,
        method:"GET",
        success:function(res){
          that.setData({
            "scenes": res.data.scenes,
            "subfolders": res.data.subfolders,
            "switchs": res.data.subfolders!=null ? Array(res.data.subfolders[0].data.length).fill(false):[],
            "video": (res.data.video == null || res.data.video == '') ? "" : (res.data.video.search("https")==0 ? res.data.video : "https://wx.all-help.com/static/html/" + res.data.video),
            "duration": (res.data.VideoDuration == null || res.data.VideoDuration=='') ? 0 : 60 * parseInt(res.data.VideoDuration)[0] + parseInt(res.data.VideoDuration)[1],
            "img": (res.data.videoImage == null || res.data.videoImage == "") ? "" : res.data.videoImage
          })
        }
      })
    },
    toggle:function(event){
      var index = event.currentTarget.id - 1
      var temparray = this.data.switchs
      var temp=!temparray[index]
      temparray[index]=temp
      this.setData({
        switchs:temparray
      })
    },
    phonecall: function (event) {
        wx.makePhoneCall({
          phoneNumber: event.currentTarget.id
        })
    }
});