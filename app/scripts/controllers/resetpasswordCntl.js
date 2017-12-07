var MobiDash = angular.module('mobiDashBoardApp');
MobiDash.controller('resetpasswordCntl', function($scope, $state, $rootScope, $stateParams, $http, domain, api, $timeout, core, localStorageService, NgTableParams, dataMove, session) {
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

    $scope.showerror = false;
    $scope.errormessage = "";

    $scope.user = {};
    $scope.resetdata = {};
    $scope.resetpasswords = function() {
        $scope.loading = true;
        $scope.resetdata.device_id = "00:37:6D:EA:77:FD";
        $scope.resetdata.mobile = $rootScope.mobile;
        $scope.resetdata.pwd = $scope.user.pwd;
        $scope.resetdata.otp = $scope.user.otp;
        var succes = function(result) {
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
            }).then(function() {
                $state.go("login")
            });
            $state.go("login");
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.post(domain + api + "resetpassword/", $scope.resetdata)
            .then(succes, error)

    }

});