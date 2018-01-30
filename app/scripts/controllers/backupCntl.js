var MobiDash = angular.module('mobiDashBoardApp');
MobiDash.controller('backupCntl', function($scope, $state, $rootScope, $stateParams, $http, domain, api, $timeout, core, localStorageService, NgTableParams, dataMove, session) {

    $rootScope.companytab = true;
    $rootScope.locationtab = false;
    $rootScope.usertab = false;
    $rootScope.solutionstab = false;
    $rootScope.pricingtab = false;
    $rootScope.supporttab = false;
    $rootScope.gstsolutionstab = false;
    $rootScope.showheader = true;
    $rootScope.usernametab = true;
    $rootScope.activeTab = 8;
    $rootScope.patnerstab = false;
    $rootScope.logintab = false;
    $rootScope.backuptab = true;
    $rootScope.rolestab = false;
    $rootScope.showCompanyname = false;
    $rootScope.balancesheetbreadcurmbs = false;
    $rootScope.voucherstab = false;
    $rootScope.addvouchertype = false;
    $rootScope.downloadstab = true;


    $rootScope.addloc = false;
    $rootScope.addclient = false;
    $rootScope.contactus = false;
    $rootScope.adduser = false;
    $rootScope.addrole = false;

    $scope.deleteid = "";
    $scope.backup_index = "";
    $scope.restoreclientsshow = false;
    $scope.backupdata = {};
    $scope.clientdata = {};
    $scope.restorereqdata = {};
    $scope.tenants = [];
    $scope.props = {};
    $scope.nobackups = false;
    $scope.search = function() {
        if ($scope.searchEnable) {
            $scope.searchEnable = false;
        } else {
            $scope.searchEnable = true;
            $timeout(function() {
                $('[name="tenant_name"]').focus();
            }, 50);
        }
    }
    $scope.fields = {
        "none": 0,
        "companyname": 1,
        "contactname": 2,
        "companyphone": 3,
        "companyemail": 4
    }
    var config = {
        headers: {
            "X-CSRFToken": $rootScope.csrftoken,
            "Cookie": "csrftoken=" + $rootScope.csrftoken + '; ' + "sessionid=" + $rootScope.session_key
        }
    };
    $scope.addremovealert = function() {
        $("#success-alert").addClass('in');
        $("#success-alert").fadeTo(2000, 500).slideUp(500, function() {
            $("#success-alert").removeClass('in');
        });
    }

    // $scope.tenants = [{
    //         "tenant_name": "mobigesture",
    //         "mobile": "9666922280",
    //         "user": "naveen",
    //         "locations": "8.03GB",
    //         "date": "27/10/2017 12:30"

    //     },
    //     {
    //         "tenant_name": "mobigesture new",
    //         "mobile": "9666922281",
    //         "user": "mobisupport",
    //         "locations": "2.01GB",
    //         "date": "25/10/2017 12:30"
    //     }
    // ]
    // $scope.multiclientbackup = new NgTableParams({ count: $scope.tenants.length }, { dataset: $scope.tenants });

    $scope.getallbackupcompanysdata = function() {
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            if (result.data.error === undefined) {
                $scope.backuptenants = result.data;
                result.data.length === 0 ? $scope.nobackups = true : $scope.multiclientbackup = new NgTableParams({ count: $scope.backuptenants.length }, { dataset: $scope.backuptenants });
            } else {
                $scope.msg = result.data.error.message;
                $scope.addremovealert();
            }
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + core + 'backup/', config)
            .then(success, error)

    }
    $scope.getallbackupcompanysdata();
    $scope.deleteclient = function() {
        $scope.loading = true;
        var success = function(result) {
            $("#deleteModal").modal('hide');
            $scope.loading = false;
            $scope.getallbackupcompanysdata();
            $scope.props = {};
            if (result.data.error === undefined) {
                $scope.msg = "Backup deleted successfully";
            } else {
                $scope.msg = result.data.error.message;
            }
            $scope.addremovealert();
        }
        var error = function(result) {
            $("#deleteModal").modal('hide');
            $scope.loading = false;
            session.sessionexpried(result.status);
            $scope.getallbackupcompanysdata();
            $scope.props = {};
        }
        $http.get(domain + core + 'backup/' + $scope.deleteid + "/delete/", config)
            .then(success, error)
    }
    $scope.deletemodelshow = function(user) {
        $scope.deleteid = user.id;
        $scope.backupname = user.tenant_name;
    }
    $scope.restorebuttonclick = function(index, tenant_id) {
        $scope.loading = true;
        $scope.tenants = [];
        var success = function(result) {
            $scope.loading = false;
            $scope.backup_index = index;
            if (result.data.error === undefined) {
                angular.forEach(result.data, function(value, key) {
                    if (tenant_id === value.id.toString()) {
                        $scope.tenants.push(value);
                    }
                });
            } else {
                $scope.msg = result.data.error.message;
                $scope.addremovealert();
            }
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + core + 'tenant/', config)
            .then(success, error)

    }
    $scope.resstoreclick = function(company, backup) {
        $scope.backup_index = "";
        if (company == "addcompany") {
            $("#add_client").modal('show');
            $scope.backupdata = backup;
        } else {
            $scope.warningalert(company, backup);
        }
    }
    $scope.warningalert = function(company, backup) {
        swal({
            title: "",
            html: 'This will destroy the data for client <span style="color:red;">' + company.tenant_name + '</span> and recreate with data from backup file <span style="color:red;">' + backup.tenant_name + '</span>',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: "Continue",
            confirmButtonColor: '#facea8',
            cancelButtonColor: '#1fa9cc',
            focusCancel: true
        }).then(function() {
            swal({
                title: "",
                text: "Are you sure you want to continue",
                showCancelButton: true,
                confirmButtonClass: "btn-info",
                confirmButtonText: "Continue",
                confirmButtonColor: '#1fa9cc',
                cancelButtonColor: '#1fa9cc',
                focusCancel: true
            }).then(function() {
                $scope.restoringbackupfile(company, backup);
            });
        });
    }
    $scope.restoringbackupfile = function(company, backup) {
        $scope.loading = true;
        $scope.restorereqdata.tenant_id = company.id;
        $scope.restorereqdata.backup_id = backup.id;
        $scope.restorereqdata.company_name = company.company_name;
        var success = function(result) {
            $scope.loading = false;
            if (result.data.error === undefined) {
                $scope.msg = "Company Restored successfully";
            } else {
                $scope.msg = result.data.error.message;
            }
            $scope.addremovealert();
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.post(domain + core + 'backup/restore/', $scope.restorereqdata, config)
            .then(success, error)
    }
    $scope.cancelForm = function() {
        $("#add_client").modal('hide');
        $scope.field = "";
        $scope.showerrormessage = false;
    }
    $scope.addCompanys = function() {
        $scope.clientdata.company_name = $scope.props.company_name;
        $scope.clientdata.contact_name = $scope.props.contact_name;
        $scope.clientdata.mobile = $scope.props.mobile;
        $scope.clientdata.email = $scope.props.email;
        $scope.clientdata.restore = true;
        if ($scope.props.status) {
            $scope.clientdata.status = 'A';
        } else {
            $scope.clientdata.status = 'I';
        }
        if ($scope.allValidationscheck($scope.clientdata)) {
            return;
        }
        var success = function(result) {
            $scope.loading = false;
            if (result.data.error === undefined) {
                $scope.restoringbackupfile(result.data, $scope.backupdata);
                $scope.props = {};
                $scope.msg = "New company created successfully";
            } else {
                $scope.msg = result.data.error.message;
            }
            $scope.cancelForm();
            $scope.addremovealert();
        }
        var error = function(result) {
            $scope.loading = false;
            $scope.cancelForm();
            session.sessionexpried(result.status);
        }
        $scope.loading = true;
        $http.post(domain + core + 'tenant/addClient/', $scope.clientdata, config)
            .then(success, error)
    }
    $scope.hideSideMenu = function(index) {
        $scope.backup_index = "";
    }
    $scope.allValidationscheck = function(data) {
        if (data.company_name === undefined || data.company_name === "") {
            $scope.showerrormessage = true;
            $scope.field = $scope.fields.companyname;
            $scope.errormessage = "Please enter company name";
            return true;
        }
        if (data.contact_name === undefined || data.contact_name === "") {
            $scope.showerrormessage = true;
            $scope.field = $scope.fields.contactname;
            $scope.errormessage = "Please enter contact name";
            return true;
        }
        if (data.mobile === undefined || data.mobile === "") {
            $scope.showerrormessage = true;
            $scope.field = $scope.fields.companyphone;
            $scope.errormessage = "Please enter company mobile number";
            return true;
        }
        if (data.mobile.length !== 10) {
            $scope.showerrormessage = true;
            $scope.field = $scope.fields.companyphone;
            $scope.errormessage = "Please enter valid company mobile number";
            return true;
        }
        if (data.email === undefined || data.email === "") {
            $scope.showerrormessage = true;
            $scope.field = $scope.fields.companyemail;
            $scope.errormessage = "Please enter company email address";
            return true;
        }
        if (data.email !== undefined && (data.email.length > 0 && !$scope.emailValidation(data.email))) {
            $scope.showerrormessage = true;
            $scope.field = $scope.fields.companyemail;
            $scope.errormessage = "Please enter valid email address";
            return true;
        }
        return false;

    }
    $scope.emailValidation = function(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    $scope.fieldschangeAction = function() {
        $scope.field = $scope.fields.none;
        $scope.showerrormessage = false;
    }

});