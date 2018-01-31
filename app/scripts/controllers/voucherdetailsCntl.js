var QTable = angular.module('mobiDashBoardApp');
QTable.controller('voucherdetailsCntl', function($scope, $state, $rootScope, $stateParams, $http, domain, api, $timeout, core, localStorageService, NgTableParams, dataMove, session, $filter, mobileWidth) {

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
    $rootScope.voucherstab = false;
    $rootScope.controlledger = true;

    $rootScope.dateremove = true;
    $rootScope.voucherControl = true;
    $rootScope.moreIconShow = true;
    $rootScope.mobilebreadcurmbs = true;


    $scope.thumbnaildownloadImages = domain + api + "thumbdownload/";
    $scope.downloadImages = domain + api + "downloadimage/";
    $scope.downloadaudio = domain + api + "downloadaudio/";
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
    $rootScope.getlocalstoredata();
    $scope.showglandsldata = function(glinedata) {
        if ((glinedata.sl_name !== undefined && glinedata.sl_name !== null) && (glinedata.gl_name !== null && glinedata.gl_name !== undefined)) {
            return glinedata.sl_name + "/" + glinedata.gl_name;
        } else if (glinedata.sl_name !== undefined && glinedata.sl_name !== null) {
            return glinedata.sl_name;
        } else {
            return glinedata.gl_name;
        }
    }
    $scope.showsnameandglname = function(vocherdetailsdata) {
        if (vocherdetailsdata !== undefined) {
            if ((vocherdetailsdata.s_name !== undefined && vocherdetailsdata.s_name !== null) && (vocherdetailsdata.gl_name !== null && vocherdetailsdata.gl_name !== undefined)) {
                return vocherdetailsdata.s_name + "/" + vocherdetailsdata.gl_name;
            } else if (vocherdetailsdata.s_name !== undefined && vocherdetailsdata.s_name !== null) {
                return vocherdetailsdata.s_name;
            } else {
                return vocherdetailsdata.gl_name;
            }
        }
        return "";
    }
    $scope.addremovealert = function() {
            $("#success-alert").addClass('in');
            $("#success-alert").fadeTo(2000, 500).slideUp(500, function() {
                $("#success-alert").removeClass('in');
            });
        }
        // getting all data for vocher details
    $scope.getallvoucherdetails = function() {
        if ($scope.props === null || Object.keys($scope.props).length === 0) {
            $state.go("location");
            return;
        }
        var data = { "v_id": $scope.props.vocher_id };
        $scope.loading = true;
        var success = function(result) {
            if (result.data.length === 0) {
                session.sessionexpried("No Data");
            }
            console.log("date in obdata" + JSON.stringify(result.data));
            $scope.loading = false;
            if (result.data.error === undefined) {
                $scope.vocherdetailsdata = result.data;
                var totalAmt = 0;
                for (var k = 0; k < $scope.vocherdetailsdata.GLines.length; k++) {
                    totalAmt = totalAmt + $scope.vocherdetailsdata.GLines[k].amount;
                }
                $scope.vocherdetailsdata.totalAmount = totalAmt.toFixed(2);
                $scope.images = [];
                if (result.data.attachments !== undefined) {
                    for (var i = 0; i < result.data.attachments.length; i++) {
                        if (result.data.attachments[i].type === "image" || result.data.attachments[i].type === "signature" || result.data.attachments[i].type === "voice" || result.data.attachments[i].type === "file") {
                            $scope.images.push(result.data.attachments[i]);
                        }
                    }
                }
                $('#tslshow').width($scope.images.length * 100 + 100);
            } else {
                $scope.msg = result.data.error.message;
                $scope.addremovealert();
            }
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        };
        $http.post(domain + api + 'voucher/detail/', data, config).
        then(success, error);

    }
    $scope.getallgroupdate = function() {
        $scope.props = {};
        if ($rootScope.isSearched) {
            $scope.props = dataMove.getsearchvoucherData();
        } else {
            $scope.props = dataMove.getvoucherData();
        }
        $scope.getallvoucherdetails();
    }
    $scope.getallgroupdate();
    $scope.findingtranstype = function(trns_type) {
        if (trns_type === "CR") {
            return "CASH RECEIPT";
        } else if (trns_type === "CP") {
            return "CASH PAYMENT";
        } else if (trns_type === "BR") {
            return "BANK RECEIPT";
        } else if (trns_type === "BP") {
            return "BANK PAYMENT";
        } else if (trns_type === "PV") {
            return "PURCHASE";
        } else if (trns_type === "SV") {
            return "SALE";
        } else if (trns_type === "JV") {
            return "JOURNAL";
        } else if (trns_type === "CO") {
            return "CONTRA";
        } else if (trns_type === "IV") {
            return "INVOICE";
        } else if (trns_type === "SR") {
            return "STORE RECEIPT";
        } else if (trns_type === "SC") {
            return "Invoice";
        } else if (trns_type === "SI") {
            return "STORE ISSUE";
        } else if (trns_type === "TI") {
            return "TRANSFER IN";
        } else if (trns_type === "TO") {
            return "TRANSFER OUT";
        } else if (trns_type === "OB") {
            return "OPENING BALANCE";
        } else if (trns_type === "IR") {
            return "ISSUE RETURN";
        } else if (trns_type === "RR") {
            return "RECEIPT RETURN";
        }

    };

    // caurosul functionality

    var view = $("#tslshow");
    var move = "100px";
    console.log("tslshowwidth", $('#tslshow').width());
    var sliderLimit = -($('#tslshow').width() - (100));
    console.log(sliderLimit);
    $("#rightArrow").click(function() {
        var currentPosition = parseInt(view.css("left"));
        console.log("rightClick" + currentPosition);
        if (currentPosition >= sliderLimit)
            view.stop(false, true).animate({ left: "-=" + move }, { duration: 400 });
    });
    $("#leftArrow").click(function() {
        var currentPosition = parseInt(view.css("left"));
        console.log("leftClick" + currentPosition);
        if (currentPosition < 0)
            view.stop(false, true).animate({ left: "+=" + move }, { duration: 400 });

    });

    $scope.imagePreview = function(imageid, type, name) {
        if (type === "image" || type === "signature") {
            $scope.downloadurl = "";
            $(document).ready(function() {
                $('#imagePreview').modal('show');
            });
            $scope.downloadurl = $scope.downloadImages + imageid;
        } else if (type === "voice") {
            $scope.downloadurlforaudio = $scope.downloadaudio + name;
            var test = $('#voucheraudio');
            test[0].load();
            $(document).ready(function() {
                $('#audioplay').modal('show');
            });
        } else if (type === "file") {
            $scope.downloadurl = "";
            var ext = name.split('.');
            $scope.downloadurl = $scope.downloadImages + imageid;
            if (ext[ext.length - 1] === "xlsx") {
                $(document).ready(function() {
                    $('#fileshow').body("");
                    $('#fileshow').modal({ remote: $scope.downloadurl });
                });
            } else if (ext[ext.length - 1] === "docx") {
                $(document).ready(function() {
                    $('#fileshow').body("");
                    $('#fileshow').modal({ remote: $scope.downloadurl });
                });
            } else {
                $(document).ready(function() {
                    $('#fileshow').modal('show');
                });
            }
        }
    };
    $scope.filetypefinding = function(name) {
        var ext = name.split('.');
        if (ext[ext.length - 1] === "pdf") {
            return "images/pdf.png";
        } else if (ext[ext.length - 1] === "txt") {
            return "images/text.png";
        } else if (ext[ext.length - 1] === "xlsx") {
            return "images/xlsx.png";
        } else if (ext[ext.length - 1] === "docx") {
            return "images/docx.png";
        } else if (ext[ext.length - 1] === "aac") {
            return "images/voice.png";
        }
    }
    $('.modalbody').on('hidden.bs.modal', '.modal', function() {
        $(this).removeData('bs.modal');
    });
    $scope.cancelaudioForm = function() {
        var test = $('#voucheraudio');
        test[0].pause();
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
            $rootScope.fromdate = year + '-' + '04' + '-' + day;
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
        if (!$rootScope.isSearched) {
            $rootScope.fromdate = localStorageService.get('monthwisefromdate');
            $rootScope.today = localStorageService.get('monthwisetoday');
        }
    }
    $rootScope.datescalculation();
});