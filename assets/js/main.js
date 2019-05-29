var server = "http://localhost:3000/employees";
function performPageActions(){
    var page = getCurrentPage();
    if(page === "index.html"){
        getEmployeesData();
    }else if(page === "dashboard.html"){

    }else if(page === "employees.html"){

    }else if(page === "payments.html"){

    }

    btnEvents();
}

function getEmployeesData(){
    queryServer("GET", "", server, "storeInfo");
}

function stashInfo(data){
    alert(JSON.stringify(data));
}

function linkFunction(callFunction, data){
    switch(callFunction){
        case "storeInfo":{
            stashInfo(data);
            break;
        }
    }
}
