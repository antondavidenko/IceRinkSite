function HttpAPI()
{
    this.getHash = function() {
        var d = new Date();
        return d.getTime();
    }
}