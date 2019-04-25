/**
 * 登陆后回调
 * @return {[type]} [description]
 */
function loginInit(){
     userinfo();    
}
/**
 * 微信初始化后回调
 * @return {[type]} [description]
 */
function pageInit(){

}
/**
 * 首次分享回调接口
 */
var isInvite = false;

function inviteshare() {
    if (!isInvite) {
        ja.ajax({
            url: BASE_URL + 'inviteshare',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                if (data.code == '10000') {
                    //分享回调成功
                    isInvite = true;
                }
            }
        });
    }
}


/**
 * 领取邀请任务奖励
 */
function invitetask() {
    ja.ajax({
        url: BASE_URL + 'invitetask',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data.code == '10000') {
                $("#pop-collect2 span").text(data.data.point);
                popup($("#pop-collect2"));
                data.data.inviteTask=2;
                reloadUserinfo(data.data);
            } else if (data.code == '3401') {
                alert("不满足领取条件");
            } else if (data.code == '3402') {
                alert("已经领取过");
            } else if (data.code == '3403') {
                alert("领取失败");
            } else if (!commonErrPop(data)) {

            }
        }
    });
}

/**
 * 领取登陆任务奖励
 */
function logintask() {
    ja.ajax({
        url: BASE_URL + 'logintask',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data.code == '10000') {
                $("#pop-collect2 span").text(data.data.point);
                popup($("#pop-collect2"));
                data.data.loginTask=2;
                reloadUserinfo(data.data);
            } else if (data.code == '3401') {
                // alert("不满足领取条件");
                popup($("#pop-collect1"));
            } else if (data.code == '3402') {
                alert("已经领取过");
            } else if (data.code == '3403') {
                alert("领取失败");
            } else if (!commonErrPop(data)) {

            }
        }
    });
}

/**
 * 开始答题
 */
function question() {
    ja.ajax({
        url: BASE_URL + 'question',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data.code == '10000') {
                reloadQuestion(data.data);
            } else if (data.code == '3402') {
                alert("已经完成过");
                data.data.questionTask=2;
            } else if (!commonErrPop(data)) {

            }
        }
    });
}

/**
 * 答题
 */
function answer(opt) {
    var questionuuid = $("#pop-collect3 .t-list").attr("questionuuid");
    ja.ajax({
        url: BASE_URL + 'answer',
        type: 'POST',
        dataType: 'json',
        data: {
            questionuuid: questionuuid,
            myanswer: opt
        },
        success: function (data) {
            if (data.code == '10000') {
                $("#pop-collect2 span").text(data.data.point);
                hideMask($('#pop-collect3'));
                popup($("#pop-collect2"));
                data.data.questionTask=2;
                reloadUserinfo(data.data);
            } else if (data.code == '3401') {
                reloadQuestion(data.data)
            } else if (data.code == '3402') {
                data.data.questionTask=2;
                alert("已经领取过");
            } else if (data.code == '1003') {
                alert("答题超时,请重新答题");
                question();
            } else if (!commonErrPop(data)) {

            }
        }
    });
}


function reloadQuestion(data) {
    hideMask($('#pop-collect4'));
    // hideMask($('#pop-collect3'));
    popup($('#pop-collect3'));
    var rightQuestionNum = data.rightQuestionNum;
    var question = data.question;
    $("#pop-collect3 .answer span").text(rightQuestionNum);
    $("#pop-collect3 .t-tit span").text(question.content);
    $("#pop-collect3 .t-list").attr("questionuuid", question.rightAnswer);
    $("#pop-collect3 .t-list span").eq(0).text(question.optA);
    $("#pop-collect3 .t-list span").eq(1).text(question.optB);

}

/**
 * 织造
 */
function convert() {
    ja.ajax({
        url: BASE_URL + 'convert',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data.code == '10000') {
                var num = data.data.userinfo.num;
                $(".dj-txt").hide();
                $(".dj-txt").eq(num - 1).show();
                popup($("#pop-weave3"));
                reloadUserinfo(data.data);

                if(num === 4) {
                    console.log(1)
                    $('.gift-to-four').show();
                }else {
                    console.log(2)
                    $('.gift-to-four').hide();
                }
            } else if (data.code == '1010') {
                popup($("#pop-weave2"));
            } else if (data.code == '5016') {
                popup($("#pop-weave1"));
            } else if (!commonErrPop(data)) {

            }
        }
    });
}