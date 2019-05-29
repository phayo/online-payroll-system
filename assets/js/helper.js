$(document).ready(function(){
    performPageActions();
});

function getCurrentPage() {
    var path = window.location.pathname;
    return path.split("/")[7];
}

function queryServer(method, data, url, callfunction){
    $.ajax({
        url: url,
        type: method,
        data: data,
        success: function(data){
            linkFunction(callfunction, data);
        }
    });
}