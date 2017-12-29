var QTable = angular.module('mobiDashBoardApp');
QTable.controller('balancesheetCntl', function($scope, $state, $rootScope, $stateParams, $http, domain, api, $timeout, core, localStorageService, NgTableParams, dataMove, session, $filter) {

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
    $rootScope.balancesheetbreadcurmbs = true;
    $rootScope.addloc = false;
    $rootScope.addclient = false;
    $rootScope.contactus = false;
    $rootScope.adduser = false;
    $rootScope.addrole = false;
    $rootScope.grouplevel = false;
    $rootScope.subgrouplevel = false;
    $rootScope.ledgerlevel = false;
    $rootScope.controlledger = false;
    $rootScope.voucherstab = false;
    $rootScope.addvouchertype = false;
    $rootScope.dateremove = false;
    $rootScope.voucherControl = false;


    $scope.passparameters = {};

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
    $scope.clearlocalstorage = function() {
        dataMove.setgroupdata({});
        dataMove.setsubgroupdata({});
        dataMove.setledgerData({});
        dataMove.setcontrolledgerData({});
        dataMove.setmonthwiseData({})
        dataMove.clearAlldata(["groupData", "subgroupData", "ledger", "controlledger", 'monthwise', "voucherData"]);
        $rootScope.getlocalstoredata();
        $rootScope.getalllocationinheader();
    }
    $scope.clearlocalstorage();
    $rootScope.dashBoardReport = function() {
            var rootId = $rootScope.pandlreport === true ? 3 : 1;
            var data = { "startdate": $rootScope.startdate, 'todate': $rootScope.today, 'root_id': rootId };
            if ($rootScope.location_id === undefined || $rootScope.location_id === "All Locations" || $rootScope.location_name === '') {
                $rootScope.location_name = "All Locations";
            } else {
                data.loc_id = $rootScope.location_id;
            }
            $scope.loading = true;
            console.log("Request Data ==" + JSON.stringify(data));
            var success = function(data) {
                $scope.loading = false;
                console.log("Response Data =" + JSON.stringify(data));
                var rootGroup = data.data;
                $scope.resultsandsurplusstatus = false;
                $scope.rgroupelements = [];
                for (var i = 0; i < rootGroup.length; i++) {
                    $scope.rgroupelements.push(rootGroup[i]);
                    $scope.rgroupelements = $scope.rgroupelements.reverse();
                }
                for (var i = 0; i < $scope.rgroupelements.length; i++) {
                    if ($scope.rgroupelements[i].rootgroup_id === 4) {
                        $scope.rgroupelements[i].sum_amt += $scope.rgroupelements[i].diff;
                        $scope.rgroupelements[i].sum_amt = $scope.rgroupelements[i].sum_amt.toFixed(2);
                    }
                }
                console.log("$scope.rgroupelements = " + JSON.stringify($scope.rgroupelements));
                if ($scope.rgroupelements.length == 0) {}
            };
            var error = function(result) {
                $scope.loading = false;
                session.sessionexpried(result.status);

            };
            $http.post(domain + api + "list/rootgroup/report/", data, config).
            then(success, error);
        }
        // $rootScope.dashBoardReport();
    $rootScope.datescalculation = function() {
        if ($rootScope.today == undefined || $rootScope.today != $rootScope.today1) {
            $rootScope.today = $filter('date')(new Date(), 'yyyy-MM-dd');
        }
        if ($rootScope.today1 != undefined) {
            $rootScope.today = $rootScope.today1;
        }
        if ($rootScope.fromdate == undefined && $rootScope.fromdate1 == undefined && $rootScope.startdate == undefined && $rootScope.startdate1 == undefined) {
            var completedate = ($rootScope.today).split('-');
            var year = completedate[0];
            var month = completedate[1];
            var day = completedate[2];
            if (day > 10) {
                day = '0' + 1;
            } else {
                day = '0' + 1;
                month = month - 1;
                console.log(month.toString().length);
                if (month.toString().length == 1) {
                    month = '0' + month;
                    if (month == 00) {
                        month = 12;
                        year = year - 1;
                    }
                }
            }
            $rootScope.fromdate = year + '-' + month + '-' + day;
            $rootScope.startdate = year + '-' + '04' + '-' + '01';
            console.log("$rootScope.todate = " + $rootScope.today);
            console.log("$rootScope.fromdate = " + $rootScope.fromdate);
            console.log("$rootScope.startdate = " + $rootScope.startdate);
        }
        if ($rootScope.fromdate1 != undefined) {
            var completedate1 = ($rootScope.fromdate1).split('-');
            var year1 = completedate1[0];
            var month1 = completedate1[1];
            var day1 = completedate1[2];
            $rootScope.fromdate = year1 + '-' + month1 + '-' + day1;
            console.log("$rootScope.fromdate = " + $rootScope.fromdate);
        }
        if ($rootScope.startdate1 != undefined) {
            var completedate2 = ($rootScope.startdate1).split('-');
            var year2 = completedate2[0];
            var month2 = completedate2[1];
            var day2 = completedate2[2];
            $rootScope.startdate = year2 + '-' + month2 + '-' + day2;
            console.log("$rootScope.startdate = " + $rootScope.startdate);
        }
        $rootScope.dashBoardReport();
    }
    $rootScope.datescalculation();
    $scope.groupElements = function(rootgroupname, rootgroupamount, rootname, ledgergroupid, rootgroupid, rootgroupdiff) {
        $scope.passparameters.rootgroupname = rootgroupname;
        $scope.passparameters.rootgroupamount = rootgroupamount;
        $scope.passparameters.rootname = rootname;
        $scope.passparameters.ledgergroupid = ledgergroupid;
        $scope.passparameters.today = $rootScope.today;
        $scope.passparameters.rootgroup_id = rootgroupid;
        $scope.passparameters.rootgroupdiff = rootgroupdiff;
        $scope.passparameters.grouplevel = true;
        dataMove.setgroupdata($scope.passparameters);

        $rootScope.rootgroup_id = rootgroupid;
        localStorageService.set("rootgroup_id", rootgroupid);

        $state.go("subledgersgroup");
    };
});