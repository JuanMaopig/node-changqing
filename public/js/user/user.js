//跳转个人信息页
$(".personal_info").bind("click",function () {
    window.location.href="/user/personal_info.html"
});
//跳转我的订单页
$(".order").bind("click",function () {
    window.location.href="/user/order.html"
});
//跳转账户安全页
$(".safe-center").bind("click",function () {
    window.location.href="/user/safe-center.html"
});
//跳转退出登录页
$(".exit").bind("click",function () {
    $.get({
        url:"/user/exitUser",
        dataType:"json",
        success(result){
            if(result.state==1){
                window.location.href="/home.html"
            }
        }
    })
});
