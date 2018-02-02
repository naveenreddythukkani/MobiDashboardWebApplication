var QTable = angular.module('mobiDashBoardApp');
QTable.controller('usersearchCntl', function($scope, $state, $rootScope, $stateParams, $http, domain, api, $timeout, core, localStorageService, NgTableParams, dataMove, session, $filter, $window, mobileWidth) {

    $rootScope.balancesheetbreadcurmbs = false;
    $scope.userslist = [];
    $scope.userSearchData = "";
    var screenwidth = $(window).width();
    if (screenwidth > mobileWidth) {
        $rootScope.showheader = true;
        $rootScope.mobileheader = false;
    } else {
        $rootScope.showheader = false;
        $rootScope.mobileheader = false;
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
    $timeout(function() {
        $('[name="balanceSheetSearch"]').focus();
    }, 50);

    $scope.backButtonAction = function() {
        $window.history.back();
    }

    $scope.userslist = dataMove.getusersearchData();

    // $scope.searchfunctionality = function() {
    //     if ($scope.userSearchData === "") {
    //         $scope.userslist = [];
    //         return;
    //     } else {
    //         $scope.users = $scope.userslist;
    //         $scope.users = $scope.users.filter(function() {

    //         });

    //     }
    // }
});