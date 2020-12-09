// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init(); //初始化
//数据库操作对象定义
const db = cloud.database();
//聚合执行对象定义
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  //一旦在服务器端（云端）有异步操作，我们可以使用await
  //aggregate()将现有的数据，形成聚合对象，group()分组

  /**result = {
   *  _id: **,
   *  avgNum: **
   * }
   */
  const result = await db.collection('083books').aggregate().group({
    _id: '$category', //分组字段,_id是自己写的标题名称，$category是将以category形成聚合操作，来完成分组
    //凡是和聚合有关的字段，都要有$符
    avgNum: $.avg('$sales') //分组字段，计算monthlySales字段里数据的平均数
  }).end()
  
  return result;
}