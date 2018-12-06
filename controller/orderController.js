/**
 * Created by Administrator on 2018/11/7 0007.
 */

//引用orderDao
const orderDao=require("../dao/orderDao");
const tools=require('../config/tools');
const Model=require("../dao/dao");
const manage=require("../dao/manage");
const orderController={

    transferData(req,res){
        req.session.order={};
        req.session.order.hotelname=req.body.hotelname;
        req.session.order.in_date=req.body.in_date;
        req.session.order.out_date=req.body.out_date;
        req.session.order.room_number=req.body.room_number;
        req.session.order.adultNum=req.body.adultNum;
        req.session.order.childNum=req.body.childNum;

        //入住天数---方法一：
        // if(parseInt(req.session.order.out_date.substr(8,2))-parseInt(req.session.order.in_date.substr(8,2))>0){
        //     var sum=parseInt(req.session.order.out_date.substr(8,2))-parseInt(req.session.order.in_date.substr(8,2));
        //
        // }else{
        //     if((req.session.order.in_date.substr(5,2)%2==0&&req.session.order.in_date.substr(5,2)<8)||(req.session.order.in_date.substr(5,2)%2==1&&req.session.order.in_date.substr(5,2)>=8)){
        //       var  sum=30-parseInt(req.session.order.in_date.substr(8,2))+parseInt(req.session.order.out_date.substr(8,2));
        //
        //     }else{
        //         var  sum=31-parseInt(req.session.order.in_date.substr(8,2))+parseInt(req.session.order.out_date.substr(8,2));
        //     }
        // }

        //入住天数---方法二：
        var sum1=new Date(req.session.order.in_date);
        var sum2=new Date(req.session.order.out_date);
        var sum=(sum2-sum1)/(60*1000*24*60);
        req.session.order.sum=sum;
        res.render("option",req.session.order);
    },
/**
 * order object 存放订单的对象
 * order.room_number  string 客房数量
 * order.adultNum string 成人数量
 * order.hotel_id num 酒店id
 * order.room   Array 房间信息
 * order.serverMoney Array 服务费
 * order.tax Array 税金
 * order.allMoney Array 总价
 * */

   async transferRoom(req,res){
    if(req.session.order&&req.session.order.room!=undefined){
        res.render("room",req.session.order);
    }else {
        if(req.route.methods.post==true){

            req.session.order.room_number=req.body.rooms;
            req.session.order.adultNum=req.body.adults;
            req.session.order.hotel_id=1;
                console.time("async");
            let arr_date=tools.getAllDdy(req.session.order.in_date,req.session.order.out_date);;//存放入住日期到离店日期之间的所有日期
            let room_type_id=[];//存放查询在指定日期内满足房间数量的房间类型id变量
            let name="";//存放对象属性名的变量
            let obj_room ={};//将房间号以'id_?'的形式存储在对象中
            let roomTypeID=[];//存放符合入住时间条件的房间类型号数组
            let num=req.session.order.sum;//需要的房间数量
            //查询选定酒店下的所有房间类型id
            let room=orderDao.asyncQueryRoom(req.session.order.hotel_id);
            //查询所有活动
            let active = manage.getAllActive();
            let device = orderDao.asyncQueryAllDevice();
            //查询指定酒店下的所有套餐
            let roomConsume=orderDao.asyncQueryRoomConsume(req.session.order.hotel_id);
            //等待结果返回
            room=await room;
            //将查询到的房间类型号依次做obj_room对象的属性名(id_id)，属性值为该型号下的房间数量
            for(let i=0;i<room.length;i++){
                name="id_"+room[i].room_type_id;
                obj_room[name]=room[i].roomNum;
            }
            //遍历入住日期到离店日期之间房间类型是否满足条件
            room_type_id=room_type_id.map(function (value) {
                orderDao.asyncQueryRoomNum(value)
            })
            for (let i=0;i<arr_date.length;i++){
                room_type_id[i]=orderDao.asyncQueryRoomNum(obj_room,arr_date[i],num);
            }
            //等待结果返回
            room_type_id = await Promise.all(room_type_id);

            //将obj_room对象的所有值改为true
            for(let name in obj_room){
                obj_room[name]=true
            }
            /**
             * 遍历room_type_id对象数组中的每一个对象属性
            * 只要有一天的房型不满足要求则该房型的属性值为false
            * */
            for (let i=0;i<room_type_id.length;i++){
                for (let name in room_type_id[i]){
                    if(!room_type_id[i][name]){
                        obj_room[name]=false
                    }
                }
            }
            //遍历room数组，将不符合条件的记录删除掉
            for (let i=0;i<room.length;i++){
                if(!obj_room["id_"+room[i].room_type_id]){
                    room.splice(i,1);
                    i--;
                }
            }
            //根据房间类型id遍历查询每个房间类型id下的套餐
            for (let i=0;i<room.length;i++){
                room[i].consume=orderDao.asyncQueryRoomConsume(room[i].room_type_id);
            }
            //根据房间类型id遍历查询每个房间类型id下的设备
            for (let i=0;i<room.length;i++){
                room[i].device=orderDao.asyncQueryRoomDevice(room[i].room_type_id);
            }
            for (let i=0;i<room.length;i++){
                //等待room[i].consume的值返回并赋值给room[i].consume，循环room[i].consume求出每种套餐对应的套餐内容
                room[i].consume=await room[i].consume;
                for (let j=0;j<room[i].consume.length;j++){
                    room[i].consume[j].active_consume=
                        orderDao.asyncQueryActiveConsume(room[i].consume[j].room_consume_id);
                }
            }
            for (let i=0;i<room.length;i++){
                for (let j=0;j<room[i].consume.length;j++){
                    room[i].consume[j].active_consume=
                        await room[i].consume[j].active_consume;
                }
            }
            for (let i=0;i<room.length;i++){
                room[i].device=await room[i].device;
            }
            req.session.order.serverMoney=[];
            req.session.order.tax=[];
            req.session.order.allMoney=[];
            for(let i=0;i<room.length;i++){
                req.session.order.serverMoney[i]=[];
                req.session.order.tax[i]=[];
                req.session.order.allMoney[i]=[];
                for(let n=0;n<room[i].consume.length;n++){
                    req.session.order.serverMoney[i][n]=(room[i].consume[n].consume_price)*0.1;//服务费
                    req.session.order.tax[i][n]=(room[i].consume[n].consume_price)*0.066;//税金
                    req.session.order.allMoney[i][n]=(room[i].consume[n].consume_price)*(req.session.order.sum)+(req.session.order.serverMoney[i][n])+(req.session.order.tax[i][n]);
                }
            }
            active=await active ;
            device=await device;
            req.session.order.room={room,active,device};
            res.render("room",req.session.order);
            console.timeEnd("async")
        }else {
            res.render("home");
        }
    }
    },

    //将值传给guest.ejs页面
    transferGuest(req,res){
        //通过room.ejs界面的“立即预定”按钮的a标签传递过来的信息，一共传了5个数据，所以打印出来一共5个
        let coord_i=req.query.coordI;
        let coord_n=req.query.coordN;
        if(req.session.user){

            //将传过来的数据存入order
            req.session.order.s_tax=req.session.order.tax[coord_i][coord_n];
            req.session.order.s_serverMoney=req.session.order.serverMoney[coord_i][coord_n];
            req.session.order.s_allMoney=req.session.order.allMoney[coord_i][coord_n];
            req.session.order.s_roomPrice=req.session.order.room[coord_i].room_consume[coord_n].consume_price;
            req.session.order.s_room_consume_id=req.session.order.room[coord_i].room_consume[coord_n].room_consume_id;
            req.session.order.s_room_type_id=req.session.order.room[coord_i].room_type_id;

            //查房屋名 并返回给guest.ejs
            orderDao.requryGuestRoom(req.session.order.room[coord_i].room_type_id,function (obj) {
                req.session.order.room_type_name=obj.room_type_name;
                req.session.order.roomPrice=obj.roomPrice;

                //查套餐名 并返回给guest.ejs
                orderDao.requryGuestConsume(req.session.order.room[coord_i].room_consume[coord_n].room_consume_id,function (obj) {
                    req.session.order.room_consume_name=obj;

                    //将信息返给guest.ejs
                    res.render("guest",req.session.order);
                });

            });

        }else{
            req.session.preUrl=req.url;
            res.render("login");
        }
    },


    transferComfirm(req,res){
        req.session.order.UserOrder={};
        for (let name in req.body){
            req.session.order.UserOrder[name]=req.body[name];
        }
        if(req.session.order.s_allMoney>100&&req.session.order.s_allMoney<1000){
            req.session.order.subscription=100;
        }
        if(req.session.order.s_allMoney>1000&&req.session.order.s_allMoney<10000){
            req.session.order.subscription=1000;
        }
        if(req.session.order.s_allMoney>10000){
            req.session.order.subscription=10000;
        }
        res.render("comfirm",req.session.order);
    },

    //提交订单
    transferUpOrder(req,res){
        if(req.session.order&&req.session.order.UserOrder!=undefined){
            let order=tools.UpOrder(req.session.order.UserOrder,req.session.order);
            order["user_id"]=req.session.user["user_id"];
            orderDao.upOrder(order,function (result) {
                if(result){
                    req.session.order=null;
                    res.render("home");
                }
            });
        }else {
            res.render("home");
        }
    }
};

module.exports=orderController;
