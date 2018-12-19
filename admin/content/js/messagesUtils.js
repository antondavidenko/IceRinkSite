function adminMessagesUtilsInit()
{
    var i;
    var itemsList = "";

    var filters = {};
    filters["new"] = ($("#chb_new").is(":checked"));
    filters["view"] = ($("#chb_view").is(":checked"));
    filters["delet"] = ($("#chb_delet").is(":checked"));

    for (i=0; i<inbox.length; i++)
    {
        itemsList += processItem(inbox[i], filters);
    };

    $("#messages-items-list").html(itemsList);
};

function processItem(dataObj, filters)
{
    var key = String(dataObj.date);
    var res = "";

    key = key.replace(/ /g,"");
    key = key.replace(/:/g,"");

    flag = (inboxStates[key] === undefined)?'n':inboxStates[key];

    if (((flag === "v")&&(filters["view"]))||((flag === "n")&&(filters["new"]))||((flag === "d")&&(filters["delet"])))
    {
        res = getItemHtml(dataObj, flag, key);
    }

    return res;
}

function getItemHtml(dataObj, flag, key)
{
    var setDate = dataObj.date;
    var setName = dataObj.name;
    var setEmail = dataObj.email;
    var setMessage = dataObj.message;

    var itemHtml = '';

    if (flag === 'v') {
        itemHtml = '<div class="container-viewed">';
    } else if (flag === 'd') {
        itemHtml = '<div class="container-deleted">';
    } else {
        itemHtml = '<div class="container">';
    }

    itemHtml += '<form>'+
        '<b>Дата:</b> '+setDate+'<br><br>'+
        '<b>Имя:</b> '+setName+'</label><br><br>'+
        '<b>EMAIL:</b> '+setEmail+'</label><br><br>'+
        '<b>Сообшение:</b> '+setMessage+'</label><br><br>';

    if (flag !== 'v') {
        itemHtml += '<input type="button" value="К ПРОСМОТРЕННЫМ" onclick="messegeSetViwed(\''+key+'\')"> ';
    }
    if (flag !== 'd') {
        itemHtml += '<input type="button" value="УДАЛИТЬ" onclick="messegeSetDeleted(\''+key+'\')">';
    }
    itemHtml += '</form></div><br>';

    return itemHtml;
}
//----------------------------------------------------------------------------------------------------------------------
function inboxFilterFormSet()
{
    adminMessagesUtilsInit();
    return false;
}

function messegeSetViwed(key)
{
    inboxStates[key] = 'v';
    saveInboxStates();
}

function messegeSetDeleted(key)
{
    inboxStates[key] = 'd';
    saveInboxStates();
}

function saveInboxStates()
{
    console.log("save file request...");

    var params = {file_name:"./../content/mstate.js" , file_data:"var inboxStates = "+JSON.stringify(inboxStates)};
    $.post("/php/save.php", params)
        .done(function (data) {
            console.log("SAVE FILE");
            console.log(JSON.parse(data));
            var pageURL = window.location.href;
            window.location.href = pageURL.substr(0, pageURL.indexOf("?")) + "?pageId=messages";
        });
}