var QTable = angular.module('mobiDashBoardApp');
QTable.controller('searchCntl', function($scope, $state, $rootScope, $stateParams, $http, domain, api, $timeout, core, localStorageService, NgTableParams, dataMove, session, $filter) {

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
                session.sessionexpried(result.status);
            };
            $http.get(domain + api + 'list/findalldata/?q=' + $scope.globalSearchData + '&sendall=0', config).
            then(success, error);

        }
    };
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

    $scope.clearSearchinsearch = function() {
        $scope.globalSearchData = "";
        $scope.searchdetails = [];
    }

    // $scope.itemSearch = function(id, type, name, rootId) {
    //     console.log(id + "--" + type);
    //     $rootScope.isSearched = true;
    //     $rootScope.searchObjs = [];
    //     $rootScope.searchObjs.push({ "id": id, "type": type, "name": name, "rootId": rootId });
    //     console.log(JSON.stringify($rootScope.searchObjs));
    //     if (rootId != 0)
    //         $rootScope.rootgroup_id = rootId;
    //     if (type == "G") {
    //         $rootScope.rootgroupname = name;
    //         $rootScope.rootgroupamount = 0;
    //         $rootScope.rootname = "";
    //         $rootScope.ledgergroupid = id;
    //         $rootScope.today = $rootScope.today;
    //         // $rootScope.rootgroupid = rootgroupid;
    //         // $rootScope.rootgroupdiff = rootgroupdiff;
    //         $rootScope.searchObjs[0].screen = "subledgersgroup";
    //         $state.go("subledgersgroup");
    //     } else if (type == "U") {
    //         $rootScope.subgroup_name = name;
    //         $rootScope.ledgergroup_id = id;
    //         $rootScope.searchObjs[0].screen = "ledger";
    //         $state.go("ledger");
    //     } else if (type == "S") {
    //         ltypeledgerstatus = true;
    //         $rootScope.ledger_name = name;
    //         $rootScope.ledger_id = id;
    //         $rootScope.ledger_ltype = type;
    //         $rootScope.searchObjs[0].screen = "ltypesscreen";
    //         $state.go("ltypesscreen");
    //     } else if (type == "E") {
    //         ltypeledgerstatus = true;
    //         $rootScope.ledger_name = name;
    //         $rootScope.sl_id = id;
    //         $rootScope.rootgroup_id = 1;
    //         $rootScope.ledger_ltype = "S";
    //         $rootScope.searchObjs[0].screen = "voucher";
    //         console.log("E" + JSON.stringify($rootScope.searchObjs[0]))
    //         $state.go("voucher");
    //     } else if (type != "R") {
    //         ltypeledgerstatus = false;
    //         $rootScope.ledger_name = name;
    //         $rootScope.ledger_id = id;
    //         $rootScope.ledger_ltype = type;
    //         $rootScope.searchObjs[0].screen = "voucher";
    //         $state.go("voucher");
    //     }
    // };


});