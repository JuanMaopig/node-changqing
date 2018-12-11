const userDb=require("../config/dbConfig");
const userDao={
    query(){
        return new Promise((resolve, reject) => {
            let sql="select * from user";
            userDb.connect(sql,[],(err,data)=>{
                if (err){
                    reject({state:"err",err})
                } else{
                    resolve({state:"ok",data})
                }
            })

        })
    },
    delete(value){
        return new Promise((resolve, reject) => {
            // console.log("进入Dao层");
            let sql="delete from user where user_id=?";
            userDb.connect(sql,value,(err,data)=>{
                if (err){
                    reject({state:"err",err})
                } else{
                    resolve({state:"ok",info:"删除成功"})
                }
            })
        })
    },
    search(value){
        console.log("进入Dao层"+value);
        return new Promise((resolve, reject) => {
            let sql="select * from user where username like \"%\"?\"%\"";
            userDb.connect(sql,value,(err,data)=>{
                if (err){
                    reject({state:"err",err});
                    console.log(err);
                    console.log(sql);
                }else{
                    resolve(data);
                    console.log("ok",data)
                }
            })
        })
    }
};
module.exports=userDao;