const db = wx.cloud.database();
const db_imgList = db.collection('080imagelist');


Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataList: [] //云数据库
  }, 
  //获取图库数据列表 方法
  getImageList(){
    const that = this;
    db_imgList.get().then(res => {
      console.log('获取图库数据列表',res.data);
      that.setData({
        dataList: res.data
      })
    })
  },

  //点击相机，上传照片
  qufabu(){
    //跳转到上传图片页面
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },
  
  //删除图片
  deleteImg(e){
    const that = this;
    //获取到要删除图片的_id
    // console.log('shanchu', e.currentTarget)
    const _id =  e.currentTarget.dataset.id;
    const imgUrl = e.currentTarget.dataset.imgurl;
    // console.log('删除图片',_id, imgUrl); 
    //询问是否删除
    wx.showModal({
      title: '警告',
      content: '确定要删除吗？',
      cancelColor: '#ff0000',
      confirmText: '确认删除',
      confirmColor: '#00ff00',
      success(res){
        if(res.confirm){
          // console.log('确定删除', res)
          //删除数据库的内容
          db_imgList.doc(_id).remove().then(res =>{
            // console.log('删除成功', res)
            // 重新获取图库数据列表
            that.getImageList();
          }).catch(console.error)

          //删除存储库的内容
          wx.cloud.deleteFile({
            fileList: [imgUrl],
            success(res){
              console.log('存储库删除成功', res)
            },
            fail(err){
              console.error(err);
            }
          })
        } else if(res.cancel){
          console.log('取消删除', res)
        }
      },
      fail(err){
        console.log(err)
      }
    })
    
  },




  // 生命周期函数--监听页面加载

  onLoad: function (options) {

  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },

  //生命周期函数--监听页面显示
  onShow: function () {
    //调用获取图库数据列表方法
    this.getImageList();
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