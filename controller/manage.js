const manageDao = require('../dao/manage');
const manage={
    async getConsume(req,res){
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
            // consume[i].active=[];
            // for (let j=0;j<active[i].length;j++){
            //     consume[i].active.push(activeName[active[i][j]]);
            // }
        }

        res.send({consume,activeName,hotelName});
    }
}

module.exports=manage;