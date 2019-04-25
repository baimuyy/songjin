var BASE_URL = "/changyou/songjin/";
var ISLogin = false;
var shareObj = {//默认分享文案
    title: "【新天龙八部X苏州宋锦】助力中华文化传承，赢周年限定纪念币",
    link: window.location.href, //ja.getDomain() + '/xtl/song/'+ ComList.serDir +'/m/index.shtml',//登录后重新设置分享地址为自己的分享邀请页面地址
    imgUrl: "http://i0.cy.com/xtl/pic/2019/04/19/ruihe.jpg",
    desc: "5月6日至5月12日，收集蚕茧织锦绣，赢十二周年纪念币、锦绣如画礼包等豪礼！",
    success: function () {

    }
}
/* funname getQueryString
  * desc 获取地址参数
  * params {name: string}参数名称
  * return {string or null}
  */
function getQueryString(name) {
     var r, reg;
     reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
     r = window.location.search.substr(1).match(reg);
     if (r !== null) {
         return r[2]; //不解码
     }
     return null;
 };
$(document).ready(function () {
    var app = 'xtl';
    var activity = 'songjin';
    var version = '20190402';
    var platform = 'changyou';
    if (isWeiXin()) {
        //console.log('微信')
        ja.simpleConfig(app, activity, version, "wechat", //微信先登录再进行畅游登录初始化
            function (cn) {
                console.log(cn)
                ja.wx.share(shareObj);
                if(window.pageInit){
                    pageInit();
                }                
                if (window.initBack) {
                    readyFunc_wechat();
                }
                ja.user.get('wechat', function(res){
                    firstLight(res.data.openid);
                });
            },
            function (cn) {                
                //检测是否登录了
                ja.ajax({
                    url: ja.options.host + "/changyou/user/info",
                    success: function (data) {
                        if (data.code != 10000) {//未登录
                            //判断微信账号是否已绑定畅游账号，如果绑定了则返回畅游账号
                            ja.ajax({
                                type: 'post',
                                url: "/wechat/auto/isbind",
                                traditional: true,
                                async: false,
                                data: {},
                                dataType: "JSON",
                                success: function (result) {
                                    loginBackFunc_wechat(result);
                                },
                                error: function () {

                                }
                            })
                        } else if (data.code == 10000) {//已登录
                            afterLocation(data.data.openid);
                        }
                    }
                });
            }, 1);
    } else {
        //console.log('非微信');
        alert("请用微信打开页面！")
    }

});

/**
 * 已绑定账号自动登录
 * @return {[type]}
 */
function wechatAutoLogin() {
    ja.ajax({
        url: ja.options.host + "/changyou/user/info",
        success: function (data) {
            if (data.code != 10000) {
                ja.ajax({
                    type: 'post',
                    url: "/wechat/auto/autologin",
                    traditional: true,
                    async: false,
                    data: {},
                    dataType: "JSON",
                    success: function (result) {
                        wechatAutoLoginBack(result);
                    },
                    error: function () {

                    }
                });
            } else if (data.code == 10000) {
                afterLocation(data.data.openid);
            }
        }
    });
}

/**
 * 判断是否微信浏览器
 * @return {Boolean}
 */
function isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}


//验证参数
function validate(value) {
    if (value == null || value == 'null' || value == '' || value == undefined) {
        return false;
    } else {
        return true;
    }
}


//=========================================================================
/**
 * 通用错误提示
 * @param  {obj} data ajax请求返回的对象
 * @return {bool} 不是通用错误代码返回true
 */
function commonErrPop(data) {
    var flag = false;
    //1202请求参数缺失或者为空  1209操作频繁
    if (data.code == '1207' || data.code == '1200' || data.code == '1007' || data.code == '0' || data.code == '1209' || data.code == '5010') {
        alert("系统繁忙，请稍后重试！");
    } else if (data.code == '2131') { //等级不够
        hideMask($(".pop"));//关闭所有弹窗
        popup($("#pop-tips2"));
    } else if (data.code == '3103') { //账号封停
        hideMask($(".pop"));//关闭所有弹窗
        popup($("#pop-tips1"));
    } else if (data.code == '1019' || data.code == '1012') { //登录状态检测失败
        hideMask($(".pop"));//关闭所有弹窗
        login();
        // popup($('.pop5'));
    } else {
        flag = true;
    }
    return flag;
}


/**
 * 微信平台页面初始化后
 */
function readyFunc_wechat(result) {
}

/**
 * 微信授权登录登录后
 * @return {[type]} [description]
 */
function loginBackFunc_wechat(result) {
    if (result.code == 10000) { //已绑定微信，弹窗提示选择
        //查询绑定账号
        $("#pop-login1-isbind em").text(result.data);
        $("#pop-login1-isbind").show();
        $("#pop-login1-isnotbind").hide();
    } else if (result.code == 3500) { //微信未绑定畅游账号
        $("#pop-login1-isbind").hide();
        $("#pop-login1-isnotbind").show();
    }
}

function wechatAutoLoginBack(result) {
    if (result.code == 10000) {
        $(".mail").text(result.data);
        hideMask($(".pop"));//关闭所有弹窗
        popup($('#pop-login3'));
        afterLocation(result.data);
    } else {
        hideMask($(".pop"));//关闭所有弹窗
        popup($(".pop5"));
    }
}


/**
 * 登陆后回调，设置用户名
 * @param  {[type]} cn [description]
 * @return {[type]}    [description]
 */
function afterLocation(cn) {
    ISLogin = true;
    $('.red-c').show();
    $(".logined span").text(cn);
    $(".unlogin").hide();
    $(".logined").show();    
    if(window.loginInit){
        loginInit();
    }    
    // hideMask($(".pop5"));
    // actInit();
}


//登录按钮
function login() {
    ja.user.get('changyou', function (data) {
        afterLocation(data.data.openid);
    }, 1);
}

//注销按钮
function logout() {
    ja.ajax({
        type: 'POST',
        url: "/wechat/auto/cancel",//解除微信号和活动的绑定后再注销
        success: function (data) {
            ja.logout();
        },
        error: function () {
            ja.logout();
        }
    });
}

/**
 * 加载活动用户信息
 */
function userinfo() {
    ja.ajax({
        url: BASE_URL + 'userinfo',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data.code == '10000') {
                reloadUserinfo(data.data);
            } else if (!commonErrPop(data)) {

            }
        }
    });
}

function reloadUserinfo(data) {
    var canReceive = false;
    var userinfo = data.userinfo;
     //登陆后重新设置分享文案
     ja.user.get('wechat', function(res){
        var openid = res.data.openid;
        var nickname = res.data.nickname;
        shareObj.link = ja.getDomain() + '/xtl/luck/20190408/mobile/share.shtml?id='+ userinfo.invite +'&openid='+ openid +'&nick=' + encodeURIComponent(nickname);
        ja.wx.config(function () {
            ja.wx.share(shareObj);
        })
    });    
    //蚕茧点数
    $('.c-num em').text(userinfo.point);
    //加载玩家进度和拼图
    loadCallback(userinfo.sequence);
    //加载任务状态
    switch (data.inviteTask) {
        case 0://未完成
            $(".yaoq-btn").show();
            $(".k-mod .lq-btn").eq(0).hide();
            $(".k-mod .ywc-btn").eq(0).hide();
            break;
        case 1://已完成待领取
            canReceive = true;
            $(".yaoq-btn").hide();
            $(".k-mod .lq-btn").eq(0).show();
            $(".k-mod .ywc-btn").eq(0).hide();
            break;
        case 2://已完成已领取
            $(".yaoq-btn").hide();
            $(".k-mod .lq-btn").eq(0).hide();
            $(".k-mod .ywc-btn").eq(0).show();
            break;
        default:
    }
    switch (data.loginTask) {
        case 0://未完成
            $(".dwc-btn").show();
            $(".k-mod .lq-btn").eq(1).hide();
            $(".k-mod .ywc-btn").eq(1).hide();
            break;
        case 1://已完成待领取
            canReceive = true;
            $(".dwc-btn").hide();
            $(".k-mod .lq-btn").eq(1).show();
            $(".k-mod .ywc-btn").eq(1).hide();
            break;
        case 2://已完成已领取
            $(".dwc-btn").hide();
            $(".k-mod .lq-btn").eq(1).hide();
            $(".k-mod .ywc-btn").eq(1).show();
            break;
        default:
    }
    switch (data.questionTask) {
        case 0://未完成
            $(".start-btn").show();
            $(".k-mod .ywc-btn").eq(2).hide();
            canReceive = true;
            break;
        case 1://已开始未完成
            $(".start-btn").show();
            $(".k-mod .ywc-btn").eq(2).hide();
            canReceive = true;
            break;
        case 2://已完成已领取
            $(".start-btn").hide();
            $(".k-mod .ywc-btn").eq(2).show();
            break;
        default:
    }
    //可收集蚕茧状态
    if (canReceive && ISLogin) {
        $('.red-c').show();
    } else {
        $('.red-c').hide();
    }
}

//首次进来光效
function firstLight(wxid){
    var wid = localStorage.getItem("wxid");
    if(wid != wxid){
        $(".hl-btn").addClass('ani');
        localStorage.setItem("wxid",wxid);
    }else{
        
    }
}

//设置绑定微信地址与当前环境地址一致
$("#pop-login1-isnotbind .bd-btn").attr("href",ja.getDomain() + '/xtl/wxBind/20180910/mobile/index.html')