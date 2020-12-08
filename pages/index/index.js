//云数据库
const db = wx.cloud.database();
const db_imgList = db.collection('080imagelist')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrlArr: '', //云端图片存储路径的数组
    showImg: false, //是否显示图片
  },
  //上传图片
  upload(){
    const that = this;
    //选择图片(从本地相册选择图片或使用相机拍照)
    wx.chooseImage({
      count: 2, //选择图片的数量
      success(res){
        // console.log(res.tempFilePaths);
        const imgUrlArr = []; //云端图片存储路径的数组
        //显示加载中图标loading...
        wx.showLoading({
          title: '加载中....'
        })
        //多图片处理，循环数组
        res.tempFilePaths.forEach((item, index, arr) => {
          // console.log(item, index, arr)
          //定义存储名称
          let imgName = 'image' + Math.floor(Math.random()*1000000) + '.png';
          //将本地资源上传至云存储空间
          wx.cloud.uploadFile({
            cloudPath: imgName,
            filePath: item,
            success(res){
              // console.log('上传成功success', res);
              //上传成功时，隐藏加载中图标
              wx.hideLoading();
              //把图片地址，push到数组中
              imgUrlArr.push(res.fileID);
              that.setData({
                imgUrlArr, 
                showImg: true
              })
              //插入数据库操作
              that.addImgList(res.fileID, index, arr.length);
            },
            fail(err){
              console.log('上传失败fail', err);
            }
          })
        })
      },
      fail(err){
        console.log('fail',err)
      }
    })
  },
  //插入数据库操作   添加图片列表
  addImgList(imgUrl, index, arrLength){
    // console.log('addImgList', imgUrl);
    const db_add_data= {
      name: 'XXXX',
      imgUrl: imgUrl,
      time: this.getNowFormateDate() //调用函数：拼接当前时间
    }
    //添加图片到云数据库
    db_imgList.add({
      data: db_add_data
    }).then(res => {
      // console.log('添加图片成功',res);
      if(index === arrLength - 1){ //所有图片上传成功
        //提示上传成功
        wx.showToast({
          title: '上传成功',
          icon: 'success',
          duration: 1000
        })
        //跳转到图片列表页面
        setTimeout(() => {
          //保留当前页面，跳转到应用内的某个页面
          wx.navigateTo({
            url: '/pages/list/list'
          })
        }, 1000)
      }
       
    }).catch(console.error)
  },
  //拼接时间格式(格式化日期时间的格式)
  getNowFormateDate(){
    const date = new Date();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    month = month >= 1 && month <= 9 ? "0" + month : month;
    strDate = strDate >= 1 && strDate <= 9 ? "0" + strDate : strDate;
    //拼接
    let currentDate = date.getFullYear() + '-' + month + '-' + strDate + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    // console.log('时间拼接',currentDate);
    return currentDate;
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})