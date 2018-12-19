planUtilsInit = function()
{
    var dayId = $.urlParam('dayId');
    dayId = (dayId === null)?0:Number(dayId);

    var d = new Date();
    var n = d.getDay()-1; // day number in week Monday = 0

    setupWeeklyPlan(dayId, n);
    setupCalendar(dayId, n);
    setupMasterPlan(dayId, n);

    setInterval(checkDate, 1000);
};

var lastDate = new Date();

function checkDate()
{
    var lastDay = lastDate.getDate();
    lastDate = new Date();
    if (lastDay != lastDate.getDate())
    {
        var pageURL = window.location.href;
        window.location.href = pageURL.substr(0, pageURL.indexOf("?")) + "?pageId=belegungsplan&newday";
    }
}

function setupWeeklyPlan(dayId, n)
{
    var i,j;
    var tableContent = "<tr>";
    var tableData = mapPlanTo2DArray(n);

    for (j=0; j<7; j++) {
        tableContent += "<td class='calendarHeader'>" + getDayName(j) + "</td>";
    }

    tableContent += "</tr><tr>";

    for (j=0; j<7; j++) {
        tableContent += "<td class='bordered'>" + getCurrentDay(j-n) + "</td>";
    }

    for (i=0; i<tableData.max; i++) {
        tableContent += "</tr><tr>";
        for (j=0; j<7; j++) {
            if (tableData.data[j][i] !== undefined) {
                tableContent += "<td class='bordered price1-bg'>" + tableData.data[j][i] + "</td>";
            } else {
                tableContent += "<td class='bordered'> - </td>";
            }
        }
    }
    tableContent += "</tr>";

    $("#weekly_plan").html(tableContent);
}

function setupCalendar(dayId, n)
{
    var i;
    var dayToPast = 0;

    for (i=0; i<7; i++)
    {
        $("#calendar_r"+(i+1)+"_l1").html(getDayName(n + i - dayToPast));
        if (i === dayId)
        {
            $("#calendar_r"+(i+1)+"_l1").addClass("selected-day");
            $("#calendar_r"+(i+1)+"_l2").addClass("selected-date");
            $("#calendar_r"+(i+1)+"_l2").html(getCurrentDay(i-dayToPast));
        } else {
            $("#calendar_r"+(i+1)+"_l2").html('<a class="plan-item" href="./?pageId=belegungsplan&dayId='+i+'">'+getCurrentDay(i-dayToPast)+'</a>');
        }
    }
}

function setupMasterPlan(dayId, n)
{
    var i;
    var dayToPast = 0;

    var tableContent = '<tr><td class="calendarHeader">Uhrzeit</td><td class="calendarHeader" id="plan_header">%%plan_header%%</td></tr>';
    var currentPlan = getPlanForCurrentDay(dayId);

    for (i=0; i<1000; i++) {
        if (currentPlan === undefined) {
            currentPlan = getPlanForCurrentDay(dayId - 7*i);
        } else {
            break;
        }
    }

    for (i=0; i<currentPlan.length; i++) {
        if (currentPlan[i].desc === "Öffentlicher Lauf") {
            tableContent += '<tr><td class="bordered time-cell price1-bg">' + currentPlan[i].time + '</td><td class="bordered des-cell price1-bg">' + currentPlan[i].desc + '</td></tr>';
        } else {
            tableContent += '<tr><td class="bordered time-cell">' + currentPlan[i].time + '</td><td class="bordered des-cell">' + currentPlan[i].desc + '</td></tr>';
        }
        tableContent += '<tr><td class="plan-separator" colspan="2">&nbsp</td></tr>';
    }

    $("#master_plan").html(tableContent);
    $("#plan_header").html(getDayName(dayId - dayToPast + n)+" "+getCurrentDay(dayId-dayToPast));
}

function getDayName(n)
{
    var wdays = ["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"];
    n = (n<0)?n+7:n;
    n = n%7;
    return wdays[n];
}

function getCurrentDay(setDay)
{
    var today;

    if (setDay == undefined)
    {
        today = new Date();
    } else {
        today = new Date(new Date().getTime() + (24*60*60*1000)*setDay );
    }

    var dd = today.getDate();
    dd = (dd > 9)?dd:"0"+dd;

    var mm = today.getMonth() + 1; //January is 0!
    mm = (mm > 9)?mm:"0"+mm;

    var yyyy = today.getFullYear();

    var today = dd + '.' + mm + '.' + yyyy;
    return today;
}

function getPlanForCurrentDay(dayId)
{
    var planId = getCurrentDay(dayId);
    var res;
    var i;

    for (i=0; i<plan.length; i++)
    {
        if (planId === plan[i].day) {
            res = plan[i].data;
        }
    }

    return res;
}

function getPlanForCurrentId(planId)
{
    var res = false;
    var i;

    for (i=0; i<plan.length; i++)
    {
        if (planId === plan[i].day) {
            res = plan[i].data;
        }
    }

    if (!res) {
        var planIdArr = planId.split(".");
        var currentDayDate = new Date(planIdArr[2]+"-"+planIdArr[1]+"-"+planIdArr[0]);
        var previousWeekDate = new Date(currentDayDate.getTime() - (24*60*60*1000)*7);

        var dd = previousWeekDate.getDate();
        dd = (dd > 9)?dd:"0"+dd;

        var mm = previousWeekDate.getMonth() + 1; //January is 0!
        mm = (mm > 9)?mm:"0"+mm;

        var yyyy = previousWeekDate.getFullYear();
        res = getPlanForCurrentId(dd + '.' + mm + '.' + yyyy);
    }

    return res;
}

function mapPlanTo2DArray(n)
{
    var j;
    var res = {};
    res.data = [];
    res.max = 0;
    var row;

    for (j=0; j<7; j++)
    {
        currentDayId = getCurrentDay(j-n);
        currentPlan = getPlanForCurrentId(currentDayId);
        row = [];

        for (i=0; i<currentPlan.length; i++) {
            if (currentPlan[i].desc === "Öffentlicher Lauf") {
                row.push(currentPlan[i].time);
            }
        }
        res.data.push(row);
        res.max = (res.max<row.length)?row.length:res.max;
    }

    return res;
}