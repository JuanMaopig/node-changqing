const manageDao = require('../dao/manage');
const manage={
    //得到所有套餐
    async getAllConsume(req,res){
        let activeName = manageDao.getAllActive();
        let hotelName = manageDao.getAllHotelName();
        let consume = await manageDao.getConsume();
        let active=[];
        activeName = await activeName;
        hotelName = await hotelName;
        for (let i=0;i<consume.length;i++){
            consume[i].hotelname=hotelName[consume[i].hotel_id];
            active[i]=manageDao.getConsumeID(consume[i].room_consume_id);
        }
        active= await Promise.all(active);
        for (let i=0;i<consume.length;i++){
            consume[i].active_id=active[i];
        }
        res.send({consume,activeName,hotelName});
    },
    async getConsume(req,res){
        let startPage=parseInt(req.query.start);
        let length=parseInt(req.query.length);
        let activeName = manageDao.getAllActive();
        let hotelName = manageDao.getAllHotelName();
        let pageCount = manageDao.getCountConsume();
        let consume =  manageDao.getConsume(startPage,length);
        let active=[];
        consume=await consume;
        if(consume.state==1){
            consume=consume.result;
        }else if(consume.state==0){
            pageCount = await pageCount;
            if(pageCount!=0){
                if(pageCount%length==0){
                    consume =  await manageDao.getConsume((pageCount-length),length);
                    consume = consume.result;
                }else {
                    consume =  await manageDao.getConsume((pageCount/length)*length,length);
                    consume = consume.result;
                }
            }else {
                consume=[];
            }
        }
        for (let i=0;i<consume.length;i++){
            active[i]=manageDao.getConsumeID(consume[i].room_consume_id);
        }
        active= await Promise.all(active);
        for (let i=0;i<consume.length;i++){
            consume[i].active_id=active[i];
        }
        pageCount = await pageCount;
        console.log(pageCount)
        activeName = await activeName;
        hotelName = await hotelName;
        res.send({consume,activeName,hotelName,pageCount});
    }
}

module.exports=manage;