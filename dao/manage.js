const con=require('../config/dbConfig');
const manageDao={
    /***
     * start number 起始下标
     * length number 查询数量
     */
    getConsume(start,length){
        return new Promise((resolve, reject) => {
            let sql="";
            let arr=[];
            if(start==undefined || length==undefined){
                 sql="select *from room_consume";
                 arr=[];
            }else {
                sql="select *from room_consume limit ?,?";
                arr=[start,length];
            }
            console.log(sql);
            con.connect(sql,arr,function (err,result) {
                if(err){
                    //查询出错,返回出错信息
                    reject({status:"err",err});
                }else {
                    if(result.length>0){
                        //查询成功，有记录state:1返回记录
                        resolve({status:"ok",state:1,result});
                    }else {
                        //查询成功，无记录，state:0
                        resolve({status:"ok",state:0,result,msg:"无记录"})
                    }

                }
            })
        })
    },
    getAllHotelName(){
        return new Promise((resolve, reject) => {
            let sql="select * from hotel";
            let arr=[];
            con.connect(sql,arr,(err,result)=>{
                if(err){
                    reject(err)
                }else {
                    let hotel={};
                    for (let value of result){
                        hotel[value.hotel_id]=value.hotelname;
                    }
                    resolve(hotel);
                }
            })
        })
    },
    getAllActive(){
        return new Promise((resolve, reject) => {
            let sql="select *from active_consume";
            let arr=[];
            con.connect(sql,arr,(err,result)=>{
                if(err){
                    reject(err);
                }else {
                    let active={};
                    for (let value of result){
                        active[value.active_consume_id]=value.active_consume_name;
                    }
                    resolve(active);
                }
            })
        })
    },
    getConsumeID(room_consume_id){
        return new Promise((resolve, reject) => {
            let sql="select active_consume_id from room_active_consume where room_consume_id=?";
            let arr=[room_consume_id];
            con.connect(sql,arr,(err,result)=>{
                if(err){
                    reject(err);
                }else {
                    let activeConsumeId=[];
                    for (let value of result){
                        activeConsumeId.push(value.active_consume_id);
                    }
                    resolve(activeConsumeId);
                }
            })
        })
    },
    getCountConsume(){
        return new Promise((resolve, reject) => {
            let sql="select count(*) as count from room_consume"
            con.connect(sql,[],(err,result)=>{
                if(err){
                    reject({status:"err",err})
                }else {
                    resolve(result[0].count);
                }
            })
        })
    }
}
module.exports=manageDao;