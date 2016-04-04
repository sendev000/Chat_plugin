(function($) {

// Localize jQuery variable
var jQuery;
//var mywidget = null, widgetID = "";
//var msg_ind = 0;
var msg_length = 0;
var messages = null;
var onlineUsers = 0;
// var json_url = "https://dev-new.carrot.com/api/r/carrot";
var json_url = "sample_carrot_json.json";
var COLORS = ['#EF3C79', '#DA125F', '#990C42', '#AD41BF', '#8F18AC', '#641079', '#7F53C4', '#5E2DB3', '#41207E', '#5B68C3', '#3745AE', '#27307A', '#15B5F9', '#009AE8', '#006BA2', '#19A69A', '#008A7B', '#006056', '#9BCE5E', '#7AB538', '#567E28', '#D4E34A', '#C0CC19', '#868E11', '#E9D82E', '#FED910', '#B2980D', '#FFA700', '#B26200', '#FF7137', '#FA5200', '#AF3800', '#F55349', '#EB372C', '#A4251E', '#76909D', '#526E7B', '#394D56', '#8F6E62', '#6F4B40', '#4D342C'];
var validCharacterRegex = /[a-zA-Z0-9]/;
var widgetWidth = 304, widgetHeight = 421, minHeight = 40;
var chatTitle = "";
var imgURLArray = ["https://s3.amazonaws.com/carrot-prod-assets/icons/the_donald.png"           // 0 - logo
                , "https://s3.amazonaws.com/carrot-prod-assets/svg/icon__arrow-black.svg "      // 1 - upper arrow
                , "https://s3.amazonaws.com/carrot-prod-assets/svg/icon__donger.svg"            // 2 - chat area
                , "https://s3.amazonaws.com/carrot-prod-assets/svg/icon__close-embed.svg"       // 3 - close icon
                , "https://s3.amazonaws.com/carrot-prod-assets/svg/icon__minimize-embed.svg"    // 4 - minimize icon
                , "https://carrot-prod-assets.s3.amazonaws.com/svg/icon__system--pencil.svg"    // 5 - pencil
                , "https://carrot-prod-assets.s3.amazonaws.com/svg/icon__system--join.svg"      // 6 - system join
                , "https://carrot-prod-assets.s3.amazonaws.com/svg/icon__system--leave.svg"     // 7 - system leave
                , "https://carrot-prod-assets.s3.amazonaws.com/svg/icon__system--ban.svg"       // 8 - system ban
                , "https://s3.amazonaws.com/carrot-prod-assets/svg/icon__system--flag.svg"      // 9 - system flag
                ];
var imgArray = [];
var msgType = { "message" : "",
                "user:statusChange" : "user changed status",
                "room:join" : "user joined a room",
                "room:leave" : "user left room",
                "room:leave:kicked" : "user was kicked from room",
                "room:leave:banned" : "user was banned from room",
                "room:update:title" : "title changed",
                "room:update:description" : "description changed",
                "room:moderator:add" : "moderator added",
                "room:moderator:remove" : "moderator removed"
            };
var iconUrl = {"message": "",
                "user:statusChange" : imgURLArray[5],
                "room:join" : imgURLArray[6],
                "room:leave" : imgURLArray[7],
                "room:leave:kicked" : imgURLArray[7],
                "room:leave:banned" : imgURLArray[8],
                "room:update:title" : imgURLArray[5],
                "room:update:description" : imgURLArray[5],
                "room:moderator:add" : imgURLArray[5],
                "room:moderator:remove" : imgURLArray[5]
            };
$.fn.widgetStart = function(json_url) {
    /******** Load jQuery if not present *********/
    mywidget = this;
    jQuery = window.jQuery;
    main(mywidget);
    return this;
}

/******** Our main function ********/
function main(mywidget) { 
    // console.log("main function is called");
    jQuery(document).ready(function($) {         
        if (mywidget != null)
        {
            widgetID = mywidget.selector.substr(1);
            $(mywidget.selector).css('width',widgetWidth + "px");
            $(mywidget.selector).css('height',widgetHeight + "px");
            // $(mywidget.selector).css('overflow',"hidden");
            preload(imgURLArray);
            makeMinimizeWidget(mywidget);
            loadingJson(mywidget);
            // setTimeout(function(){loadingJson(mywidget)}, 10);
        }
        // $(mywidget.selector).find('#close_chat_qwer1234').on('click', function(){
        //     console.log("fewqfweq");
        // })
    });
}
/* Load messages */
function loadingJson(mywidget){
    if (mywidget != null)
    {
        $.getJSON(json_url, function(data) {
            //$(mywidget.selector).html("This data comes from another server: " + data);
            messages = data.response.messages;
            if (messages != null)
            {
                msg_length = messages.length;
                onlineUsers = data.response.numUsersOnline;
                chatTitle = data.response.room.slug;
                $(mywidget.selector).find('#title_qwer1234').html(chatTitle);
                msg_ind = 0;
                setTimeout(function(){makeNormalWidget(mywidget); displayMessages(mywidget, msg_ind)}, 3000);
            }
        });
    }
}
// when click title bar - maximize
$(document).on('click', '.header_qwer1234' , function() {
    var $mywidget = $(this).parent().parent();
    if ($mywidget != undefined && $mywidget != null)
    {
        if ($mywidget.find('#body_qwer1234').css('display') == 'block') return;
        $mywidget.find("#body_qwer1234").css('display','block');
        $mywidget.find("#head_qwer1234").animate({top:"-=" + (widgetHeight-40) + "px"}, 60, function(){ });
        $mywidget.find("#body_qwer1234").animate({bottom:"+=" + (widgetHeight-40) + "px"}, 60, function(){ });
        $mywidget.find('#chat_input_qwer1234').animate({bottom:"+=" + (widgetHeight-40) + "px"}, 60, function(){});
        // $mywidget.find("#head_qwer1234").css('bottom','');
        // $mywidget.find("#head_qwer1234").css('top','0px');
        // $mywidget.find('#body_qwer1234').fadeIn(500);
        // $mywidget.find('#chat_input_qwer1234').fadeIn(500);
        $mywidget.find("#chat_qwer1234").css('background',"#f4f7f9");
        $mywidget.find("#chat_qwer1234").css('box-shadow',"2px 2px 1px #888888");
    }
});
// When click minimize button
$(document).on('click', '.minimizeChatBtn' , function() {
    //if ($(this).parent().parent().parent().attr('id') == widgetID)
    {
        var $mywidget = $(this).parent().parent().parent();
        if ($mywidget != undefined && $mywidget != null)
        {
            if ($mywidget.find('#body_qwer1234').css('display') == 'none') return;
            $mywidget.find("#head_qwer1234").animate({top:"+=" + (widgetHeight-40) + "px"}, 60, function(){});
            $mywidget.find("#body_qwer1234").animate({bottom:"-=" + (widgetHeight-40) + "px"}, 60, function(){ $mywidget.find("#body_qwer1234").css('display','none'); });
            $mywidget.find('#chat_input_qwer1234').animate({bottom:"-=" + (widgetHeight-40) + "px"}, 60, function(){});
            // $mywidget.find("#head_qwer1234").css('top','');
            // $mywidget.find("#head_qwer1234").css('bottom','0px');
            // $mywidget.find('#body_qwer1234').fadeOut(500);
            // $mywidget.find('#chat_input_qwer1234').fadeOut(500);
            $mywidget.find("#chat_qwer1234").css('background',"");
            $mywidget.find("#chat_qwer1234").css('box-shadow',"");
        }
    }
});
// when click close button
$(document).on('click', '.closeChatWidget' , function() {
    //if ($(this).parent().parent().parent().attr('id') == widgetID)
    {
        var $mywidget = $(this).parent().parent().parent();
        if ($mywidget != undefined && $mywidget != null)
            $mywidget.html("");
    }
});

/* Generate minimized chat widget */
function makeMinimizeWidget(mywidget)
{
    if (mywidget != null)
    {
        var html_content = "";
        html_content += '<div id="chat_qwer1234" style="width: ' + widgetWidth + 'px; height: ' + widgetHeight + 'px; border-radius: 5px; position: relative;vertical-align: bottom; font-family: "Whitney SSm A", "Whitney SSm B";font-style: normal;font-weight: 400;">';
            html_content += '<div id="head_qwer1234" style="width: 100%; background: #303030; color: #FFF; cursor: pointer; height: 40px; border-top-left-radius: 5px; border-top-right-radius: 5px; position: absolute; bottom: 0px">';
                html_content += '<img src="' + imgURLArray[0] + '" style="width: 30px; height: 30px; float: left; margin: 5px; border-radius: 3px;" />';
                html_content += '<div style="float: left; width: 180px; line-height: 14px; margin-top: 13px;">';
                    html_content += '<span style="font-size: 13px; font-weight: 700;" id="title_qwer1234">' + chatTitle + '</span><br/>';
                html_content += '</div>';
                html_content += '<img src = "' + imgURLArray[3] + '" class="closeChatWidget" style="padding: 5px; float: right; margin-top: 9px; margin-right: 5px;" />';
                html_content += '<img src = "' + imgURLArray[4] + '" class="minimizeChatBtn" style="padding: 5px; float: right; margin-top: 15px; margin-left: 10px;"/>';
            html_content += '</div>';
        html_content += '</div>';
        $(mywidget.selector).html(html_content);
    }
}
/* Generate normal chat widget */
function makeNormalWidget(mywidget)
{
    if (mywidget != null)
    {
        var html_content = "";
        html_content += '<div id="chat_qwer1234" style="width: ' + widgetWidth + 'px; height: ' + widgetHeight + 'px; border-radius: 5px; background: #f4f7f9; box-shadow: 2px 2px 1px #888888; position: relative;vertical-align: bottom; font-family: "Whitney SSm A", "Whitney SSm B";font-style: normal;font-weight: 400;">';
            html_content += '<div class="header_qwer1234" id="head_qwer1234" style="width: 100%; background: #303030; color: #FFF; cursor: pointer; height: 40px; border-top-left-radius: 5px; border-top-right-radius: 5px; position: absolute;">';
                html_content += '<img src="' + imgURLArray[0] + '" style="width: 30px; height: 30px; float: left; margin: 5px; border-radius: 3px;" />';
                html_content += '<div style="float: left; width: 180px; line-height: 14px; margin-top: 7px;">';
                    html_content += '<span style="font-size: 13px; font-weight: 700;">' + chatTitle + '</span><br/>';
                    html_content += '<span id="chat_user_online_count_qwer1234" style="font-size: 13px; color: #bababa">0 online</span>';
                html_content += '</div>';
                html_content += '<img src = "' + imgURLArray[3] + '" class="closeChatWidget" style="padding: 5px; float: right; margin-top: 9px; margin-right: 5px;" />';
                html_content += '<img src = "' + imgURLArray[4] + '" class="minimizeChatBtn" style="padding: 5px; float: right; margin-top: 15px; margin-left: 10px;"/>';
            html_content += '</div>';
            html_content += '<div id="body_qwer1234" style="width: ' + (widgetWidth-39) + 'px; margin-right: 37px; max-height: 341px; overflow: hidden; position: absolute; bottom: 35px; font-size: 13px;"></div>';
            html_content += '<div id="chat_input_qwer1234" style="width: ' + (widgetWidth-12) + 'px; padding: 5px; border: 1px solid #D9D9D9; height: 20px; font-size: 13px; position: absolute; bottom: 0px; background: #fff; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;">';
                html_content += '<img src="' + imgURLArray[2] + '" style="width: 20px; height: 20px; float: left;"/>';
                html_content += '<input type="text" placeholder="Say something here" style="font-size: 13px; color: #000; border: 0px none; width: 260px; margin-left: 10px; background: #FFF; margin-top: 1px;" disabled />';
            html_content += '</div>';
        html_content += '</div>';
        $(mywidget.selector).html(html_content);
    }
}
/* Get color from username */
function generateColorForUsername(username){
    var totalValue = 0, color_length;
    for (var charIndex in username){
        if(validCharacterRegex.test(username[charIndex]))
            totalValue += parseInt(username[charIndex], 36);
        else
            totalValeu += 3;
    }
    color_length = COLORS.length;
    return COLORS[totalValue % color_length];
}
/* Generate time interval */
function getInterval()
{
    // 0.1 ~ 3 seconds
    return Math.floor((Math.random() * 2900) + 100);
}
function getNumberIncreaseInterval()
{
    // 0.1 ~ 2 seconds
    return Math.floor((Math.random() * 1900) + 100);   
}
/* Preload images */
function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>').src = this;
        imgArray.push($('<img/>')[0]);
    });
}
/* Date re-definition */
Date.prototype.customFormat = function(formatString){
    var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhhh,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
    YY = ((YYYY=this.getFullYear())+"").slice(-2);
    MM = (M=this.getMonth()+1)<10?('0'+M):M;
    MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
    DD = (D=this.getDate())<10?('0'+D):D;
    DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.getDay()]).substring(0,3);
    th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
    formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);
    h=(hhh=this.getHours());
    if (h==0) h=24;
    if (h>12) h-=12;
    hh = h<10?('0'+h):h;
    hhhh = h<10?('0'+hhh):hhh;
    AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
    mm=(m=this.getMinutes())<10?('0'+m):m;
    ss=(s=this.getSeconds())<10?('0'+s):s;
    return formatString.replace("#hhhh#",hhhh).replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
};
/* Reset the chat area */
function initChatArea()
{
    //onlineUsers = 0;
    $(mywidget.selector).find('#body_qwer1234').html("");
}
/* display messages */
function displayMessages(mywidget, msg_ind)
{
    if (mywidget == null) return;
    console.log(mywidget.selector + "," + msg_ind);
    while (messages[msg_ind].deleted == true)
    {
        msg_ind = (msg_ind + 1) % msg_length;
    }
    var each_html = "";
    var $body = $(mywidget.selector).find('#body_qwer1234');
    var messageTime;
    var date = new Date(messages[msg_ind].created);
    var score = 0;
    var leftMargin = 37;
    var chatContentWidth = widgetWidth - 38 *2;
    var score_html = "";
    //var onlineUsers = 0;
    if (messages[msg_ind].score != undefined)
        score = parseInt(messages[msg_ind].score);

    // If score value is above zero, set margin and generate html
    if (score > 0)
    {
        leftMargin = 5;
        // score += 5;
        score_html += '<span class="count_qwer1234" style="margin-right: 5px">' + score + '</span>';
    }
    // init chat area when first message comes in
    if (msg_ind == 0)
        initChatArea();
    // get time
    messageTime = date.customFormat("#hh#:#mm# #AMPM#");

    // calc onlineUsers
    // for (i = 0;i<=msg_ind;i++)
    // {
    //     if (messages[i].messageType.indexOf('room:leave') != -1)
    //         onlineUsers --;
    //     if (messages[i].messageType.indexOf('room:join') != -1)
    //         onlineUsers ++;
    // }
    $(mywidget.selector).find('#chat_user_online_count_qwer1234').html(onlineUsers + " online");

    if (msgType[messages[msg_ind].messageType] != "")
    {
        each_html += '<div class="status_qwer1234" style="line-height: 22px; margin-left: ' + leftMargin + 'px;">';
            if (score > 0)
            {
                each_html += '<div style="width: 32px; float: left;" id="score_qwer1234' + msg_ind + '">';
                    each_html += '<img src="' + imgURLArray[1] + '" style="width: 13px; height: 13px; float: left; margin-right: 3px; margin-top: 4px;"/>'
                each_html += '</div>';
            }
            each_html += '<div style="width: ' + chatContentWidth + 'px; float: left;">';
                each_html += '<img src="' + iconUrl[messages[msg_ind].messageType] + '" style="width: 13px; height: 13px; float: left; margin-right: 3px; margin-top: 4px;"/>';
                each_html += '<span style="color: #939393; margin-right: 5px;">' + messages[msg_ind].message + '</span> <span style="color: #939393">' + messageTime + '</span>';
            each_html += '</div>';
        each_html += '</div>';
    }
    else
    {
        var checkSameUser = false;
        if (msg_ind > 0)
        {
            if (msgType[messages[msg_ind-1].messageType] == "" && messages[msg_ind-1].sourceUsername == messages[msg_ind].sourceUsername)
            {
                checkSameUser = true; 
            }
        }
        if (checkSameUser == false)
        {
            each_html += '<div class="user_qwer1234" style="line-height: 22px; margin-left: ' + leftMargin + 'px;">';
                if (score > 0)
                {
                    each_html += '<div style="width: 32px; float: left;" id="score_qwer1234' + msg_ind + '">';
                        each_html += '<img src="' + imgURLArray[1] + '" style="width: 13px; height: 13px; float: left; margin-right: 3px; margin-top: 4px;"/>'
                    each_html += '</div>';
                }
                each_html += '<span style="color: ' + generateColorForUsername(messages[msg_ind].sourceUsername) + ';">' + messages[msg_ind].sourceUsername + '</span> <span style="color: #939393">' + messageTime + '</span>';
            each_html += '</div>';
        }
        if (checkSameUser == true && score > 0)
            leftMargin = 5;
        else
            leftMargin = 37;
        each_html += '<div class="message_qwer1234" style="line-height: 15px; margin-bottom: 10px; margin-left: ' + leftMargin + 'px;">';
            if (checkSameUser == true && score > 0)
            {
                each_html += '<div style="width: 32px; float: left;" id="score_qwer1234' + msg_ind + '">';
                    each_html += '<img src="' + imgURLArray[1] + '" style="width: 13px; height: 13px; float: left; margin-right: 3px;"/>'
                each_html += '</div>';
                // each_html += '<span id="count_qwer1234' + msg_ind + '" style="margin-right: 5px">' + score + '</span>';
            }
            each_html += '<span style="color: #000;">';
                each_html += messages[msg_ind].message;
            each_html += '</span>';
        each_html += '</div>';
    }
    //$body.html($body.html() + each_html);
    var createdHtml = $("<div>").css({width: "100%"}).html(each_html);
    // fade in the message
    // createdHtml.appendTo($body).hide().fadeIn(500);
    // $body.scrollTop($body[0].scrollHeight);
    createdHtml.appendTo($body);
    $body.css('bottom', "0px");
    $body.animate({bottom:"+=35px"}, 60, function(){ $body.scrollTop($body[0].scrollHeight);})

    if (score > 0)
    {
        var span = $('<span />').attr('id', 'count_qwer1234' + msg_ind).html(score);
        span.appendTo($body.find('#score_qwer1234' + msg_ind)).prop('Counter',0).animate({
            Counter: parseInt(span.html())
        }, {
            duration: getNumberIncreaseInterval(),
            easing: 'swing',
            step: function (now) {
                span.html(Math.ceil(now));
            }
        });
    }
    msg_ind = (msg_ind + 1) % msg_length;
    // if (msg_ind < 2) /* for a test */
    setTimeout(function(){displayMessages(mywidget, msg_ind)}, getInterval());
}

})(jQuery); // We call our anonymous function immediately