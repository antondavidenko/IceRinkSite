function homeUtilsInit()
{
    resetDeck();
    showImageById(drawCard())

    setInterval(function(){
        var id = drawCard();
        if (id === undefined)
        {
            resetDeck();
            id = drawCard();
        }
        showImageById(id);
    }, 6000);
};

deck = [];

function showImageById(setupId)
{
    $("#img-home1").hide();
    $("#img-home2").hide();
    $("#img-home3").hide();
    $("#img-home4").hide();
    $("#img-home5").hide();

    $("#img-home"+setupId).show();
}

drawCard = function()
{
    var res;

    var randomId = this.getRandomId();
    res = this.deck[randomId];
    this.deck.splice(randomId, 1);
    return res;
};

getRandomId = function()
{
    return (Math.floor(Math.random() * this.deck.length));
};

resetDeck = function()
{
    this.deck = [];

    var i,j;
    for (i=1; i<=5; i++)
    {
        this.deck.push(i);
    }
};

getDeckCount = function()
{
    return this.deck.length;
};