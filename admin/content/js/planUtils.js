adminPlanUtilsInit = function()
{
    var i;
    var itemsList = "";
    var time;

    var fdesc;
    var ftime1;
    var ftime2;

    var dayId = $.urlParam('fday');
    dayId = (dayId === null)?getCurrentDay(0):dayId;
    document.forms["dayForm"]["fday"].value = dayId;

    var plan = getPlanForCurrentId(dayId);
    for (i=1; i<=10; i++) {
        time = (plan[i-1]!== undefined)?String(plan[i-1].time).split(" – "):["",""];
        fdesc = (plan[i-1]!== undefined)?plan[i-1].desc:"";
        ftime1 = time[0];
        ftime2 = time[1];

        $("#ftime"+i+"_1").val(ftime1);
        $("#ftime"+i+"_2").val(ftime2);
        $("#fdesc"+i).val(fdesc);
    }

    $("#dayIdText").html(dayId);
};
//----------------------------------------------------------------------------------------------------------------------
function validateDayForm()
{
    var dayId = (document.forms["dayForm"]["fday"].value).split('.');
    var chkDate = new Date(dayId[2]+"-"+dayId[1]+"-"+dayId[0]);
    var res = false;

    if (chkDate=='Invalid Date')
    {
        alert('Ошибка в дате. Ожидается формат: дд.мм.гггг (например 13.01.2018)');
    } else if (checkPastTime(chkDate)) {
        alert('Нет возможности редактировать расписание прошедших дней.');
    } else if (checFutureTime(dayId[2])) {
        alert('Нет возможности редактировать дальше 2050 года.');
    } else {
        res = true;
    }

    return res;
}

function checkPastTime(chkDate)
{
    var todayId = (getCurrentDay(0)).split(".");
    var dateToday = new Date(todayId[2]+"-"+todayId[1]+"-"+todayId[0]);
    return dateToday.getTime()>chkDate.getTime();
}

function checFutureTime(year)
{
    return (Number(year)>2050);
}

function saveDayData()
{
    var data = [];
    var i;
    var ftime1;
    var ftime2;
    var item;
    var dayId = $("#dayIdText").html();

    for (i=1; i<=10; i++) {
        item = {};
        ftime1 = $("#ftime"+i+"_1").val();
        ftime2 = $("#ftime"+i+"_2").val();
        item.desc = $("#fdesc"+i).val();
        item.time = ftime1 + " – " + ftime2;
        if (item.desc !== "") {
            data.push(item);
        }
    }

    if (checkForDuplicates(data)) {
        setPlanForCurrentId(dayId, data);

        var params = {file_name:"./../content/plan.js" , file_data:"var plan = "+JSON.stringify(plan)};
        $.post("/php/save.php", params)
            .done(function (data) {
                //console.log("SAVE FILE");
                //console.log(JSON.parse(data));
                //console.log(JSON.stringify(plan));

                var pageURL = window.location.href;
                window.location.href = pageURL.substr(0, pageURL.indexOf("?")) + "?pageId=belegungsplan&fday="+dayId;
            });
    } else {
        alert('В плане на день два события начинаются в одно и то же время. Это недопустимо.');
    }

}

function setPlanForCurrentId(planId, setData)
{
    var i;
    var found = false;
    var planItem = {};

    setData = sortDataByTime(setData);

    for (i=0; i<plan.length; i++)
    {
        if (planId === plan[i].day) {
            plan[i].data = setData;
            found = true;
        }
    }

    if (!found) {
        planItem = {day:planId, data:setData};
        plan.push(planItem);
    }
}

function sortDataByTime(data)
{
    var i;
    var tmp;
    var needSort = true;

    for(;needSort;) {
        needSort = false;
        for (i = 0; i < data.length - 1; i++) {
            if ( compareTime(data[i].time, data[i + 1].time) )
            {
                tmp = data[i + 1];
                data[i + 1] = data[i];
                data[i] = tmp;
                needSort = true;
            }
        }
    }

    return data;
}

function compareTime(time1, time2)
{
    time1 = (time1.indexOf(":")===1)?("0"+time1):time1;
    time2 = (time2.indexOf(":")===1)?("0"+time2):time2;
    return time1>time2;
}

function checkForDuplicates(data)
{
    var res = true;
    var time1, time2, i, j;

    for (i = 0; i < data.length; i++) {
        for (j = 0; j < data.length; j++) {
            time1 = (data[i].time.split(" – "))[0];
            time2 = (data[j].time.split(" – "))[0];
            if ((i!==j)&&(time1 === time2))
            {
                res = false;
                break;
            }
        }
    }

    return res;
}

function inputTime(inputEl)
{
    if (inputEl.value.length === 2) {
        validateInputTimeHH(inputEl);
    } else if (inputEl.value.length === 5) {
        validateInputTimeMM(inputEl);
    }
}

function validateInputTimeHH(inputEl)
{
    if (chkStrToIntRange(inputEl.value, 0, 24)) {
        inputEl.value += ":";
    } else {
        inputEl.value = "";
        alert('Недопустимое значение в поле часов. Ожидается двухцифреное число ЧЧ от 0 до 24. Если хотите ввести одноцифренное значение, например 9, то вводите 09.');
    }
}

function validateInputTimeMM(inputEl)
{
    var tmp;
    var tmp2 = inputEl.value.split(":");
    var nextFocusId = "#";

    if (chkStrToIntRange(tmp2[1], 0, 59)) {
        tmp = inputEl.id.split("_");
        nextFocusId += (tmp[1] === "1") ? (tmp[0] + "_2") : ("fdesc" + tmp[0].substr(5, 2));
        $(nextFocusId).focus();
    } else {
        inputEl.value = tmp2[0]+":";
        alert('Недопустимое значение в поле минут. Ожидается двухцифреное число ММ от 0 до 59. Если хотите ввести одноцифренное значение, например 9, то вводите 09.');
    }
}

function chkStrToIntRange(str,min,max)
{
    var res = ((parseInt(str)>=min)&&(parseInt(str)<=max)&&(!isNaN(parseInt(str.charAt(1)))));
    return res;
}