const express=require("express");

// const userController=require("../controller/userController").userController;
//
const infoPush=require("../controller/infoController");
const htmlController=require("../controller/htmlController").htmlController;
//
const dbController=require("../controller/dbController").dbController;
const user = require("../controller/userController");
const orderController=require("../controller/orderController");
const manage=require('../controller/manage')
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


router.get('/changqin/*.json',function (req,res,next) {

    let url=req.url;
    url=url.substr(10);
    url=url.substring(0,url.indexOf('.json'));
    console.log(url)
    if(manage[url]){
        manage[url](req,res);
    }else {
        next();
    }
    console.log(url);
})
module.exports=router;