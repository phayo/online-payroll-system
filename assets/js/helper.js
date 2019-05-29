$(document).ready(function(){
    performPageActions();
});

function getCurrentPage() {
    var path = window.location.pathname;
    return path.split("/")[7];
}