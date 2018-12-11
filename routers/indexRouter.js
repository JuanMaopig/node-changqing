const express=require("express");

// const userController=require("../controller/userController").userController;
//
const infoPush=require("../controller/infoController");
const htmlController=require("../controller/htmlController").htmlController;
// const controller=require("../controller/controller");
const userController=require("../controller/userController");
const dbController=require("../controller/dbController").dbController;
const user = require("../controller/userController");
const orderController=require("../controller/orderController");
const manage=require('../controller/manage');
const RoomListController=require("../controller/RoomListController").RoomListController;
const apartmentController=require("../controller/apartmentController");
const staffController=require("../controller/staffController");
const multiparty=require("connect-multiparty");
const connectmultiparty=multiparty();
// 获取路由对象
const router=express.Router();//调用express对象提供的路由方法获取路由对象

router.get('/*.html*',htmlController.getHtml);
/*登录成功*/
//主页
router.get("/",htmlController.getIndex);
//个人中心
router.get("/user/user",htmlController.getUser);
router.get("/user/personal_info.html",user.getPersonal);
router.get("/user/safe-center.html",user.getSafe);
router.get("/user/order.html",user.getOder);
/**找回密码**/
router.post("/findPW.do",user.findPW);
router.post("/findPWGetCode.do",user.findPWGetCode);
router.post("/findPWCheckCode.do",user.findPWCheckCode);
router.post("/findPWNewPW.do",user.findPWNewPW);
router.post("/code.do",infoPush.sendCode);
router.post("/email.do",infoPush.emailSend);
router.post("/sendCode.do",infoPush.sendCode);
router.post("/signId.do",infoPush.signCodeCheck);
router.post("/login.do",dbController.postLogin);
router.post("/sendVerify.do",infoPush.sendVerify);
router.get("/temail.do",infoPush.checkVerify);
router.get("/FPtel.do",);

//home.html传数据到option.html
router.post("/option.html",orderController.transferData);

//option.html传数据到room.html
router.post("/room.html",orderController.transferRoom);
router.get("/room.html",orderController.transferRoom);
//room.html传数据到guest.html
router.get('/guest.html',orderController.transferGuest);

//guest.html传数据到comfirm.html
router.post('/comfirm.html',orderController.transferComfirm);
//提价订单
router.get('/booking/order.html',orderController.transferUpOrder);


router.get('/changqin/manage/*.do',function (req,res,next) {
    let url=req.url;
    url=url.substr(17);
    url=url.substring(0,url.indexOf('.do'));
    console.log(url);
    if(manage[url]){
        manage[url](req,res);
    }else {
        next();
    }
    console.log(url);
});
router.post('/changqin/manage/*.do',function (req,res,next) {
    let url=req.url;
    url=url.substr(17);
    url=url.substring(0,url.indexOf('.do'));
    console.log(url);
    if(manage[url]){
        manage[url](req,res);
    }else {
        next();
    }
    console.log(url);
});

/*对订单的操作*/
router.get("/getorder.do",orderController.getorder);
router.get("/editorder.do",orderController.editorder);
router.get("/deleteorder.do",orderController.deleteorder);
router.get("/addorder.do",function () {
    console.log(req.query.order_time);
});
//后台人员管理列表
router.get('/manage/staffController/*.do',function (req,resp) {
    let url=req.url;
    url=url.substr(24);
    url=url.substring(0,url.indexOf('.do'));
    console.log("548978787867687");
    staffController[url](req,resp);
});
//用户
// router.post("/login.do",controller.controllerLogin);
router.get("/manage/userController/*.do",function (req,resp) {
    // console.log("hahahhaha4444444");
    let url=req.url;
    url=url.substr(23);
    url=url.substring(0,url.indexOf('.do'));
    userController[url](req,resp);
    console.log(url);
});

//后台部门列表
// router.get('/apartmentList.do',apartmentCtroller.operateApart);
// router.get('/addNewForm.do',apartmentCtroller.addApart);
// router.get('/deleteForm.do',apartmentCtroller.deleteApart);
// router.get('/editForm.do',apartmentCtroller.editApart);
router.get('/manage/apartmentCtroller/*.do',function (req,res) {
    let url=req.url;
    url=url.substr(26);
    // console.log("556"
    url=url.substring(0,url.indexOf('.do'))
    console.log(url);
    apartmentController[url](req,res);
});
//房间列表的页面数据查询
router.get('/roomInformation.do',RoomListController.roomInformation);
//房间列表的页面弹框修改
router.get('/roomModify.do',RoomListController.roomModify);
//房间列表的页面数据删除
router.get('/roomDelete.do',RoomListController.roomDelete);
//房间号搜索
router.get('/selectRoom.do',RoomListController.selectRoom);
//新增
router.get('/roomNew.do',RoomListController.roomNew);
module.exports=router;