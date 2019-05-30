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
    autoPayment();
}

function getEmployeesData(){
    queryServer("GET", "", server, "storeInfo");
    
}

function employeespageFunctions(){
    queryServer("GET", "", server, "loadEmployees");
    var bal = parseInt($("#company-balance").val());
    $(".comBal").text(PriceFormat(bal));
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

    $("#new-emp-rank").blur(function(){
        var value = $(this).val();
        if(value >= 4){
            $(".payroll-manager-info").removeClass("hide");
            $("#new-emp-access").val(true);
        }else{
            $(".payroll-manager-info").addClass("hide");
            $("#new-emp-access").val(false);
        }
    });

    $("form[name=addUser]").submit(function(e){
        var check = $("#check").val();
        var fullname = $("#newEmployeeName").val();
        var email = $("#new-emp-email").val();
        var password = $("#new-emp-password").val();
        var dept = $("#new-emp-dept").val();
        var rank = parseInt($("#new-emp-rank").val());
        var job = $("#new-emp-jobTitle").val();
        var access = $("#new-emp-access").val();
        access == "true"? access = true : access = false;
        if(check === "add"){
            var payHistory = "2019:";
            var data = {
                "name": fullname,
                "email": email,
                "password": password,
                "payroll-access": access,
                "payment-history": payHistory,
                "department": dept,
                "rank": rank,
                "job-description": job
              };
            queryServer("POST", data, server, "LoadNewEmployee");
        }else{
            var payHistory = $("#new-emp-status").val();
            var data = {
                "name": fullname,
                "email": email,
                "password": password,
                "payroll-access": access,
                "payment-history": payHistory,
                "department": dept,
                "rank": rank,
                "job-description": job
            };
            queryServer("PUT", data, server+check, "LoadEditEmployeeData");
        }
        e.preventDefault();
    });

    $("#new-emp-email").blur(function(){
        var mail = $(this).val();
        var employeeData = $(".empData").val();
        employeeData = JSON.parse(employeeData);
        for(var j = 0; j < employeeData.length; j++){
            if(mail === employeeData[j]["email"]){
                $(".email-err").removeClass("hide");
                $(".new-emp-submit").prop("disabled", true);
                break;
            }else{
                $(".email-err").addClass("hide");
                $(".new-emp-submit").prop("disabled", false);
            }
        }
    });

    $("#pay-category").change(function(){
        var selected = $(this).val();
        if(selected == "user"){
            var users = $(".empData").val();
            users = JSON.parse(users);
            $("#pay-user").empty();
            $("<option>").text("Select...").appendTo("#pay-user");
            users.forEach(function(employee){
                $("<option>").val(employee["id"]).text(employee["name"]).appendTo("#pay-user")
            });
            $(".user-select").removeClass("hide");
        }else{
            $(".user-select").addClass("hide");
        }
    });

    $(".search-employees").click(function(){
        var keyword = $(".keyword").val();
        if(keyword == ""){

        }else{
            var url = server+"?email="+keyword;
            queryServer("GET", "", url, "loadEmployees");
        }
    });

    $(".all-employees").click(function(){
        queryServer("GET", "", server, "loadEmployees");
    });

    $("form[name=pay-salary]").submit(function(e){
        var category = $("#pay-category").val();
        var employees = $(".empData").val();
        var month = getMonth();
        employees = JSON.parse(employees);
        if(category == "0"){
            employees.forEach(function(employee){
                var id = employee["id"];
                var status = employee["payment-history"];
                status += month+":";
                employee["payment-history"] = status;
                delete employee["id"];
                queryServer("PUT", employee, server+id, "default");
            });
            swal({
                title: 'Done!',
                text: "Employees Paid",
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'Ok!',
                confirmButtonClass: 'btn btn-success',
                buttonsStyling: false,
                onClose: function () {
                    window.location.reload();
                }
            });
        }else if(category == "user"){
            var user = $("#pay-user").val();
            employees.forEach(function(employee){
                var id = employee["id"];
                if(user == id){
                    var status = employee["payment-history"];
                    status += month+":";
                    employee["payment-history"] = status;
                    delete employee["id"];
                    queryServer("PUT", employee, server+id, "LoadPayUser");  
                }
            });
        }
        e.preventDefault();
    });
}//End of btnEvents();

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
        var mockMarkup = $(".child");
        parent.empty();
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
            month = ""+month;
            var payHistory = employee["payment-history"];
            payHistory = payHistory.split(":");
            newEmployee.find(".employee-pay-status").text(payHistory.includes(month));
            newEmployee.find(".employee-email").text(employee["email"]);
            var deleteButton = newEmployee.find(".delete-employee");
            var editButton = newEmployee.find(".edit-employee-info");
            deleteButton.click(function(){
                var url = server+userid;
                var method = "DELETE";
                var data = "";
                var callFunction = "updateInfo";
                queryServer(method, data, url, callFunction);
            });
            editButton.click(function(){
                editEmployeeData(employee);
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

function  displayNewUser(data){
    swal({
        title: 'Done!',
        text: "New Employee Added!",
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
function editEmployeeData(data){
    $(".new-employee-modal").on("show.bs.modal", function(){
        $("#check").val(data["id"]);
        $("#newEmployeeName").val(data["name"]);
        $("#new-emp-email").val(data["email"]);
        $("#new-emp-password").val(data["password"]);
        $(".password-block").hide();
        $("#new-emp-dept").val(data["department"]);
        $("#new-emp-rank").val(data["rank"]);
        $("#new-emp-jobTitle").val(data["job-description"]);
        $("#new-emp-access").val(data["access"]);
        $("#new-emp-status").val(data["payment-history"]);
        $(".new-emp-title").text("Edit Employee Data");
        $(".new-emp-submit").text("Edit");
    }).modal("show");
}

function displayEditData(){
    swal({
        title: 'Done!',
        text: "Employee Data Editted!",
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

function displayPayUser(){
    swal({
        title: 'Done!',
        text: "User Salary Paid!",
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
//LinkFunction
function linkFunction(callFunction, data){
    switch(callFunction){
        case "storeInfo":{
            stashInfo(data);
            break;
        }
        case "loadEmployees":{
            displayEmployees(data);
            stashInfo(data);
            break;
        }
        case "updateInfo":{
            displayUpdatedInfo(data);
            break;
        }
        case "LoadNewEmployee":{
            displayNewUser(data);
            break;
        }
        case "LoadEditEmployeeData":{
            displayEditData(data);
            break;
            LoadPayUser
        }
        case "LoadPayUser":{
            displayPayUser(data);
            break;
        }
        default:{
            PayResponse();
        }
    }
}
