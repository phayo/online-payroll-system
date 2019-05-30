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
        success: function(response){
            linkFunction(callfunction, response);
        },
        error: function (xhr, status) {
            switch (status) {
                case 404:
                    alert('File not found');
                    break;
                case 500:
                    alert('Server error');
                    break;
                case 0:
                    alert('Request aborted');
                    break;
                default:
                    alert('Unknown error: ' + xhr.statusText);
            }
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