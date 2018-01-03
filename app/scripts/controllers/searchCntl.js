var QTable = angular.module('mobiDashBoardApp');
QTable.controller('searchCntl', function($scope, $state, $rootScope, $stateParams, $http, domain, api, $timeout, core, localStorageService, NgTableParams, dataMove, session, $filter, $window) {

    $rootScope.companytab = false;
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
    $rootScope.backuptab = false;
    $rootScope.rolestab = false;
    $rootScope.showCompanyname = true;
    $rootScope.balancesheetbreadcurmbs = false;
    $rootScope.addloc = false;
    $rootScope.addclient = false;
    $rootScope.contactus = false;
    $rootScope.adduser = false;
    $rootScope.addrole = false;
    $rootScope.addvouchertype = false;

    $scope.passparameters = {};
    $rootScope.grouplevel = true;
    $rootScope.subgrouplevel = true;
    $rootScope.ledgerlevel = true;
    $rootScope.voucherstab = false;
    $rootScope.controlledger = true;
    $rootScope.voucherControl = false;
    $rootScope.isSearched = false;
    localStorageService.set("isSearched", false);
    $scope.searchdetails = [];
    $scope.globalSearchData = "";

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

    $scope.searchtextchange = function() {
        if ($scope.globalSearchData === '') {
            $scope.searchdetails = [];
            return;
        } else {
            $scope.loading = true;
            var success = function(result) {
                $scope.loading = false;
                if (result.data.error === undefined) {
                    $scope.searchdetails = result.data.data;
                    if ($scope.searchdetails.length >= 20) {
                        $scope.LoadMoreButton = true;
                    } else {
                        $scope.LoadMoreButton = false;
                    }
                } else {
                    $scope.msg = result.data.error.message;
                    $scope.addremovealert();
                }
            }
            var error = function(data) {
                $scope.loading = false;
                session.sessionexpried(data.status);
            };
            $http.get(domain + api + 'list/findalldata/?q=' + $scope.globalSearchData + '&sendall=0', config).
            then(success, error);

        }
    };
    $scope.searchboxchangeAction = function() {
        if ($scope.globalSearchData === '') {
            $scope.searchdetails = [];
            return;
        } else {

        }
    }
    $scope.showMoreResults = function() {
        $scope.LoadMoreButton = false;
        $scope.loading = true;
        var success = function(result) {
            $scope.searchdetails = result.data.data;
            $scope.LoadMoreButton = false;
            $scope.loading = false;
        }
        var error = function(data) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + api + 'list/findalldata?q=' + $scope.globalSearchData + '&sendall=1', config).
        then(success, error);
    };

    $scope.searchfunctionality = function() {
        $scope.searchtextchange();
    }

    $scope.itemSearch = function(id, type, name, rootId) {
        console.log(id + "--" + type);
        $rootScope.isSearched = true;
        localStorageService.set("isSearched", true);
        $rootScope.searchObjs = [];
        $rootScope.searchObjs.push({ "id": id, "type": type, "name": name, "rootId": rootId });
        console.log(JSON.stringify($rootScope.searchObjs));
        if (rootId != 0)
            $rootScope.rootgroup_id = rootId;
        if (type == "G") {
            $scope.passparameters.rootgroupname = name;
            $scope.passparameters.rootgroupamount = 0;
            $scope.passparameters.rootname = "";
            $scope.passparameters.ledgergroupid = id;
            $scope.passparameters.today = $rootScope.today;
            dataMove.setsearchgroupData($scope.passparameters)
            $state.go("subledgersgroup");
        } else if (type == "U") {
            $scope.passparameters.subgroup_name = name;
            $scope.passparameters.ledgergroup_id = id;
            dataMove.setsearchsubgroupData($scope.passparameters)
            $state.go("ledger");
        } else if (type == "S") {
            ltypeledgerstatus = true;
            $scope.passparameters.ledger_name = name;
            $scope.passparameters.ledger_id = id;
            $scope.passparameters.ledger_ltype = type;
            dataMove.setsearchledgerData($scope.passparameters);
            $state.go("controlledger");
        } else if (type == "E") {
            ltypeledgerstatus = true;
            $scope.passparameters.ltype_name = name;
            $scope.passparameters.sl_id = id;
            $scope.passparameters.rootgroup_id = 1;
            $scope.passparameters.ledger_ltype = "S";
            $rootScope.ledger_ltype = "S";
            localStorageService.set("ledger_ltype", $rootScope.ledger_ltype)
            dataMove.setsearchcontrolledgerData($scope.passparameters)
            $state.go("voucher");
        } else if (type != "R") {
            ltypeledgerstatus = false;
            $scope.passparameters.ledger_name = name;
            $scope.passparameters.ledger_id = id;
            $scope.passparameters.ledger_ltype = type;
            localStorageService.set("ledger_ltype", type)
            $rootScope.ledger_ltype = type;
            dataMove.setsearchcontrolledgerData($scope.passparameters)
            $state.go("voucher");
        }
    };
    $scope.backButtonAction = function() {
        dataMove.setsearchcontrolledgerData({});
        dataMove.setsearchledgerData({});
        dataMove.setsearchgroupData({});
        dataMove.setsearchsubgroupData({});
        dataMove.setsearchvoucherData({});
        dataMove.setsearchmonthwiseData({});
        $window.history.back();
    }
});