function initIndexScripts()
{
    $.getScript( "../content/plan.js", function( data, textStatus, jqxhr ) {
        loadInbox();
    });
}

function loadInbox()
{
    $.getScript( "../content/inbox.js", function( data, textStatus, jqxhr ) {
        loadMStatus();
    });
}

function loadMStatus()
{
    $.getScript( "../content/mstate.js", function( data, textStatus, jqxhr ) {
        runLogic();
    });
}

function runLogic()
{
    $.post("/php/save.php", {})
        .done(function (data) {
            showPage(JSON.parse(data));
        });
}

function showPage(data)
{
//    console.log(data);

    var menu = "";
    var pageContent;
    var i;

    $.urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        results = (results !== null) ? results[1] : null;
        return results;
    };

    var pageURL = window.location.href;
    var pageId = $.urlParam('pageId');
    pageId = (pageId === null) ? 'plan' : pageId;
    content.pageIdNum = getNumId(pageId);

    var showdialog = $.urlParam('showdialog');
    //var showerror = $.urlParam('showerror');

    //http://eissport.de/php/auth.php?login=test_user&password=test_password
    //http://eissport.de/php/auth.php?log_off

    if (data.errorId == 1) {
        $("#main").hide();
        $("#dialog").show();

        $.get("content/html/dialoglogin.html")
            .success(function (data) {
                $("#dialog").html(data);
            });
    } else if (data.errorId == 2) {
        $("#dialog").hide();
        for (i = 0; i < content.pages.length; i++) {
            if (i !== content.pageIdNum) {
                menu += "<a class='menu-item' href='./?pageId=" + content.pages[i].id + "'>" + content.pages[i].menu + "</a>";
            } else {
                menu += "<span class='selected-menu-item'>" + content.pages[i].menu + "</span>";
            }
            menu = (i < content.pages.length - 1) ? menu + " &nbsp <span class='menu-separator'>|</span> &nbsp " : menu;
        }

        $.get(content.pages[content.pageIdNum].data+"?hash="+httpAPI.getHash())
            .success(function (data) {
                pageContent = (content.pages[content.pageIdNum].title !== "") ? ('<div class="content-title">' + content.pages[content.pageIdNum].title + '</div>' + data) : data;
                $("#content").html(pageContent);

                if (content.pages[content.pageIdNum].run !== undefined) {
                    window[content.pages[content.pageIdNum].run]();
                }
            });

        $("#menu").html(menu);
    }
};

function getNumId(strId)
{
    var res = 0;

    for (i=0;i<content.pages.length; i++){
        if (content.pages[i].id ===  strId)
        {
            res = i;
            break;
        }
    }

    return res;
}
