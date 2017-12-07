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

MobiDash.directive("outsideClick", ['$document', function($document) {
    return {
        link: function($scope, $element, $attributes) {
            var scopeExpression = $attributes.outsideClick;
            var onDocumentClick = function(event) {
                console.log(event.target.id);
                if (event.target.id != 'clientsdata' || event.target.id != 'dropdownMenuhideshow') {
                    $scope.$apply(scopeExpression);
                }
            };
            $document.on("click", onDocumentClick);
            $element.on('$destroy', function() {
                $document.off("click", onDocumentClick);
            });
        }
    }
}]);
MobiDash.factory('session', function($state) {
    return {
        sessionexpried: function(status) {
            if (status === 403) {
                swal({
                    title: "Session Expired!",
                    text: "Please login again!",
                    type: 'error',
                    confirmButtonColor: "red",
                    confirmButtonText: "Ok",
                }).then(function() {
                    $state.go("login")
                });
            }
            if (status === 502 || status === 500) {
                swal({
                    title: "Error",
                    text: "Oops! something went worng",
                    type: 'error',
                    confirmButtonColor: "red",
                    confirmButtonText: "Ok",
                }).then(function() {});
            }
            if (status === 5000) {
                swal({
                    title: "Error",
                    text: "Generic system failure",
                    type: 'error',
                    confirmButtonColor: "red",
                    confirmButtonText: "Ok",
                }).then(function() {});
            }
        }
    };
});
MobiDash.directive("messageAlert", function() {
    return {
        template: '<div class="alert  alert-position-success" id="success-alert" style="display:none;"><strong>{{msg}}</strong></div>',
        restrict: 'E',
        $scope: true,
        link: function($scope, $timeout) {
            if ($scope.loadmsg) {
                $timeout(function() {
                    $("#success-alert").addClass('in');
                    $("#success-alert").fadeTo(2000, 500).slideUp(500, function() {
                        $("#success-alert").removeClass('in');
                    });
                }, 50);
            }
        }
    };
});

MobiDash.directive('mobileValidation', function() {
    return {
        link: function(scope, el, attr) {
            el.bind("keydown", function(event) {
                //ignore all characters that are not numbers, except backspace, delete, left arrow and right arrow
                if ((event.keyCode < 48 || event.keyCode > 57) && event.keyCode != 8 && event.keyCode != 46 && event.keyCode != 37 && event.keyCode != 39 && event.keyCode != 9) {
                    event.preventDefault();
                }
            });
        }
    }
});
MobiDash.filter('INRCurrency', function() {
    return function(amount, showDecimals, symbol) {
        if (!amount || amount.length <= 0 || amount === undefined) {
            return "0.00";
        }
        var vamount = amount.toString();
        var symbolToUse = symbol || '₹';
        showDecimals = true;
        var afterPoint = '';
        if (showDecimals && vamount.split(".").length > 1) {
            afterPoint = '.' + vamount.split(".")[1];
            if (afterPoint.length == 1) {
                afterPoint += '00';
            } else if (afterPoint.length == 2) {
                afterPoint += '0';
            }

        } else {
            afterPoint = '.00';
        }
        vamount = vamount.split('.')[0];
        vamount = vamount.toString();
        var lastThree = vamount.substring(vamount.length - 3);
        var otherNumbers = vamount.substring(0, vamount.length - 3);
        if (otherNumbers != '')
            lastThree = ',' + lastThree;
        var formattedAmount = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
        return formattedAmount.replace('-,', '-');

    };
});