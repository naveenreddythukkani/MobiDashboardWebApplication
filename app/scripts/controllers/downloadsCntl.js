var MobiDash = angular.module('mobiDashBoardApp');
MobiDash.controller('downloadsCntl', function ($scope, $state, $rootScope, $stateParams, $http, domain, api, $timeout, $window, core, localStorageService, NgTableParams, dataMove, session) {
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
    $rootScope.mobilebreadcurmbs = false;

    $scope.openUrl = function (url) {
        $window.open(url, '_blank');
    }

    $scope.downloadsList = [{
        "icon": "images/desktop_icon.png",
        "name": "Desktop App(x-86)",
        "url": "https://api.mobibooks.in/act/api/download_exe"
    }, {
        "icon": "images/mobi_invoice.png",
        "name": "Mobi Invoice",
        "url": "https://play.google.com/store/apps/details?id=com.mobigesture.invoicing&hl=en"
    }, {
        "icon": "images/mobi_field.png",
        "name": "Mobi Field",
        "url": "https://play.google.com/store/apps/details?id=com.mobifield&hl=en"
    }];
});
