var MobiDash = angular.module('mobiDashBoardApp');
MobiDash.controller('resetpasswordCntl', function ($scope, $state, $rootScope, $stateParams, $http, domain, api, $timeout, core, localStorageService, NgTableParams, dataMove, session) {
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
    $rootScope.showCompanyname = false;
    $rootScope.balancesheetbreadcurmbs = false;
    $rootScope.voucherstab = false;
    $rootScope.downloadstab = false;

    $scope.showerror = false;
    $scope.errormessage = "";

    $scope.user = {};
    $scope.resetdata = {};
    $scope.addremovealert = function () {
        $("#success-alert").addClass('in');
        $("#success-alert").fadeTo(2000, 500).slideUp(500, function () {
            $("#success-alert").removeClass('in');
        });
    }
    $timeout(function () {
        $('[name="otp"]').focus();
    }, 50);
    $scope.validation = function () {

    }
    $scope.resetpasswords = function () {
        if ($scope.user.otp === undefined || $scope.user.otp === "") {
            $scope.otperror = true;
            $scope.otperrormsg = "Please enter otp";
            return;
        }

        if ($scope.user.otp.length !== 6) {
            $scope.otperror = true;
            $scope.otperrormsg = "Please enter valid Otp";
            return;
        }

        if ($scope.user.pwd === undefined || $scope.user.pwd === "") {
            $scope.otperror = false;
            $scope.passworderror = true;
            $scope.confirmpassworderror = false;
            $scope.passworderrormsg = "Please enter password"
            return;
        }

        if ($scope.user.pwd.length < 4) {
            $scope.otperror = false;
            $scope.passworderror = true;
            $scope.confirmpassworderror = false;
            $scope.passworderrormsg = "Password must be atleast four letters"
            return;
        }


        var patt = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).*$');
        if (!patt.test($scope.user.pwd)) {
            $scope.otperror = false;
            $scope.passworderror = true;
            $scope.confirmpassworderror = false;
            $scope.passworderrormsg = "Password should consists of atleast one uppercase letter and one lowercase letter and one number"
            return;
        }

        if ($scope.user.confirm_password === undefined || $scope.user.confirm_password === "") {
            $scope.otperror = false;
            $scope.passworderror = false;
            $scope.confirmpassworderror = true;
            $scope.confirmpassworderrormsg = "Please enter confirm password"
            return;
        }

        // var patt = new RegExp("/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).*$/");
        // if(!patt.test($scope.user.confirm_password)){
        //     $scope.otperror=false;
        //     $scope.passworderror=false;
        //     $scope.confirmpassworderror=true;
        //     $scope.confirmpassworderrormsg="Password should consists of atleaset one uppercase letter and one lowercase letter and one number"
        //     return;
        // }

        if ($scope.user.pwd !== $scope.user.confirm_password) {
            $scope.otperror = false;
            $scope.passworderror = true;
            $scope.confirmpassworderror = true;
            $scope.passworderrormsg = "Password and confirm password doesn't match";
            $scope.confirmpassworderrormsg = "Password and confirm password doesn't match";
            return;
        }

        $scope.loading = true;
        $scope.resetdata.device_id = "00376DEA77FD";
        $scope.resetdata.mobile = $rootScope.mobile;
        $scope.resetdata.pwd = $scope.user.pwd;
        $scope.resetdata.otp = $scope.user.otp;
        console.log("resetpassword json", $scope.resetdata);
        var succes = function (result) {
            $scope.loading = false;
            // localStorageService.set("mobile", $scope.props.mobile);
            // $rootScope.mobile = $scope.props.mobile;
            $rootScope.fromlogin = true;
            swal({
                title: "",
                text: "Resetpassword successfully done, Please login.",
                type: 'success',
                allowOutsideClick: false,
                confirmButtonColor: '#1fa9cc ',
                confirmButtonText: "Ok",
            }).then(function () {
                $state.go("login")
            });
            $state.go("login");
        }
        var error = function (result) {
            if (result.status === 401) {
                $scope.msg = "OTP Mismatch";
                $scope.addremovealert();
            } else if (result.status === 412) {
                $scope.msg = "Password not qualified";
                $scope.addremovealert();
            } else {
                $scope.msg = "Reset Password Failed. Please Contact Mobibooks @phone: 709-364-4659";
                $scope.addremovealert();
            }
            $scope.loading = false;
            // session.sessionexpried(result.status);
        }
        $http.post(domain + api + "resetpassword/", $scope.resetdata)
            .then(succes, error)

    }

});
