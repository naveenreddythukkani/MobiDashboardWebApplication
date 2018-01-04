var MobiDash = angular.module('mobiDashBoardApp');
MobiDash.controller('loginCntl', function($scope, $state, $rootScope, $stateParams, $http, domain, api, $timeout, core, localStorageService, NgTableParams, dataMove, session) {

    $rootScope.companytab = false;
    $rootScope.locationtab = false;
    $rootScope.usertab = false;
    $rootScope.solutionstab = false;
    $rootScope.pricingtab = false;
    $rootScope.supporttab = false;
    $rootScope.gstsolutionstab = false;
    $rootScope.logintab = false;
    $rootScope.patnerstab = false;
    $rootScope.showheader = false;
    $rootScope.rolestab = false;
    $rootScope.showCompanyname = false;
    $scope.showerror = false;
    $scope.errormessage = "";
    $rootScope.balancesheetbreadcurmbs = false;
    $rootScope.showCompanyname = false;
    $rootScope.voucherstab = false;

    $scope.passwordtext = "password";

    $scope.showPassword = function() {
        if ($scope.passwordtext === "password") {
            $scope.passwordtext = "text";
        } else {
            $scope.passwordtext = "password";
        }
    };
    $scope.user = {};
    if ($rootScope.fromlogin) {
        $rootScope.fromlogin = false;
        $scope.user.mobile = $rootScope.mobile;
    }
    $scope.raiseotpmethod = function() {
        if ($scope.user.mobile === undefined || $scope.user.mobile === "") {
            $scope.showerror = true;
            $scope.errormessage = "Please enter mobile number";
            return;
        }
        $scope.logoutrequest("reset");
    }
    $scope.clientLogin = function() {
        if ($scope.validations()) {
            $scope.logoutrequest("login");
        }
    }
    $scope.logoutrequest = function(text) {
        $scope.loading = true;
        $http.get(domain + api + 'logout/')
            .then(function success(result) {
                $scope.loading = false;
                if (text === "login") {
                    $scope.loginrequest()
                } else {
                    $scope.otprequest()
                }
            }, function error(data) {
                $scope.loading = false;
                session.sessionexpried(data.status);
            });
    }
    $scope.otprequest = function() {
        $scope.loading = true;
        var data = { "mobile": $scope.user.mobile, "device_id": '00:37:6D:EA:77:FD', "is_browser": true, "reset_password": true };

        var success = function(result) {
            $scope.loading = false;
            $state.go('resetpassword');
            $rootScope.mobile = $scope.user.mobile;
            localStorageService.set('mobile', $rootScope.mobile);
        }
        var error = function(result) {
            $scope.loading = false;
            if (result.status === 401) {
                $scope.errormessage = result.data.error.message;
            } else {
                session.sessionexpried(result.status);
            }

        }
        $http.post(domain + api + 'raiseotp/', data)
            .then(success, error)
    }
    $scope.loginrequest = function() {
        $scope.loading = true;
        var data = { "mobile": $scope.user.mobile, "password": $scope.user.password, "device_id": '00:37:6D:EA:77:FD' };
        $http.post(domain + api + "login/", data)
            .then(function mysuccess(result) {
                    // dataMove.setMyData(result.data.tenant);
                    $scope.loading = false;
                    $rootScope.session_key = result.data.session_key;
                    $rootScope.csrftoken = result.data.csrf;
                    $rootScope.tenant_id = result.data.tenant_id;
                    $rootScope.mobile = result.data.mobile;
                    $rootScope.name = result.data.name;
                    localStorageService.set('mobile', $rootScope.mobile);
                    localStorageService.set('name', $rootScope.name);
                    localStorageService.set('session_key', $rootScope.session_key);
                    localStorageService.set('csrftoken', $rootScope.csrftoken);
                    localStorageService.set('tenant_id', $rootScope.tenant_id);
                    // console.log(dataMove.getMyData());
                    $state.go("company")
                    $scope.loadmsg = true;
                    $scope.msg = "logged in user successfully done";
                },
                function myerror(result) {
                    $scope.loading = false;
                    $scope.showerror = true;
                    session.sessionexpried(result.status);
                    if (result.data.error !== undefined)
                        $scope.errormessage = result.data.error.message;
                });
    }
    $scope.validations = function() {
        if ($scope.user.mobile === undefined || $scope.user.mobile === "") {
            $scope.mobilenumbererror = true;
            $scope.mobileerrormessage = "Please enter valid mobile number";
            return false;
        }
        if ($scope.user.password === undefined || $scope.user.password === "") {
            $scope.passworderror = true;
            $scope.passworderrormessage = "Please enter password";
            return false;
        }
        return true;
    }
    $scope.validationsonblur = function(mobile) {
        console.log(mobile);
        if (mobile === undefined) {
            $scope.mobilenumbererror = true;
            $scope.mobileerrormessage = "Please enter mobile number";
            return;
        }
        if (!mobile.match(/^[0-9]{10}$/)) {
            $scope.mobilenumbererror = true;
            $scope.mobileerrormessage = "Please enter valid mobile number";
        }
        $scope.mobilenumbererror = false;
    }
    $scope.validationpasswordblur = function(password) {
        console.log(password);
        if (password === undefined) {
            $scope.passworderror = true;
            $scope.passworderrormessage = "Please enter password";
            return;
        }
        $scope.passworderror = false;
    }
    $scope.editingfields = function() {
        $scope.showerror = false;
    }
    $scope.gotosignup = function() {
        var result = { fromlogin: true };
        $state.go('signup', result);
    }
});