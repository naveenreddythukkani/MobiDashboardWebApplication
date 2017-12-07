var MobiDash = angular.module('mobiDashBoardApp', ['ngAnimate', 'ngCookies', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch', 'ui.router', 'LocalStorageModule', 'ngTable']);
MobiDash.config(function($routeProvider, $stateProvider, $urlRouterProvider, $httpProvider, $sceProvider) {
    $sceProvider.enabled(false);
    $urlRouterProvider.otherwise('/signup');
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
            templateUrl: 'views/company.html',
            controller: "companyCntl"
        })
        .state('location', {
            url: '/location',
            templateUrl: 'views/location.html',
            controller: "locationCntl"
        })
        .state('user', {
            url: '/user',
            templateUrl: 'views/user.html',
            controller: "userCntl"
        })
        .state('backup', {
            url: '/backup',
            templateUrl: 'views/backup.html',
            controller: "backupCntl"
        })
        .state('resetpassword', {
            url: '/resetpassword',
            templateUrl: 'views/resetpassword.html',
            controller: "resetpasswordCntl"
        })
        .state('roles', {
            url: '/roles',
            templateUrl: 'views/roles.html',
            controller: "rolesCntl"
        })
        .state('vouchersettings', {
            url: '/vouchersettings',
            templateUrl: 'views/vouchersettings.html',
            controller: "vouchersettingsCntl"
        })
        .state('balancesheet', {
            url: '/balancesheet',
            templateUrl: 'views/balancesheet.html',
            controller: "balancesheetCntl"
        })
        .state('subledgersgroup', {
            url: '/subledgersgroup',
            templateUrl: 'views/subledgersgroup.html',
            controller: "subledgersgroupCntl"
        })
        .state('ledger', {
            url: '/ledger',
            templateUrl: 'views/ledger.html',
            controller: "ledgerCntl"
        })
        .state('controlledger', {
            url: '/controlledger',
            templateUrl: 'views/controlledger.html',
            controller: "controlledgerCntl"
        })
        .state('voucher', {
            url: '/voucher',
            templateUrl: 'views/voucher.html',
            controller: "voucherCntl"
        })
        .state('voucherdetails', {
            url: '/voucherdetails',
            templateUrl: 'views/voucherdetails.html',
            controller: "voucherdetailsCntl"
        })
        .state('search', {
            url: '/search',
            templateUrl: 'views/search.html',
            controller: "searchCntl"
        })
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: "loginCntl"
        });
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

    $transitions.onStart({}, function(trans, $state) {
        // console.log(trans.router.stateService);
    });
});
MobiDash.constant("domain", "http://139.59.3.114/");
MobiDash.constant("api", "act/api/");
MobiDash.constant("core", "act/core/");