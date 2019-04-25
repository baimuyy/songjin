var Share = {
    myNick:'',
    fNick:'',
    inviteCode:'',
    myOpenId:'',
    fOpenid:''
}

/**
 * 登陆后回调
 * @return {[type]} [description]
 */
function loginInit(){
    
}
/**
 * 微信初始化后回调
 * @return {[type]} [description]
 */
function pageInit(){
    Share.inviteCode = getQueryString("id");
    Share.myOpenId = getQueryString("openid");
    Share.fNick = decodeURIComponent(getQueryString("nick"));
    ja.user.get('wechat', function(res){
       Share.fOpenid = res.data.openid;
       Share.myNick = res.data.nickname;
       shareUserInfo();
    });
}
/**
 * 接受邀请
 * @param  {[type]} inviteCode 邀请码  
 * @return {[type]}  
 */
function invite(inviteCode) {
    ja.ajax({
        url: BASE_URL + 'invite',
        type: 'POST',
        dataType: 'json',
        data:{inviteCode:inviteCode},
        success: function (data) {
            if (data.code == '10000') {
                popup($("#pop-yaoq1"));
            } else if (data.code == '1003') {//邀请人不存在
                alert("邀请人不存在");
            } else if (data.code == '2102') {//邀请人绑定数量超过上限
                popup($("#pop-yaoq5"));
            } else if (data.code == '2101') {//自己邀请自己
                popup($("#pop-yaoq6"));
            } else if (data.code == '1024') {//账号已被成功邀请过
                popup($("#pop-yaoq2"));
            } else if (data.code == '3506') {//账号已被其他用户邀请成功过
                popup($("#pop-yaoq10"));
            } else if (data.code == '3504') {//微信用户已经被其他用户成功邀请过
                popup($("#pop-yaoq4"));
            } else if (data.code == '2129') {//已经拥有下级用户
                popup($("#pop-yaoq9"));
            } else if (data.code == 'yaoq8') {//你的等级不符合要求
                popup($("#pop-yaoq8"));
            } else if (!commonErrPop(data)) {

            }
        }
    });
}

function shareUserInfo(){
    //昵称文字竖排 超出部分以省略号...显示
    LimitNumber1(Share.myNick, 'm-name');
    LimitNumber2(Share.fNick, 'y-name');
    if(Share.myOpenId == Share.fOpenid || !Share.myNick){//邀请人是自己，不显示亲爱的 XX
        $(".x-list li").eq(0).hide();
    }else{
        $(".x-list li").eq(0).show();
    }
}

$(".accept-btn").click(function(event) {
    if(window.ISLogin){
        invite(Share.inviteCode);
    }else{
        login();
    }
});

//跳转到首页
$('.home-btn').on('click', function () {
    window.location.replace("index.shtml");
});


function LimitNumber1(txt, idName) {
    var str = txt;
    str = str.substr(0, 8);
    var id = document.getElementById(idName);
    id.innerText = str;
    if (str.length >= 8) {
        $('.poi').css('display', 'block');
    }
}

function LimitNumber2(txt, idName) {
    var str = txt;
    str = str.substr(0, 8);
    var id = document.getElementById(idName);
    id.innerText = str;
    if (str.length >= 8) {
        $('.poi').css('display', 'block');
    }
}


//弹窗调用 登录测试
$('.login-btn').click(function () {
    popup($('#pop-login1'));
});