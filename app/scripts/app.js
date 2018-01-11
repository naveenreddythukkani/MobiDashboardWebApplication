var MobiDash = angular.module('mobiDashBoardApp', ['ngAnimate', 'ngCookies', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch', 'ui.router', 'LocalStorageModule', 'ngTable']);
MobiDash.config(function($routeProvider, $stateProvider, $urlRouterProvider, $httpProvider, $sceProvider, $locationProvider) {
    $sceProvider.enabled(false);
    var screenwidth = $(window).width();
    var mobileWidth = 640;
    if (screenwidth > mobileWidth) {
        $urlRouterProvider.otherwise('login');
    } else {
        $urlRouterProvider.otherwise('login');
    }
    $stateProvider
        .state('signup', {
            url: '/signup',
            templateUrl: 'views/signup.html',
            controller: "signupCntl",
            params: {
                "fromlogin": false
            }
        })
        .state('company', {
            url: '/company',
            templateUrl: screenwidth > mobileWidth ? 'views/company.html' : 'views/m.company.html',
            controller: "companyCntl",
            onEnter: changeOnEnter
        })
        .state('location', {
            url: '/location',
            templateUrl: screenwidth > mobileWidth ? 'views/location.html' : 'views/m.location.html',
            controller: "locationCntl",
            onEnter: changeOnEnter
        })
        .state('download', {
            url: '/download',
            templateUrl: 'views/downloads.html',
            controller: "downloadsCntl",
            onEnter: changeOnEnter
        })
        .state('user', {
            url: '/user',
            templateUrl: 'views/user.html',
            controller: "userCntl",
            onEnter: changeOnEnter
        })
        .state('backup', {
            url: '/backup',
            templateUrl: 'views/backup.html',
            controller: "backupCntl",
            onEnter: changeOnEnter
        })
        .state('resetpassword', {
            url: '/resetpassword',
            templateUrl: 'views/resetpassword.html',
            controller: "resetpasswordCntl"
        })
        .state('roles', {
            url: '/roles',
            templateUrl: 'views/roles.html',
            controller: "rolesCntl",
            onEnter: changeOnEnter
        })
        .state('vouchersettings', {
            url: '/vouchersettings',
            templateUrl: 'views/vouchersettings.html',
            controller: "vouchersettingsCntl",
            onEnter: changeOnEnter
        })
        .state('balancesheet', {
            url: '/balancesheet',
            templateUrl: 'views/balancesheet.html',
            controller: "balancesheetCntl",
            onEnter: changeOnEnter
        })
        .state('subledgersgroup', {
            url: '/subledgersgroup',
            templateUrl: 'views/subledgersgroup.html',
            controller: "subledgersgroupCntl",
            onEnter: changeOnEnter
        })
        .state('ledger', {
            url: '/ledger',
            templateUrl: 'views/ledger.html',
            controller: "ledgerCntl",
            onEnter: changeOnEnter
        })
        .state('controlledger', {
            url: '/controlledger',
            templateUrl: 'views/controlledger.html',
            controller: "controlledgerCntl",
            onEnter: changeOnEnter
        })
        .state('voucher', {
            url: '/voucher',
            templateUrl: 'views/voucher.html',
            controller: "voucherCntl",
            onEnter: changeOnEnter
        })
        .state('voucherdetails', {
            url: '/voucherdetails',
            templateUrl: 'views/voucherdetails.html',
            controller: "voucherdetailsCntl",
            onEnter: changeOnEnter
        })
        .state('search', {
            url: '/search',
            templateUrl: 'views/search.html',
            controller: "searchCntl",
            onEnter: changeOnEnter
        })
        .state('monthWise', {
            url: '/monthWise',
            templateUrl: 'views/monthWise.html',
            controller: "monthWiseCntl",
            onEnter: changeOnEnter
        })
        .state('login', {
            url: '/login',
            templateUrl: screenwidth > mobileWidth ? 'views/login.html' : 'views/m.login.html',
            controller: "loginCntl"
        });
    // $locationProvider.hashPrefix('')
    // $locationProvider.html5Mode(true);
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.headers.common['Accept'] = 'application/json;charset=utf-8';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    $httpProvider.defaults.headers.post['Accept'] = 'application/json;charset=utf-8';
    var body = document.getElementsByTagName('body')[0];
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
    $httpProvider.defaults.headers.common['X-Frame-Options'] = "SAMEORIGIN";

});
MobiDash.run(function(localStorageService, $rootScope, $transitions) {
    $rootScope.session_key = localStorageService.get('session_key');
    $rootScope.csrftoken = localStorageService.get('csrftoken');
    $rootScope.tenant_id = localStorageService.get('tenant_id');
    $rootScope.mobile = localStorageService.get('mobile');
    $rootScope.name = localStorageService.get('name');
    $rootScope.selected_company_name = localStorageService.get('tenant_name');
    $rootScope.owner_id = localStorageService.get('owner_id');
    $rootScope.location_id = localStorageService.get('location_id');
    $rootScope.location_name = localStorageService.get('location_name');
    $rootScope.privilege = localStorageService.get('privilege');
    $rootScope.balnc = localStorageService.get("balnc");
    $rootScope.ledger_ltype = localStorageService.get("ledger_ltype");
    $rootScope.rootgroup_id = localStorageService.get("rootgroup_id");
    $rootScope.locationsListinheader = localStorageService.get("locations");
    $rootScope.isSearched = localStorageService.get("isSearched");

    $transitions.onStart({}, function(trans, $state) {
        // console.log(trans.router.stateService);
    });
});

var changeOnEnter = function(localStorageService, $state) {
    if (!localStorageService.get('session_key') || !localStorageService.get('csrftoken')) {
        $state.go('login');
    }
};
// Production
// MobiDash.constant("domain", "https://api.mobibooks.in/");
//dev
MobiDash.constant("domain", "http://139.59.3.114/");
MobiDash.constant("api", "act/api/");
MobiDash.constant("core", "act/core/");
MobiDash.constant("mobileWidth", 640);