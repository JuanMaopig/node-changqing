const con=require('../config/dbConfig');
const manageDao={
    getConsume(){
        return new Promise((resolve, reject) => {
            let sql="select *from room_consume";
            let arr=[];
            con.connect(sql,arr,function (err,result) {
                if(err){
                    reject(err);
                }else {
                    resolve(result);
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
    }
}
module.exports=manageDao;