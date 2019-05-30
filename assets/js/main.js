var server = "http://localhost:3000/employees/";
function performPageActions(){
    var page = getCurrentPage();
    if(page === "index.html"){
        getEmployeesData();
    }else if(page === "dashboard.html"){

    }else if(page === "employees.html"){
        employeespageFunctions();
    }else if(page === "payments.html"){

    }

    btnEvents();
}

function getEmployeesData(){
    queryServer("GET", "", server, "storeInfo");
    
}

function employeespageFunctions(){
    queryServer("GET", "", server, "loadEmployees");
};
function btnEvents(){
    $("form[name=login]").submit(function(e){
        var authorized = "";
        var password = "";
        var employees = $(".empData").val();
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
                window.location = "employees.html";
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
    $(".empData").val(employeesData);
}
function displayEmployees(data){
    var parent = $(".parent");
    if(data != null){
        var companySize = data.length;
        var lastPayday = "30-"+ (getMonth() - 1) +"-2019";
        var nextPayday = "30-"+ getMonth() +"-2019";
        $(".no-employees").text(companySize);
        $(".lastPD").text(lastPayday);
        $(".nextPD").text(nextPayday);
        var mockMarkup = parent.find(".child");
        data.forEach(function(employee){
            var newEmployee = mockMarkup.clone();
            newEmployee.removeClass("child");
            newEmployee.removeClass("hide");
            newEmployee.find(".employee-name").text(employee["name"]);
            newEmployee.find(".employee-job").text(employee["job-description"]+" - ");
            newEmployee.find(".employee-department").text(employee["department"]);
            var userid = employee["id"];
            var imgurl = "assets/pp/user-"+userid+".jpg";
            newEmployee.find(".employee-img").attr("src", imgurl);
            var salary = employee["rank"] * 100000;
            newEmployee.find(".employee-salary").text(PriceFormat(salary));
            var month = getMonth();
            var payHistory = employee["payment-history"];
            newEmployee.find(".employee-pay-status").text(payHistory.includes(month));
            newEmployee.find(".employee-email").text(employee["email"]);
            var deleteButton = newEmployee.find(".delete-employee");
            var editEmployee = newEmployee.find(".edit-employee-info");
            deleteButton.click(function(){
                var url = server+userid;
                var method = "DELETE";
                var data = "";
                var callFunction = "updateInfo";
                queryServer(method, data, url, callFunction);
            });
            newEmployee.appendTo(parent).show();
        });
    }else{
        $("<div>").text("No employees found").appendTo(parent);
    }
}
function  displayUpdatedInfo(data){
    swal({
        title: 'Done!',
        text: "User deleted!",
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok!',
        confirmButtonClass: 'btn btn-success',
        buttonsStyling: false,
        onClose: function () {
            window.location.reload();
        }
    });
}

function linkFunction(callFunction, data){
    switch(callFunction){
        case "storeInfo":{
            stashInfo(data);
            break;
        }
        case "loadEmployees":{
            displayEmployees(data);
            break;
        }
        case "updateInfo":{
            displayUpdatedInfo(data);
            break;
        }
    }
}
