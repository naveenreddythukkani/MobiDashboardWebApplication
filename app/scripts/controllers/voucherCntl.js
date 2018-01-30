var QTable = angular.module('mobiDashBoardApp');
QTable.controller('voucherCntl', function($scope, $state, $rootScope, $stateParams, $http, domain, api, $timeout, core, localStorageService, NgTableParams, dataMove, session, $filter, mobileWidth) {

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
    $rootScope.downloadstab = false;

    $scope.passparameters = {};
    $rootScope.grouplevel = true;
    $rootScope.subgrouplevel = true;
    $rootScope.ledgerlevel = true;
    $rootScope.controlledger = true;
    $rootScope.voucherstab = false;
    $rootScope.dateremove = false;
    $rootScope.voucherControl = true;
    $rootScope.moreIconShow = true;
    $rootScope.mobilebreadcurmbs = true;

    $scope.ltype_amt = "";
    var screenwidth = $(window).width();
    if (screenwidth > mobileWidth) {
        $rootScope.showheader = true;
        $rootScope.mobileheader = false;
    } else {
        $rootScope.showheader = false;
        $rootScope.mobileheader = true;
    }
    $rootScope.screenName = $rootScope.balnc;
    if ($rootScope.isSearched) {
        $('#mainpageContollerStart').addClass('balancesheetheader');
        $('#mainpageContollerStart').removeClass('balancesheetheadermove');
    } else {
        $('#mainpageContollerStart').addClass('balancesheetheadermove');
    }
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
        $rootScope.getlocalstoredata();
    }
    $scope.clearlocalstorage();
    $scope.vocherdetailsPageNavigation = function(vocherid, tx_type) {
        $scope.passparameters.vocher_id = vocherid;
        $scope.passparameters.tx_type = tx_type;
        $scope.passparameters.voucher = true;
        if ($rootScope.isSearched) {
            dataMove.setsearchvoucherData($scope.passparameters);
        } else {
            dataMove.setvoucherData($scope.passparameters);
        }
        $state.go("voucherdetails");
    };
    /* ltype='L' */
    $scope.getallltypevochers = function() {
        if ($scope.props === null || Object.keys($scope.props).length === 0) {
            $state.go("location");
            return;
        }
        $scope.ledgerAllLocationsStatus = false;
        $scope.ledgerIndividualLocationStatus = false;
        if ($rootScope.location_id == undefined || $rootScope.location_id == "All Locations") {
            $scope.ledgerAllLocationsStatus = true;
            var data = { 'fromdate': $rootScope.fromdate, 'todate': $rootScope.today, 'gl_id': $scope.props.ledger_id, 'startdate': $rootScope.startdate };
            console.log("Data = " + JSON.stringify(data));
            $scope.loading = true;
            var success = function(result) {
                $scope.loading = false;
                if (result.data.length === 0) {
                    session.sessionexpried("No Data");
                }
                if (result.data.error === undefined) {
                    console.log(JSON.stringify(result));
                    $scope.obalance = result.data.obdata;
                    var voucher_data = result.data.obdata;
                    console.log(JSON.stringify(voucher_data));
                    console.log(voucher_data.length);
                    $scope.voucherdetails = [];
                    for (var i = 0; i < voucher_data.length; i++) {
                        $scope.voucherdetails.push(voucher_data[i]);
                    }
                    console.log(JSON.stringify($scope.voucherdetails));
                    for (var j = 0; j < $scope.voucherdetails.length; j++) {
                        var dataset = $scope.voucherdetails[j].data;
                        var totalAmt = 0;
                        for (var k = 0; k < dataset.length; k++) {
                            if (dataset.isverified) {
                                totalAmt = totalAmt + dataset[k].amount;
                            }
                        }
                        if ($scope.voucherdetails[j].ob_amount == null) {
                            $scope.voucherdetails[j].ob_amount = 0;
                        }
                        if ($scope.voucherdetails[j].ob_amount == 0 && dataset.length == 0) {
                            $scope.voucherdetails.splice(j, 1);
                            j--;
                            continue;
                        }
                        totalAmt += $scope.voucherdetails[j].ob_amount;
                        $scope.voucherdetails[j].totalAmount = totalAmt.toFixed(2);
                        console.log('totalAmt == ' + totalAmt);
                    }
                    var amount = 0.0;
                    for (var i = 0; i < $scope.voucherdetails.length; i++) {
                        amount = amount + parseFloat($scope.voucherdetails[i].totalAmount);
                    }
                    $scope.ledger_amt = parseFloat(amount).toFixed(2);
                    console.log(JSON.stringify($scope.voucherdetails));
                } else {
                    $scope.msg = result.data.error.message;
                    $scope.addremovealert();
                }
            }
            var error = function(data) {
                $scope.loading = false;
                session.sessionexpried(result.status);
            }
            $http.post(domain + api + "report/generalledger/alllocation/", data, config).
            then(success, error);
        } else {
            $scope.ledgerIndividualLocationStatus = true;
            var data = { 'fromdate': $rootScope.fromdate, 'todate': $rootScope.today, 'gl_id': $scope.props.ledger_id, 'loc_id': $rootScope.location_id, 'startdate': $rootScope.startdate };
            console.log("Data = " + JSON.stringify(data));
            $scope.loading = true;
            var success = function(result) {
                $scope.loading = false;
                if (result.data.length === 0) {
                    session.sessionexpried("No Data");
                }
                if (result.data.error === undefined) {
                    $scope.obalance = result.data;
                    var voucher_data = result.data;
                    $scope.voucherdetails = [];
                    for (var i = 0; i < voucher_data.data.length; i++) {
                        $scope.voucherdetails.push(voucher_data.data[i]);
                    }
                    console.log(JSON.stringify($scope.voucherdetails));
                    var total = 0;
                    for (var i = 0; i < $scope.voucherdetails.length; i++) {
                        if ($scope.voucherdetails[i].isverified === 1)
                            total += $scope.voucherdetails[i].amount;
                    }
                    console.log(JSON.stringify(result.data.ob_amt));
                    if (result.data.ob_amt == null) {
                        console.log("Called");
                        result.data.ob_amt = 0;
                    }
                    if (result.data.ob_amt == 0) {
                        $scope.vouchershowindividualstatus = true;
                    }
                    if (voucher_data.length == 0 && result.data.ob_amt == 0) {
                        // $cordovaToast.show("No data found", "long", "bottom").then(function(success) {
                        //     console.log("The toast was shown");
                        // }, function(error) {
                        //     console.log("The toast was not shown due to " + error);
                        // });
                    }
                    $scope.balanceamount = 0.0;
                    $scope.balanceamount = parseFloat(result.data.ob_amt) + parseFloat(total);
                    $scope.ledger_amt = $scope.balanceamount.toFixed(2);
                } else {
                    $scope.msg = result.data.error.message;
                    $scope.addremovealert();
                }
            }
            var error = function(result) {
                $scope.loading = false;
                session.sessionexpried(result.status);
            }
            $http.post(domain + api + "report/generalledger/", data, config).
            then(success, error);
        }

    }

    /* ltype='C' or ltype='B' */
    $scope.getallCandBtypevoucher = function() {
        if ($scope.props === null || Object.keys($scope.props).length === 0) {
            $state.go("location");
            return;
        }
        $scope.corbltypeAllLocationsStatus = false;
        $scope.corbltypeIndividualLocationStatus = false;
        if ($rootScope.location_id == undefined || $rootScope.location_id == "All Locations") {
            $scope.corbltypeAllLocationsStatus = true;
            var data = { 'fromdate': $rootScope.fromdate, 'todate': $rootScope.today, 'gl_id': $scope.props.ledger_id, 'startdate': $rootScope.startdate };
            $scope.loading = true;
            var success = function(result) {
                $scope.loading = false;
                if (result.data.length === 0) {
                    session.sessionexpried("No Data");
                }
                if (result.data.error === undefined) {
                    console.log(JSON.stringify(result.data));
                    $scope.obalance = result.data.obdata;
                    var voucher_data = result.data.obdata;
                    console.log(JSON.stringify(voucher_data));
                    console.log(voucher_data.length);
                    $scope.voucherdetails = [];
                    for (var i = 0; i < voucher_data.length; i++) {
                        $scope.voucherdetails.push(voucher_data[i]);
                    }
                    console.log(JSON.stringify($scope.voucherdetails));
                    for (var j = 0; j < $scope.voucherdetails.length; j++) {
                        var dataset = $scope.voucherdetails[j].data;
                        var totalAmt = 0;
                        for (var k = 0; k < dataset.length; k++) {
                            if (dataset.isverified === 1) {
                                totalAmt = totalAmt + dataset[k].amount;
                            }
                        }
                        if ($scope.voucherdetails[j].ob_amount == null) {
                            $scope.voucherdetails[j].ob_amount = 0;
                        }
                        if ($scope.voucherdetails[j].ob_amount == 0 && dataset.length == 0) {
                            $scope.voucherdetails.splice(j, 1);
                            j--;
                            continue;
                        }
                        totalAmt += $scope.voucherdetails[j].ob_amount;
                        $scope.voucherdetails[j].totalAmount = totalAmt.toFixed(2);
                        console.log('totalAmt == ' + totalAmt);
                    }
                    var amount = 0.0;
                    for (var i = 0; i < $scope.voucherdetails.length; i++) {
                        amount = amount + parseFloat($scope.voucherdetails[i].totalAmount);
                    }
                    $scope.ledger_amt = parseFloat(amount).toFixed(2);
                    console.log(JSON.stringify($scope.voucherdetails));
                } else {
                    $scope.msg = result.data.error.message;
                    $scope.addremovealert();
                }
            }
            var error = function(result) {
                $scope.loading = false;
                session.sessionexpried(result.status);
            };
            $http.post(domain + api + "report/generalledger/alllocation/", data, config).
            then(success, error);

        } else {
            $scope.corbltypeIndividualLocationStatus = true;
            var data = { 'fromdate': $rootScope.fromdate, 'todate': $rootScope.today, 'gl_id': $scope.props.ledger_id, 'loc_id': $rootScope.location_id, 'startdate': $rootScope.startdate };
            var url = '/act/api/report/daybook/daterange/';
            console.log("Data = " + JSON.stringify(data));
            $scope.loading = true;
            var success = function(result) {
                $scope.loading = false;
                if (result.data.length === 0) {
                    session.sessionexpried("No Data");
                }
                if (result.data.error === undefined) {
                    $scope.obalance = result.data;
                    var voucher_data = result.data;
                    $scope.voucherdetails = [];
                    for (var i = 0; i < voucher_data.data.length; i++) {
                        $scope.voucherdetails.push(voucher_data.data[i]);
                    }
                    console.log(JSON.stringify($scope.voucherdetails));
                    var total = 0;
                    for (var i = 0; i < $scope.voucherdetails.length; i++) {
                        if ($scope.voucherdetails[i].isverified === 1)
                            total += $scope.voucherdetails[i].amount;
                    }
                    console.log(JSON.stringify(result.data.ob_amt));
                    if (result.data.ob_amt == null) {
                        console.log("Called");
                        data.ob_amt = 0;
                    }
                    if (result.data.ob_amt == 0) {
                        $scope.vouchershowindividualstatus = true;
                    }
                    if (voucher_data.data.length == 0 && result.data.ob_amt == 0) {
                        // $cordovaToast.show("No data found", "long", "bottom").then(function(success) {
                        //     console.log("The toast was shown");
                        // }, function(error) {
                        //     console.log("The toast was not shown due to " + error);
                        // });
                    }
                    $scope.balanceamount = parseFloat(result.data.ob_amt) + parseFloat(total);
                    $scope.ledger_amt = $scope.balanceamount.toFixed(2);
                } else {
                    $scope.msg = result.data.error.message;
                    $scope.addremovealert();
                }
            }
            var error = function(result) {
                $scope.loading = false;
                session.sessionexpried(result.status);
            };
            $http.post(domain + api + "report/daybook/daterange/", data, config).
            then(success, error);
        }
    }



    // voucher type is 'S'

    $scope.getallglwisesubledger = function() {
        if ($scope.props === null || Object.keys($scope.props).length === 0) {
            $state.go("location");
            return;
        }
        if ($rootScope.location_id == undefined || $rootScope.location_id == "All Locations") { // 'gl_id': $scope.props.ledger_id,
            var data = { 'fromdate': $rootScope.fromdate, 'todate': $rootScope.today, 'startdate': $rootScope.startdate, 'sl_id': $scope.props.sl_id };
        } else {
            var data = { 'fromdate': $rootScope.fromdate, 'todate': $rootScope.today, 'loc_id': $rootScope.location_id, 'startdate': $rootScope.startdate, 'sl_id': $scope.props.sl_id };
        }
        console.log("Data = " + JSON.stringify(data));
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            if (result.data.length === 0) {
                session.sessionexpried("No Data");
            }
            if (result.data.error === undefined) {
                console.log("date in obdata" + JSON.stringify(result.data));
                $scope.obalance = result.data.obdata;
                var voucher_data = result.data.obdata;
                $scope.voucherdetails = [];
                for (var i = 0; i < voucher_data.length; i++) {
                    $scope.voucherdetails.push(voucher_data[i]);
                }
                for (var j = 0; j < $scope.voucherdetails.length; j++) {
                    var dataset = $scope.voucherdetails[j].data;
                    var totalAmt = 0;
                    for (var k = 0; k < dataset.length; k++) {
                        if (dataset.isverified) {
                            totalAmt = totalAmt + dataset[k].amount;
                        }
                    }
                    if ($scope.voucherdetails[j].ob_amount == null) {
                        $scope.voucherdetails[j].ob_amount = 0;
                    }
                    if ($scope.voucherdetails[j].ob_amount == 0 && dataset.length == 0) {
                        $scope.voucherdetails.splice(j, 1);
                        j--;
                        continue;
                    }
                    totalAmt += $scope.voucherdetails[j].ob_amount;
                    $scope.voucherdetails[j].totalAmount = totalAmt.toFixed(2);
                }
                var amount = 0.0;
                for (var i = 0; i < $scope.voucherdetails.length; i++) {
                    amount = amount + parseFloat($scope.voucherdetails[i].totalAmount);
                }
                $scope.ltype_amt = parseFloat(amount).toFixed(2);
            } else {
                $scope.msg = result.data.error.message;
                $scope.addremovealert();
            }
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        };
        $http.post(domain + api + 'report/glwisesubledger/', data, config).
        then(success, error);
    }

    $scope.getallcontrolandledgerData = function() {
        if ($rootScope.isSearched) {
            if ($rootScope.ledger_ltype === 'S') {
                $scope.props = {};
                $scope.props = dataMove.getsearchcontrolledgerData();
                $scope.getallglwisesubledger();
            } else if ($rootScope.ledger_ltype == 'C' || $rootScope.ledger_ltype == 'B') {
                $scope.props = {};
                $scope.props = dataMove.getsearchledgerData();
                $scope.getallCandBtypevoucher();
            } else if ($rootScope.ledger_ltype == 'L') {
                $scope.props = {};
                $scope.props = dataMove.getsearchledgerData();
                $scope.getallltypevochers();
            }
        } else {
            if ($rootScope.ledger_ltype === 'S') {
                $scope.props = {};
                $scope.props = dataMove.getcontrolledgerData();
                $scope.getallglwisesubledger();
            } else if ($rootScope.ledger_ltype == 'C' || $rootScope.ledger_ltype == 'B') {
                $scope.props = {};
                $scope.props = dataMove.getledgerData();
                $scope.getallCandBtypevoucher();
            } else if ($rootScope.ledger_ltype == 'L') {
                $scope.props = {};
                $scope.props = dataMove.getledgerData();
                $scope.getallltypevochers();
            }
        }
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
            if (month === "01" || month === "02" || month === "03") {
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
        $scope.getallcontrolandledgerData();
    }
    $rootScope.datescalculation();
});