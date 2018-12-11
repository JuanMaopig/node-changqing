const Model=require("../dao/dao");
const Code=require("../dao/codeController");
const tools=require("../config/tools");
const SMS = require("../dao/informationPush").SMS;
const userDao=require("../dao/userDao");
const User={
    addUser(req,user){
        req.session.user=user;
    },
    exitUser(req){
        delete  req.session.user;
    },
    FPUser(req,res){
        let user=req.query.user;
        Model.FWTel(user,function (results) {
            if(results==="OK"){
                if(!req.session.Code){
                    req.session.Code={};
                }
                if(!req.session.user){
                    req.session.user={};
                }
                req.session.user.user=user;
                req.session.user.stat=false;
            }
            res.send(results);
        })
    },
    restartPW(req,res){
        let password=req.body.password;
        let tel=req.session.user.tel;

},
    getPersonal(req,res){
        if(req.session.user){
            res.render("user1/personal_info",req.session.user);
        }else {
            res.render("login");
        }

    },
    getSafe(req,res){
        if(req.session.user){
            res.render("user1/safe-center",req.session.user)
        }else {
            res.render("login");
        }
    },
    getOder(req,res){
        if(req.session.user){
            let user_id=req.session.user.user_id;
            Model.getOrder(user_id,function (results) {
                console.log(results);
                req.session.user.order=results;
                console.log(req.session.user.order);
                res.render("user1/order",req.session.user);
            });
        }else {
            res.render("login");
        }

},
    findPW(req,res){
        let user = req.body.user;
        Model.findUser(user,function (results) {
            if(results!="error"){
                console.log(req.session);
                req.session.findPW={
                    sid:0
                };
                req.session.findPW.state=1;
                req.session.findPW.tel=results.tel;
                req.session.findPW.account_id=results.account_id;
                req.session.findPW.phone=tools.phone(results);
                res.send(req.session.findPW.phone);
            }else {
                res.send("error");
            }
        })
    },
    findPWGetCode(req,res){
        if(req.session.findPW.state && req.session.findPW.state==1){
            let code = parseInt(Math.random()*999999).toString().padStart(6,"0");
            if(!req.session.findPW.code){
                req.session.findPW.code=[];
            }
            console.log("进入findPWGetCode");
            SMS.sendSMS(req.session.findPW.tel,code,function (resutls) {
                if(resutls=="OK"){
                    Code.addCode(req.session.findPW.code,code);
                    req.session.findPW.state=2;
                    res.send("OK");
                }else {
                    res.send("error");
                }
            })
        }else {
            res.send("500");
        }

    },
    findPWCheckCode(req,res){
        if(req.session.findPW.state && req.session.findPW.state==2){
            let code=req.body.code;
            Code.checkCode(req.session.findPW.code,code,function (flag) {
                if(flag){
                    req.session.findPW.state=3;
                    res.send("OK");
                }else {
                    res.send("error");
                }
            })
        }else {
            res.send("500");
        }

    },
    findPWNewPW(req,res){
        if(req.session.findPW.state && req.session.findPW.state==3){
            let newPassword=req.body.password;
            Model.alterPW(req.session.findPW.account_id,newPassword,function (results) {
                res.send(results);
            });
        }else {
            res.send("500");
        }
    },
    //查询数据库All
    async queryUser(req,resp){
        let data=await userDao.query();
        resp.send(data.data);
        // console.log(data.data);
    },
    //删除用户
    async deleteUser(req,resp){
        // console.log("进入控制层");
        let myId=req.query.myId;
        // console.log(req);
        let data=await userDao.delete([myId]);
        resp.send(data);
    },
    //按姓名搜索
    async searchUser(req,resp){
        console.log("进入控制层");
        let name=req.query.searchName;
        console.log(name);
        console.log(typeof name);
        let data=await userDao.search([name]);
        // console.log(await userDao.search([name]));
        resp.send(data);
    }
}
module.exports=User;