var MobiDash = angular.module('mobiDashBoardApp');
MobiDash.controller('companyCntl', function($scope, $state, $rootScope, $stateParams, $http, domain, api, $timeout, core, localStorageService, NgTableParams, dataMove, session) {

    $rootScope.companytab = true;
    $rootScope.locationtab = false;
    $rootScope.usertab = false;
    $rootScope.solutionstab = false;
    $rootScope.pricingtab = false;
    $rootScope.supporttab = false;
    $rootScope.gstsolutionstab = false;
    $rootScope.showheader = true;
    $rootScope.usernametab = true;
    $rootScope.activeTab = 5;
    $rootScope.patnerstab = false;
    $rootScope.logintab = false;
    $rootScope.backuptab = true;
    $rootScope.rolestab = false;
    $rootScope.showCompanyname = false;
    $rootScope.balancesheetbreadcurmbs = false;
    $rootScope.voucherstab = false;

    $rootScope.addloc = false;
    $rootScope.addclient = true;
    $rootScope.contactus = false;
    $rootScope.adduser = false;
    $rootScope.addrole = false;
    $rootScope.addvouchertype = false;

    $scope.tenants = [];
    $scope.props = {}
    $scope.clientdata = {}
    $scope.searchEnable = false;
    $scope.company_id = '';

    $scope.fields = {
            "none": 0,
            "companyname": 1,
            "contactname": 2,
            "companyphone": 3,
            "companyemail": 4
        }
        // $scope.pricings = [{
        //         "name": "Basic",
        //     },
        //     {
        //         "name": "Standard",
        //     },
        //     {
        //         "name": "Premium",
        //     }
        // ]
    var config = {
        headers: {
            "X-CSRFToken": $rootScope.csrftoken,
            "Cookie": "csrftoken=" + $rootScope.csrftoken + '; ' + "sessionid=" + $rootScope.session_key
        }
    };
    $scope.smssettings = [{
            "name": "Send SMS for new/modified receipts"
        },

        {
            "name": "Send SMS for new/modified payment"

        },
        {
            "name": "Send SMS for new/modified receipts"

        },
        {
            "name": "Send SMS for new/modified payment"

        }
    ];
    $scope.permissions = function(user) {
        var canmanagecompany = user.privilege[0];
        var a = dcodeIO.Long.fromString(canmanagecompany, true);
        var b = dcodeIO.Long.fromString("8796093022208", true);
        var val1High = a.getHighBitsUnsigned();
        var val1Low = a.getLowBitsUnsigned();

        var val2High = b.getHighBitsUnsigned();
        var val2Low = b.getLowBitsUnsigned();

        var bitwiseAndResult = dcodeIO.Long.fromBits(val1Low & val2Low, val1High & val2High, true);
        var result = bitwiseAndResult.toNumber()
        if (8796093022208 == result) {
            return false;
        }
        return true;
    }
    $scope.addremovealert = function() {
        $("#success-alert").addClass('in');
        $("#success-alert").fadeTo(2000, 500).slideUp(500, function() {
            $("#success-alert").removeClass('in');
        });
    }
    $scope.addCompany = function() {
        $scope.props = {};
    }
    $scope.search = function() {
        if ($scope.searchEnable) {
            $scope.searchEnable = false;
        } else {
            $scope.searchEnable = true;
        }
    }
    $scope.hideSideMenu = function(index) {
        $scope.pricing_index = "";
    }
    $scope.upgradeClick = function(user, index) {
        $scope.company_id = user.id;
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            $scope.pricing_index = index;
            $scope.pricings = result.data;
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + core + 'package/', config)
            .then(success, error)
    }
    $scope.priceingclick = function(priceid) {
        $scope.pricing_index = "";
        $scope.price = {};
        $scope.price.package_id = priceid
        var success = function(result) {
            $scope.loading = false;
            $scope.loadmsg = true;
            if (result.data.error === undefined) {
                $scope.msg = "package upgraded successfully";
            } else {
                $scope.msg = result.data.error.message;
            }
            $scope.addremovealert();
            $scope.getallcompanysdata();
            $scope.cancelForm();
        }
        var error = function(result) {
            $scope.loading = false;
            $scope.cancelForm();
            session.sessionexpried(result.status);
        }
        $http.post(domain + core + 'tenant/' + $scope.company_id + '/upgrade/', $scope.price, config)
            .then(success, error)
    }
    $scope.getallcompanysdata = function() {
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            $scope.tenants = result.data;
            $scope.multiclient = new NgTableParams({ count: $scope.tenants.length }, { dataset: $scope.tenants });
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + core + 'tenant/', config)
            .then(success, error)

    }
    $scope.getallcompanysdata();
    $scope.access = function(data) {
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            if (result.data.error === undefined) {
                if (result.status === 200) {
                    $rootScope.tenant_id = data.tenant_id;
                    localStorageService.set('tenant_id', $rootScope.tenant_id);
                    console.log($rootScope.tenant_id);
                    $rootScope.selected_company_name = result.data.company;
                    localStorageService.set('tenant_name', $rootScope.selected_company_name);
                    localStorageService.set('owner_id', data.owner_id);
                    $rootScope.privilege = result.data.web_privilege[0];
                    localStorageService.set("privilege", result.data.web_privilege[0]);
                    $state.go('location');
                }
            } else {
                $scope.msg = result.data.error.message;
                $scope.addremovealert();
            }
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        var datas = { "tenant_name": data.name, "device_id": '00:37:6D:EA:77:FD', "tenant_id": data.id };
        $http.post(domain + api + "second_lg/", datas, config).
        then(success, error)

    }
    $scope.addCompanys = function() {
        $scope.clientdata.mobile = $scope.props.mobile;
        $scope.clientdata.company_name = $scope.props.company_name;
        $scope.clientdata.contact_name = $scope.props.contact_name;
        // $scope.clientdata.password = $scope.props.password;
        // $scope.clientdata.confirm_password = $scope.props.confirm_password;
        $scope.clientdata.email = $scope.props.email;
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
            $scope.getallcompanysdata();
            $scope.cancelForm();
            $scope.loadmsg = true;
            if (result.data.error === undefined) {
                $scope.msg = "Company created successfully";
            } else {
                $scope.msg = result.data.error.message;
            }
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

    $scope.editClient = function(user) {
        $scope.props = user;
        $scope.props.company_name = user.tenant_name;
        if (user.status === "A") {
            $scope.props.status = true;
        } else {
            $scope.props.status = false;
        }
    }
    $scope.editingCompany = function(user) {
        $scope.clientdata.mobile = $scope.props.mobile;
        $scope.clientdata.company_name = $scope.props.company_name;
        $scope.clientdata.contact_name = $scope.props.contact_name;
        // $scope.clientdata.password = $scope.props.password;
        // $scope.clientdata.confirm_password = $scope.props.confirm_password;
        $scope.clientdata.email = $scope.props.email;
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
            $scope.loadmsg = true;
            if (result.data.error === undefined) {
                $scope.msg = 'Company details edited successfully';
            } else {
                $scope.msg = result.data.error.message;
            }
            $scope.addremovealert();
            $scope.getallcompanysdata();
            $scope.editcancelForm();
        }
        var error = function(result) {
            $scope.loading = false;
            $scope.editcancelForm();
            session.sessionexpried(result.status);
            $scope.getallcompanysdata();
        }
        $scope.loading = true;
        $http.post(domain + core + 'tenant/' + $scope.props.id + "/modify/", $scope.clientdata, config)
            .then(success, error)
    }
    $scope.cancelForm = function() {
        $scope.resetForm();
        $("#add_client").modal('hide');
    }
    $scope.editcancelForm = function() {
        $scope.resetForm();
        $("#edit_client").modal('hide');
    }
    $scope.resetForm = function() {
        $scope.props = {};
    }
    $scope.deletemodelshow = function(props) {
        $("#edit_client").modal('hide');
    }
    $scope.deleteclient = function(ids) {
        $scope.loading = true;
        var success = function(result) {
            $("#deleteModal").modal('hide');
            $scope.getallcompanysdata();
            $scope.loading = false;
            $scope.props = {};
            $scope.loadmsg = true;
            $scope.msg = "Company deleted successfully";
            $scope.addremovealert();
        }
        var error = function(result) {
            $("#deleteModal").modal('hide');
            $scope.loading = false;
            session.sessionexpried(result.status);
            $scope.getallcompanysdata();
            $scope.props = {};
        }
        $http.get(domain + core + 'tenant/' + ids + "/delete/", $scope.clientdata, config)
            .then(success, error)


    }
    $scope.backup = function(user) {
        $scope.loading = true;
        $scope.clientdata.tenant_id = user.id
        var success = function(result) {
            $scope.loading = false;
            $scope.loadmsg = true;
            $scope.msg = "Backup created successfully";
            $scope.addremovealert();
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.post(domain + core + 'backup/', $scope.clientdata, config)
            .then(success, error)
    }
    $scope.isNumberKey = function($event) {
        if (!(($event.keyCode >= 48 && $event.keyCode <= 57) || ($event.keyCode === 8 || $event.keyCode === 46 || $event.keyCode == 9) || ($event.keyCode >= 96 && $event.keyCode <= 105))) {
            $event.preventDefault();
        }
    }
    $scope.smssettingsclick = function(user) {
        $scope.company_id = user.id;
        $scope.smsfor_mobile_payment = user.smsfor_mobile_payment;
        $scope.smsfor_mobile_receipt = user.smsfor_mobile_receipt;
        $scope.smsfor_payment = user.smsfor_payment;
        $scope.smsfor_receipt = user.smsfor_receipt;
        $('#smsModal').modal('show');

    }
    $scope.saveSmsSettingtoSever = function() {
        $scope.smssetting = {};
        $scope.smssetting.smsfor_mobile_payment = $scope.smsfor_mobile_payment;
        $scope.smssetting.smsfor_mobile_receipt = $scope.smsfor_mobile_receipt;
        $scope.smssetting.smsfor_payment = $scope.smsfor_payment;
        $scope.smssetting.smsfor_receipt = $scope.smsfor_receipt;
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            if (result.data.error === undefined) {
                $scope.msg = "Sms settings saved successfully."
            } else {
                $scope.msg = result.data.error.message;
            }
            $('#smsModal').modal('hide');
            $scope.addremovealert();
            $scope.getallcompanysdata();
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
            $('#smsModal').modal('hide');
        }
        $http.post(domain + core + 'tenant/' + $scope.company_id + "/modify/", $scope.smssetting, config)
            .then(success, error)
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