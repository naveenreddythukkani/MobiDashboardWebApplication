var MobiDash = angular.module('mobiDashBoardApp');
MobiDash.controller('downloadsCntl', function($scope, $state, $rootScope, $stateParams, $http, domain, api, $timeout, $window, core, localStorageService, NgTableParams, dataMove, session) {
    $rootScope.activeTab = 11;
    $rootScope.companytab = true;
    $rootScope.locationtab = false;
    $rootScope.usertab = false;
    $rootScope.solutionstab = false;
    $rootScope.pricingtab = false;
    $rootScope.supporttab = false;
    $rootScope.gstsolutionstab = false;
    $rootScope.showheader = true;
    $rootScope.usernametab = true;
    $rootScope.patnerstab = false;
    $rootScope.logintab = false;
    $rootScope.backuptab = true;
    $rootScope.rolestab = false;
    $rootScope.downloadstab = true;
    $rootScope.showCompanyname = false;
    $rootScope.balancesheetbreadcurmbs = false;
    $rootScope.voucherstab = false;

    $scope.openUrl = function(url) {
        $window.open(url, '_blank');
    }

    $scope.downloadsList = [{
        "name": "Desktop",
        "url": "https://staging.mobibooks.in/update-mobibooks/"
    }, {
        "name": "Mobi Invoice",
        "url": "https://play.google.com/store/apps/details?id=com.mobigesture.invoicing&hl=en"
    }, {
        "name": "Mobi Field",
        "url": "https://play.google.com/store/apps/details?id=com.mobifield&hl=en"
    }];
});