var QTable = angular.module('mobiDashBoardApp');
QTable.controller('controlledgerCntl', function($scope, $state, $rootScope, $stateParams, $http, domain, api, $timeout, core, localStorageService, NgTableParams, dataMove, session, $filter) {

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
    $rootScope.addvouchertype = false;

    $scope.passparameters = {};
    $rootScope.grouplevel = true;
    $rootScope.subgrouplevel = true;
    $rootScope.ledgerlevel = true;
    $rootScope.controlledger = false;
    $rootScope.voucherstab = false;
    $rootScope.dateremove = false;
    $rootScope.voucherControl = false;


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
    $scope.savedates = function() {
        $scope.datesObj = {};
        $scope.datesObj.today1 = $rootScope.today1;
        $scope.datesObj.fromdate1 = $rootScope.fromdate1;
        $scope.datesObj.startdate1 = $rootScope.startdate1;
        dataMove.setdatesData($scope.datesObj);
    }
    $scope.clearlocalstorage = function() {
        localStorageService.remove("controlledger");
        dataMove.getcontrolledgerData({});

        dataMove.setvoucherData({});
        localStorageService.remove("voucherData");
        $rootScope.getlocalstoredata();
    }
    $scope.clearlocalstorage();
    $scope.controlledgerreport = function() {
        var data = { 'transdate': $rootScope.today, 'ledger_id': $scope.props.ledger_id };
        if ($rootScope.location_id === undefined || $rootScope.location_id === "All Locations" || $rootScope.location_name === '') {
            $rootScope.location_name = "All Locations";
        } else {
            data.loc_id = $rootScope.location_id;
        }
        $scope.loading = true;
        console.log("Request Data ==" + JSON.stringify(data));
        var success = function(result) {
            $scope.loading = false;
            var ltypesGroup = result.data;
            var totalAmt = 0;
            $scope.ltypselements = [];
            for (var i = 0; i < ltypesGroup.length; i++) {
                if (ltypesGroup[i].ledgersubgroup_id == $scope.props.ledgergroup_id || $scope.props.isSearched) {
                    $scope.ltypselements.push(ltypesGroup[i]);
                    totalAmt += ltypesGroup[i].amount;
                }
            }
            console.log("$scope.ltypselements ===" + JSON.stringify($scope.ltypselements));
            console.log("Total Amount = " + totalAmt.toFixed(2));
            $rootScope.ledger_amt = totalAmt.toFixed(2);
        };
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);

        };
        $http.post(domain + api + "list/controlledgerrpt/", data, config).
        then(success, error);
    }
    $scope.getallgroupdate = function() {
        $scope.props = {};
        if ($rootScope.isSearched) {
            $scope.props = dataMove.getsearchledgerData();
        } else {
            $scope.props = dataMove.getledgerData();
        }
        $scope.datesObj = {};
        $scope.datesObj = dataMove.getdatesData();
        $rootScope.today1 = $scope.datesObj.today1;
        $rootScope.fromdate1 = $scope.datesObj.fromdate1;
        $rootScope.startdate1 = $scope.datesObj.startdate1;
        $rootScope.datescalculation();

    }
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
            if(month==="01" || month==="02"||month==="03"){
                year = year - 1;
              }
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
        $scope.savedates()
        $scope.controlledgerreport();
    }
    $scope.getallgroupdate();
    $scope.voucherSelection = function(ltype_name, ltype_amt, ledger_ltype, gl_id, sl_id, root_id) {
        if ($rootScope.isSearched) {
            // $rootScope.searchObjs.push({ "id": sl_id, "name": ltype_name, "screen": "voucherdetails" });
            $scope.passparameters.ltype_name = ltype_name;
            $scope.passparameters.sl_id = sl_id;
            $scope.passparameters.ledger_id = gl_id;
            $scope.passparameters.ledger_ltype = ledger_ltype;
            $scope.passparameters.controlledger = true;
            dataMove.setsearchcontrolledgerData($scope.passparameters);
        } else {
            $scope.passparameters.ltype_name = ltype_name;
            $scope.passparameters.ltype_amt = ltype_amt;
            $scope.passparameters.ledger_ltype = ledger_ltype;
            $scope.passparameters.ledger_id = gl_id;
            $scope.passparameters.sl_id = sl_id;
            $scope.passparameters.ledger_id = $scope.props.ledger_id;
            $scope.passparameters.controlledger = true;
            dataMove.setcontrolledgerData($scope.passparameters);
        }
        $scope.savedates()
        $state.go("monthWise");
        localStorageService.set("ledger_ltype", ledger_ltype)
        $rootScope.ledger_ltype = ledger_ltype;

    };
});