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
function btnEvents(){
    $("form[name=login]").submit(function(e){
        var authorized = "";
        var password = "";
        var employees = $("#empData").val();
        var userEmail = $("#email").val();
        var userPassword = $("#password").val();
        employees = JSON.parse(employees);
        employees.forEach(function(employee){
            if(employee["email"] === userEmail){
                authorized = employee["payroll-access"];

                password = employee["password"];
            }
        });
        if(authorized === ""){
            $(".err").text("Email does not exist").removeClass("hide");
        }else if(authorized === true){
            if(userPassword === password){
                window.location = "dashboard.html";
            }else{
                $(".err").text("Password Incorrect").removeClass("hide");
            }
        }else{
            $(".err").removeClass("hide");
        }
        e.preventDefault();
    });
}
function stashInfo(data){
    var employeesData = JSON.stringify(data);
    $("#empData").val(employeesData);
}

function linkFunction(callFunction, data){
    switch(callFunction){
        case "storeInfo":{
            stashInfo(data);
            break;
        }
    }
}
