function initIndexScripts()
{
    $.getScript( "content/plan.js", function( data, textStatus, jqxhr ) {
        runLogic();
    });
};

function runLogic()
{
    var menu = "";
    var pageContent;
    var i;

    $.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        results = (results !== null)?results[1]:null;
        return results;
    };

    var pageURL = window.location.href;
    var pageId = $.urlParam('pageId');
    pageId = (pageId === null)?'home':pageId;
    content.pageIdNum = getNumId(pageId);

    var action = $.urlParam('action');
    var showdialog = $.urlParam('showdialog');

    if (action !== null) {
        $("#main").hide();
        $("#dialog").hide();

        var name = $.urlParam('fname');
        var email = $.urlParam('femail');
        var message = $.urlParam('fmessage');

        $.post( "/php/send.php", { name:name, email:email, message:message } )
            .done(function (data) {
                console.log(JSON.parse(data));
                window.location.href = pageURL.substr(0, pageURL.indexOf("?")) + "?showdialog=true";
            });
    } else if (showdialog !== null) {
        $("#main").hide();
        $("#dialog").show();

        $.get("content/html/dialogsent.html")
            .success(function (data) {
                $("#dialog").html(data);
            });
    } else {
        $("#dialog").hide();
        for (i = 0; i < content.pages.length; i++) {
            if (i !== content.pageIdNum) {
                menu += "<a class='menu-item' href='./?pageId=" + content.pages[i].id + "'>" + content.pages[i].menu + "</a>";
            } else {
                menu += "<span class='selected-menu-item'>" + content.pages[i].menu + "</span>";
            }
            menu = (i < content.pages.length - 1) ? menu + " &nbsp <span class='menu-separator'>|</span> &nbsp " : menu;
        }

        $.get(content.pages[content.pageIdNum].data+"?hash="+httpAPI.getHash() )
            .success(function (data) {
                pageContent = (content.pages[content.pageIdNum].title !== "") ? ('<div class="content-title">' + content.pages[content.pageIdNum].title + '</div>' + data) : data;
                $("#content").html(pageContent);

                if (content.pages[content.pageIdNum].run !== undefined) {
                    window[content.pages[content.pageIdNum].run]();
                }
            });

        $("#menu").html(menu);

        $.get("content/html/footer.html")
            .success(function (data) {
                $("#footer").html(data);
            });

        $.get("content/html/header.html")
            .success(function (data) {
                $("#header").html(data);
            });
    }
}

function getNumId(strId)
{
    var res = 0;
    var i;

    for (i=0;i<content.pages.length; i++){
        if (content.pages[i].id ===  strId)
        {
            res = i;
            break;
        }
    }

    return res;
}
