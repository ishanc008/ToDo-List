module.exports.getDate = function(){
    const date = new Date().toLocaleDateString("en-US",{
        "day" : "numeric",
        "weekday" : "long",
        "month" : "long"
    });
    return date;
}

