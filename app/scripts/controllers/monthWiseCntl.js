var QTable = angular.module('mobiDashBoardApp');
QTable.controller('monthWiseCntl', function($scope, $state, $rootScope, $stateParams, $http, domain, api, $timeout, core, localStorageService, NgTableParams, dataMove, session, $filter) {

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
    $rootScope.controlledger = true;
    $rootScope.voucherstab = false;
    $rootScope.dateremove = false;
    $rootScope.voucherControl = true;

    $scope.ltype_amt = "";

    $scope.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
        dataMove.setvoucherData({});
        dataMove.setmonthwiseData({});
        $rootScope.getlocalstoredata();
    }
    $scope.clearlocalstorage();

    $scope.getallcontrolandledgerData = function() {
        if ($rootScope.ledger_ltype === 'S') {
            $scope.props = {};
            $scope.props = dataMove.getcontrolledgerData();
            $scope.getallglwisesubledger();
        } else if ($rootScope.ledger_ltype == 'C' || $rootScope.ledger_ltype == 'B' || $rootScope.ledger_ltype == 'L') {
            $scope.props = {};
            $scope.props = dataMove.getledgerData();
            $scope.getallCandBandLtypevoucher();
        }
    }
    $scope.getallglwisesubledger = function() {
        if ($rootScope.location_id == undefined || $rootScope.location_id == "All Locations") {
            var data = { 'fromdate': $rootScope.fromdate, 'todate': $rootScope.today, 'gl_id': $scope.props.ledger_id, 'startdate': $rootScope.startdate, 'sl_id': $scope.props.sl_id };
        } else {
            var data = { 'fromdate': $rootScope.fromdate, 'todate': $rootScope.today, 'gl_id': $scope.props.ledger_id, 'loc_id': $rootScope.location_id, 'startdate': $rootScope.startdate, 'sl_id': $scope.props.sl_id };
        }
        console.log("Data = " + JSON.stringify(data));
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            $scope.realdata = [];
            for (var i = 0; i < result.data.length; i++) {
                $scope.realdata.push(result.data[i])
                $scope.realdata[i].mth = $scope.datesplitandconvertmonth($scope.realdata[i].mth, i);
                $scope.realdata[i].monthName = ($scope.realdata[i].mth).split(' ')[0];
            }
            var moths = _.groupBy($scope.realdata, 'mth');
            $scope.mothwisedata = $scope.calculateMonthsCreditDebit(moths);
            $scope.obdata = [];
            for (var i = 0; i < $scope.mothwisedata.length; i++) {
                if ($scope.mothwisedata[i].type === "OB") {
                    $scope.obdata.push($scope.mothwisedata[i]);
                    $scope.mothwisedata.splice(i, 1);
                }
            }
            sortByMonth($scope.mothwisedata);
            $scope.mothwisedata[0].amount = parseFloat($scope.mothwisedata[0].amount) + parseFloat($scope.obdata[0].amount);
            for (var i = 1; i < $scope.mothwisedata.length; i++) {
                $scope.mothwisedata[i].amount = parseFloat($scope.mothwisedata[i].amount) + parseFloat($scope.mothwisedata[i - 1].amount);
            }
            $scope.mothwisedata[$scope.mothwisedata.length - 1].amount = parseFloat($scope.mothwisedata[$scope.mothwisedata.length - 1].amount).toFixed(2);
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        };
        $http.post(domain + api + 'report/sl/monthwise/', data, config).
        then(success, error);
    }
    $scope.getallCandBandLtypevoucher = function() {
        if ($rootScope.location_id == undefined || $rootScope.location_id == "All Locations") {
            var data = { 'fromdate': $rootScope.fromdate, 'todate': $rootScope.today, 'gl_id': $scope.props.ledger_id, 'startdate': $rootScope.startdate };
        } else {
            var data = { 'fromdate': $rootScope.fromdate, 'todate': $rootScope.today, 'gl_id': $scope.props.ledger_id, 'loc_id': $rootScope.location_id, 'startdate': $rootScope.startdate };
        }
        console.log("Data = " + JSON.stringify(data));
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            $scope.realdata = [];
            for (var i = 0; i < result.data.length; i++) {
                $scope.realdata.push(result.data[i])
                $scope.realdata[i].mth = $scope.datesplitandconvertmonth($scope.realdata[i].mth, i);
            }
            var moths = _.groupBy($scope.realdata, 'mth');
            $scope.mothwisedata = $scope.calculateMonthsCreditDebit(moths);
            $scope.obdata = [];
            for (var i = 0; i < $scope.mothwisedata.length; i++) {
                if ($scope.mothwisedata[i].type === "OB") {
                    $scope.obdata.push($scope.mothwisedata[i]);
                    $scope.mothwisedata.splice(i, 1);
                }
            }
            sortByMonth($scope.mothwisedata);
            $scope.mothwisedata[0].amount = parseFloat($scope.mothwisedata[0].amount) + parseFloat($scope.obdata[0].amount);
            for (var i = 1; i < $scope.mothwisedata.length; i++) {
                $scope.mothwisedata[i].amount = parseFloat($scope.mothwisedata[i].amount) + parseFloat($scope.mothwisedata[i - 1].amount);
            }
            $scope.mothwisedata[$scope.mothwisedata.length - 1].amount = parseFloat($scope.mothwisedata[$scope.mothwisedata.length - 1].amount).toFixed(2);
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        };
        $http.post(domain + api + 'report/gl/monthwise/', data, config).
        then(success, error);
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
            $rootScope.fromdate = year + '-' + '04' + '-' + '01';
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
        $scope.getallcontrolandledgerData();
    }
    $scope.totalyeardatashow = function() {
        var date = $filter('date')(new Date(), 'yyyy-MM-dd');
        var completedate = (date).split('-');
        var year = completedate[0];
        $rootScope.fromdate1 = year + '-' + '04' + '-' + '01';
        $rootScope.startdate1 = year + '-' + '04' + '-' + '01';
        $rootScope.today1 = $filter('date')(new Date(), 'yyyy-MM-dd');
        $rootScope.datescalculation();
    }
    $scope.totalyeardatashow();
    $scope.datesplitandconvertmonth = function(months, i) {
        var str = months.split('-');
        var mon = parseInt(str[0]);
        var numberofdays = new Date(str[1], str[0], 0).getDate();
        $scope.realdata[i].numberofdays = new Date(str[1], str[0], 0).getDate();
        $scope.realdata[i].monthyear = str[1] + '-' + str[0];
        switch (mon) {
            case 1:
                return "January " + str[1];
            case 2:
                return "February " + str[1];
            case 3:
                return "March " + str[1];
            case 4:
                return "April " + str[1];
            case 5:
                return "May " + str[1];
            case 6:
                return "June " + str[1];
            case 7:
                return "July " + str[1];
            case 8:
                return "August " + str[1];
            case 9:
                return "September " + str[1];
            case 10:
                return "October " + str[1];
            case 11:
                return "November " + str[1];
            case 12:
                return "December " + str[1];
            default:
                return;
        }
    }
    $scope.calculateMonthsCreditDebit = function(monthsdata) {
        var mainarray = [];
        var keys = Object.keys(monthsdata);
        for (var i = 0; i < keys.length; i++) {
            for (var j = 0; j < monthsdata[keys[i]].length; j++) {
                var obj = {};
                var type;
                if (monthsdata[keys[i]][j].type !== "OB") {
                    if (monthsdata[keys[i]].length > 1 && j === 0) {
                        type = monthsdata[keys[i]][0].type;
                        continue;
                    }
                    type = monthsdata[keys[i]][0].type;
                    var cr, dr, amount;
                    if (type === "Dr") {
                        dr = monthsdata[keys[i]][0].amount;
                        cr = 0;
                    } else {
                        cr = monthsdata[keys[i]][0].amount;
                        dr = 0;
                    }

                    if (monthsdata[keys[i]].length > 1 && cr === 0) {
                        cr = monthsdata[keys[i]][j].amount;
                    } else if (monthsdata[keys[i]].length > 1 && dr === 0) {
                        dr = monthsdata[keys[i]][j].amount;
                    }
                    amount = dr + (cr);
                    obj.mth = monthsdata[keys[i]][j].mth;
                    obj.amount = parseFloat(amount).toFixed(2);
                    obj.amount = obj.amount;
                    obj.numberofdays = monthsdata[keys[i]][j].numberofdays;
                    obj.monthyear = monthsdata[keys[i]][j].monthyear;
                    obj.monthName = monthsdata[keys[i]][j].monthName;
                    mainarray.push(obj);
                } else {
                    var obj = {};
                    obj.type = "OB";
                    obj.amount = monthsdata[keys[i]][j].amount;
                    mainarray.push(obj);
                }
            }

        }
        return mainarray;
    }
    $scope.monthSelection = function(monthName, numberofdays, monthyear) {
        $scope.passparameters.monthName = monthName;
        $scope.passparameters.numberofdays = numberofdays;
        $scope.passparameters.monthyear = monthyear;
        if ($rootScope.ledger_ltype === 'S') {
            $scope.props = {};
            $scope.props = dataMove.getcontrolledgerData();
        } else if ($rootScope.ledger_ltype == 'C' || $rootScope.ledger_ltype == 'B' || $rootScope.ledger_ltype == 'L') {
            $scope.props = {};
            $scope.props = dataMove.getledgerData();
        }
        $scope.passparameters.ltype_name = $scope.props.ltype_name;
        $scope.passparameters.ltype_amt = $scope.props.ltype_amt;
        $scope.passparameters.ledger_ltype = $scope.props.ledger_ltype;
        $scope.passparameters.ledger_id = $scope.props.gl_id;
        $scope.passparameters.sl_id = $scope.props.sl_id;
        $scope.passparameters.ledger_id = $scope.props.ledger_id;
        $scope.passparameters.ledger_name = $scope.props.ledger_name;
        $scope.passparameters.monthwise = true;

        dataMove.setmonthwiseData($scope.passparameters);
        $state.go("voucher");
        localStorageService.set("ledger_ltype", $scope.props.ledger_ltype)
        $rootScope.ledger_ltype = $scope.props.ledger_ltype;

        $rootScope.fromdate1 = monthyear + '-' + '01';
        $rootScope.today1 = monthyear + '-' + numberofdays;

    }
    var sortByMonth = function(arr) {
        var months = ["April", "May", "June",
            "July", "August", "September", "October", "November", "December", "January", "February", "March"
        ];
        arr.sort(function(a, b) {
            return months.indexOf(a.monthName) -
                months.indexOf(b.monthName);
        });
    }
    $scope.addPreviousMonthBalncetoCurrent = function() {


    }
});