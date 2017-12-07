var MobiDash = angular.module('mobiDashBoardApp');
MobiDash.controller('signupCntl', function($scope, $state, $rootScope, $stateParams, $http, domain, api, $timeout, core, localStorageService, $interval, session, $window) {

    // showig all tabs
    $rootScope.companytab = false;
    $rootScope.locationtab = false;
    $rootScope.usertab = false;
    $rootScope.solutionstab = true;
    $rootScope.pricingtab = true;
    $rootScope.supporttab = true;
    $rootScope.gstsolutionstab = true;
    $rootScope.showheader = true;
    $rootScope.patnerstab = true;
    $rootScope.logintab = true;
    $rootScope.backuptab = false;
    $rootScope.rolestab = false;
    $rootScope.showCompanyname = false;
    $rootScope.balancesheetbreadcurmbs = false;

    $rootScope.addloc = false;
    $rootScope.addclient = false;
    $rootScope.contactus = true;
    $rootScope.signup = true;
    $rootScope.usernametab = false;
    $rootScope.addrole = false;
    $rootScope.addvouchertype = false;



    //   scope varibles
    $scope.props = {};
    $scope.verify = {};
    $scope.clientdata = {};
    $scope.errorMesg = "";
    $scope.validatetoGenrateOtp = true;
    $scope.verifyOtp = true;
    $scope.showingpassword = false;
    $scope.readonlyaftergenarateOtp = false;
    $scope.readonlyafterverify = false;
    $scope.timervalue = '';
    var timer;

    // if ($state.params.fromlogin) {
    //     $state.params.fromlogin = false;
    //     // $state.reload();
    //     $window.location.reload();
    // }

    $scope.validationUptoGenrateOtp = function() {
        if (($scope.props.company_name !== undefined && $scope.props.company_name !== "") && ($scope.props.contact_name !== undefined && $scope.props.contact_name !== "") && ($scope.props.mobile !== undefined && $scope.props.mobile !== "" && $scope.props.mobile.length === 10)) {
            $scope.validatetoGenrateOtp = false;
            if ($scope.props.otp !== undefined && $scope.props.otp !== "" && $scope.props.otp.length === 6) {
                $scope.verifyOtp = false;
            } else {
                $scope.verifyOtp = true;
            }
        } else {
            $scope.validatetoGenrateOtp = true;
            $scope.verifyOtp = true;
        }

    };
    $scope.validationforStartNow = function() {}
    $scope.genarateOtp = function() {
        $scope.loading = true;
        $scope.props.is_browser = true;
        $scope.props.device_id = "";
        $http.get(domain + api + 'logout/')
            .then(function success(result) {
                    $scope.loading = false;
                    $scope.loading = true;
                    $http.post(domain + api + 'raiseotp/', $scope.props)
                        .then(function mysuccess(result) {
                                $scope.loading = false;
                                if (result.data.error !== undefined && result.data.error.code === 402) {
                                    localStorageService.set("mobile", $scope.props.mobile);
                                    $rootScope.mobile = $scope.props.mobile;
                                    swal({
                                        title: "",
                                        text: "You are already signed up Please login.",
                                        type: 'success',
                                        allowOutsideClick: false,
                                        confirmButtonColor: '#1fa9cc ',
                                        confirmButtonText: "Ok",
                                    }).then(function() {
                                        $state.go("login")
                                    });
                                    $rootScope.fromlogin = true;
                                } else {
                                    for (key in result.data) {
                                        if (key === "resp") {
                                            $scope.timervalue = 30;
                                            $scope.timerintilaization();
                                            $('#otpfield').focus();
                                            $scope.readonlyaftergenarateOtp = true;
                                            $scope.loadmsg = true;
                                            $scope.msg = "Otp has been sent to the entered mobile number";
                                        }
                                    }
                                }
                            },
                            function myerror(data) {
                                $scope.loading = false;
                                session.sessionexpried(data.status);
                            });
                },
                function error(data) {
                    $scope.loading = false;
                    session.sessionexpried(data.status);
                });
    };
    var timerrun = function() {
        $scope.timervalue--;
        if ($scope.timervalue == 0) {
            $scope.timervalue = "";
            $interval.cancel(timer);
            $scope.validatetoGenrateOtp = false;
        }
    }
    $scope.timerintilaization = function() {
        $scope.validatetoGenrateOtp = true;
        timer = $interval(timerrun, 1000);
    }
    $scope.verifyOtps = function() {
        $scope.loading = true;
        $scope.verify.mobile = $scope.props.mobile;
        $scope.verify.otp = $scope.props.otp;
        var success = function(result) {
            $scope.loading = false;
            for (key in result.data) {
                if (key === "resp") {
                    $scope.showingpassword = true;
                    $scope.readonlyafterverify = true;
                    $scope.loadmsg = true;
                    $scope.msg = "Otp verification is successful.";
                }
            }

        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.post(domain + api + 'verifyotp/', $scope.verify)
            .then(success, error)
    };
    $scope.gettenantStatus = function(tenant_id) {
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + core + 'tenant/' + tenant_id, config)
            .then(success, error)

    }
    $scope.startNow = function() {
        if ($scope.props.password !== $scope.props.confirm_password) {
            $scope.showerror = true;
            $scope.errormessage = "Password and Confirmpassword is not matched";
            return;
        }
        $scope.loading = true;
        $scope.clientdata.mobile = $scope.props.mobile;
        $scope.clientdata.company_name = $scope.props.company_name;
        $scope.clientdata.contact_name = $scope.props.contact_name;
        $scope.clientdata.password = $scope.props.password;
        $scope.clientdata.confirm_password = $scope.props.confirm_password;
        $scope.clientdata.email = $scope.props.email;
        var success = function(result) {
            $scope.loading = false;
            $rootScope.session_key = result.data.session_key;
            $rootScope.csrftoken = result.data.csrf_token;
            $rootScope.tenant_id = result.data.tenant_id;
            localStorageService.set('session_key', $rootScope.session_key);
            localStorageService.set('csrftoken', $rootScope.csrftoken);
            localStorageService.set('tenant_id', $rootScope.tenant_id);
            $rootScope.mobile = result.data.mobile;
            $rootScope.name = result.data.name;
            localStorageService.set('mobile', $rootScope.mobile);
            localStorageService.set('name', $rootScope.name);
            $state.go("company")
            $scope.loadmsg = true;
            $scope.msg = "You company is created successfully.";
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.post(domain + core + 'tenant/', $scope.clientdata)
            .then(success, error)
    };

    var config = {
        headers: {
            "X-CSRFToken": $rootScope.csrftoken,
            "Cookie": "csrftoken=" + $rootScope.csrftoken + '; ' + "sessionid=" + $rootScope.session_key
        }
    };

});