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

function PriceFormat(amount) {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    });
    amount = formatter.format(amount);
    amount = amount.replace("NGN", "₦");
    return amount.replace(".00", "");
}

function getMonth(){
    var date = new Date();
    var month = date.getMonth();
    return month
}