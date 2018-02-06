var QTable = angular.module('mobiDashBoardApp');
QTable.controller('headerCntl', function($scope, $state, $rootScope, $stateParams, $http, domain, api, $timeout, core, localStorageService, NgTableParams, dataMove, session, $filter, $window, mobileWidth) {

    $scope.logintabbottom = false;
    $scope.isPopOver = false;
    $rootScope.locat = {};
    $scope.balancesheetarry = ["Profit & Loss", "Balance sheet"]
    $rootScope.locationsListinheader = [];
    $scope.props = {};
    $scope.Object = Object;
    $scope.minimumDateSelect = new Date();
    $rootScope.findingpndlreport = function() {
        $rootScope.balnc = localStorageService.get("balnc")
        if ($rootScope.balnc === "Balance sheet") {
            $rootScope.pandlreport = false
        } else {
            $rootScope.pandlreport = true;
        }
    }
    $rootScope.findingpndlreport();
    $rootScope.getlocalstoredata = function() {
        console.log(dataMove.getgroupdata());
        console.log(dataMove.getsubgroupdata());
        console.log(dataMove.getledgerData());
        console.log(dataMove.getcontrolledgerData());
        console.log(dataMove.getmonthwiseData());
        console.log(dataMove.getvoucherData());

        $scope.groupData = dataMove.getgroupdata();
        $scope.subgroupData = dataMove.getsubgroupdata();
        $scope.ledgerData = dataMove.getledgerData();
        $scope.controlledgerData = dataMove.getcontrolledgerData();
        $scope.monthwiseData = dataMove.getmonthwiseData()
        $scope.voucherData = dataMove.getvoucherData();

        $rootScope.groupData = dataMove.getgroupdata();
        $rootScope.subgroupData = dataMove.getsubgroupdata();
        $rootScope.ledgerData = dataMove.getledgerData();
        $rootScope.controlledgerData = dataMove.getcontrolledgerData();
        $rootScope.monthwiseData = dataMove.getmonthwiseData()
        $rootScope.voucherData = dataMove.getvoucherData();

    }
    var config = {
        headers: {
            "X-CSRFToken": $rootScope.csrftoken,
            "Cookie": "csrftoken=" + $rootScope.csrftoken + '; ' + "sessionid=" + $rootScope.session_key
        }
    };
    $rootScope.headerheight = $('#bredcrumbelement').height();
    $rootScope.headerheight += 25;
    $(document).ready(function() {
        $('#datetimepickerdashboardfrom').datetimepicker({
            format: 'DD-MM-YYYY'
        });
    });
    $(document).ready(function() {
        $('#datetimepickerdashboardto').datetimepicker({
            format: 'DD-MM-YYYY'
        });
    });
    $(document).ready(function() {
        $('#datetimepickervoucherfrom').datetimepicker({
            format: 'DD-MM-YYYY'
        });
    });
    $(document).ready(function() {
        $('#datetimepickervoucherto').datetimepicker({
            format: 'DD-MM-YYYY'
        });
    });
    $('#savefordashboard').on('click', function() {
        $rootScope.today1 = moment($('#todatedashboard').val(), "DD-MM-YYYY").format("YYYY-MM-DD");
        if ($rootScope.pandlreport === true) {
            $rootScope.startdate1 = moment($('#fromdatedashboard').val(), "DD-MM-YYYY").format("YYYY-MM-DD");
        }
        $('#selectdatedahboard').modal('hide');
        $rootScope.datescalculation();
    });
    $('#saveforvoucher').on('click', function() {
        $rootScope.fromdate1 = moment($('#fromdateidvoucher').val(), "DD-MM-YYYY").format("YYYY-MM-DD");
        $rootScope.today1 = moment($('#todateidvoucher').val(), "DD-MM-YYYY").format("YYYY-MM-DD");
        localStorageService.set('monthwisefromdate', $rootScope.fromdate1);
        localStorageService.set('monthwisetoday', $rootScope.today1);
        $rootScope.datescalculation();
        $('#saveforvoucher').modal('hide');
    });
    $scope.addremovealert = function() {
        $("#success-alert").addClass('in');
        $("#success-alert").fadeTo(2000, 500).slideUp(500, function() {
            $("#success-alert").removeClass('in');
        });
    }
    $rootScope.getalllocationinheader = function() {
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            $rootScope.locationsListinheader = result.data;
            localStorageService.set("locations", $rootScope.locationsListinheader);
        }
        var error = function(result) {
            $scope.loading = false;
        }
        if ($rootScope.mobile) {
            $http.get(domain + api + "location/compact/", config)
                .then(success, error);
        }

    }
    $rootScope.getalllocationinheader();
    $scope.clientLogout = function() {
        $scope.closeNav();
        $scope.popoverhide();
        $scope.loading = false;
        var success = function(result) {
            $scope.loading = true;
            if (result.data.error === undefined) {
                $state.go("login");
                localStorageService.clearAll();
            } else {
                $scope.msg = result.data.error.message;
            }
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + api + 'logout/')
            .then(success, error)
    }
    $scope.profilemouseover = function() {
        $scope.showuserdata = true;
    }
    $scope.profilemouseleave = function() {
        $scope.showuserdata = false;
    }
    $scope.gotoCompanyPage = function() {
        $state.go("company");
    }
    $rootScope.balancesheetValueChange = function(balnc) {
        localStorageService.set("balnc", balnc);
        if (balnc === "Profit & Loss") {
            $rootScope.pandlreport = true;
        } else {
            $rootScope.pandlreport = false;
        }
        $rootScope.balnc = balnc;
        if ($scope.groupData !== null && $scope.groupData.grouplevel === true) {
            $scope.removealllocalstorage();
            $state.go('balancesheet')
        } else {
            $rootScope.datescalculation();
        }
        $rootScope.getlocalstoredata();
    }
    $scope.locationValueChange = function(locat) {
        $rootScope.locat.display_name = locat.display_name;
        $rootScope.location_name = locat.display_name;
        $rootScope.location_id = locat.id;
        localStorageService.set("location_id", locat.id);
        localStorageService.set("location_name", locat.display_name);
        var screenwidth = $(window).width();
        if (screenwidth < mobileWidth) {
            $("#locationListInHeader").modal('hide');
            if ($state.current.name === "balancesheet") {
                $rootScope.datescalculation()
            } else {
                $state.go('balancesheet')
            }
            $scope.removealllocalstorage();
        } else {
            // if ($scope.groupData !== null && $scope.groupData.grouplevel === true) {
            //     $scope.removealllocalstorage();
            //     $state.go('balancesheet')
            // } else {
            //     $rootScope.datescalculation()
            // }
            $scope.locationchange();
        }
        $rootScope.getlocalstoredata();
    }
    $scope.subledgerchange = function() {
        if ($scope.subgroupData !== null && $scope.subgroupData.subgrouplevel === true) {
            localStorageService.remove("subgroupData");
            dataMove.setsubgroupdata({});

            localStorageService.remove("ledger");
            dataMove.setledgerData({})

            dataMove.getcontrolledgerData({});
            localStorageService.remove("controlledger");

            dataMove.setmonthwiseData({})
            localStorageService.remove("monthwise");


            dataMove.setvoucherData({});
            localStorageService.remove("voucherData");

            $state.go('subledgersgroup')
        }
    }
    $scope.subgroupchange = function() {
        if ($scope.ledgerData !== null && $scope.ledgerData.ledgerlevel === true) {
            localStorageService.remove("ledger");
            dataMove.setledgerData({})

            dataMove.getcontrolledgerData({});
            localStorageService.remove("controlledger");

            dataMove.setmonthwiseData({})
            localStorageService.remove("monthwise");

            dataMove.setvoucherData({});
            localStorageService.remove("voucherData");


            $state.go('ledger')
        }
    }
    $scope.ledgerchange = function() {
        if ($scope.controlledgerData !== null && $scope.controlledgerData.controlledger === true) {
            localStorageService.remove("controlledger");
            dataMove.getcontrolledgerData({});

            dataMove.setvoucherData({});
            localStorageService.remove("voucherData");

            dataMove.setmonthwiseData({})
            localStorageService.remove("monthwise");

            $state.go('controlledger')
        } else {
            dataMove.setvoucherData({});
            localStorageService.remove("voucherData");

            dataMove.setmonthwiseData({})
            localStorageService.remove("monthwise");

            $state.go('monthWise')
        }
    }
    $scope.monthWisechange = function() {
        if ($scope.monthwiseData !== null && $scope.monthwiseData.monthwise === true) {
            dataMove.setmonthwiseData({});
            localStorageService.remove("monthwise");
            $state.go('monthWise')
        }

    }
    $scope.vocherchange = function() {
        if ($scope.voucherData !== null && $scope.voucherData.voucher === true) {
            dataMove.setvoucherData({});
            localStorageService.remove("voucherData");
            $state.go('voucher')
        }
    }
    $scope.locationValueChangeforall = function() {
        $rootScope.locat.display_name = "All Locations";
        $rootScope.location_name = "All Locations";
        $rootScope.location_id = "All Locations";
        localStorageService.set("location_id", "All Locations");
        localStorageService.set("location_name", "All Locations");
        var screenwidth = $(window).width();
        if (screenwidth < mobileWidth) {
            $("#locationListInHeader").modal('hide');
            if ($state.current.name === "balancesheet") {
                $rootScope.datescalculation()
            } else {
                $state.go('balancesheet')
            }
            $scope.removealllocalstorage();
        } else {
            // if ($scope.groupData !== null && $scope.groupData.grouplevel === true) {
            //     $scope.removealllocalstorage();
            //     $state.go('balancesheet')
            // } else {
            //     $rootScope.datescalculation()
            // }
            $scope.locationchange();
        }
        $rootScope.getlocalstoredata();
    }
    $scope.locationchange = function() {
        if ($state.current.name === "balancesheet") {
            $rootScope.datescalculation()
        } else if ($state.current.name === "subledgersgroup") {
            $rootScope.datescalculation();
        } else if ($state.current.name === "ledger") {
            $rootScope.datescalculation();
        } else if ($state.current.name === "controlledger") {
            $rootScope.datescalculation();
        } else if ($state.current.name === "monthWise") {
            $rootScope.totalyeardatashow()
        } else if ($state.current.name === "voucher") {
            $rootScope.datescalculation();
        } else if ($state.current.name === "voucherdetails") {
            $scope.removealllocalstorage();
            $state.go('balancesheet')
        }
    }
    $scope.datemodelshow = function() {
        $('#selectdatedahboard').modal('show');
        $('#todatedashboard').val($filter('date')($rootScope.today, "dd-MM-yyyy"));
        if ($rootScope.pandlreport === true) {
            $('#fromdatedashboard').val($filter('date')($rootScope.startdate, "dd-MM-yyyy"));
        }
    }
    $scope.datemodelforfromandtodate = function() {
        $('#selectdatevoucher').modal('show');
        $('#fromdateidvoucher').val($filter('date')($rootScope.fromdate, "dd-MM-yyyy"));
        $('#todateidvoucher').val($filter('date')($rootScope.today, "dd-MM-yyyy"));
    }

    $scope.removealllocalstorage = function() {
        localStorageService.remove("groupData");
        dataMove.setgroupdata({});

        localStorageService.remove("subgroupData");
        dataMove.setsubgroupdata({});

        localStorageService.remove("ledger");
        dataMove.setledgerData({})

        dataMove.getcontrolledgerData({});
        localStorageService.remove("controlledger");

        dataMove.setmonthwiseData({})
        localStorageService.remove("monthWise");


        dataMove.setvoucherData({});
        localStorageService.remove("voucherData");

    }
    $scope.ledgersearch = function() {
        localStorageService.set('globalSearchData', "");
        $state.go('search');
    }
    $scope.backButtonAction = function() {
        if (!$rootScope.isSearched) {
            if ($state.current.name === "balancesheet") {
                $state.go('location');
            } else if ($state.current.name === "subledgersgroup") {
                $state.go('balancesheet');
            } else if ($state.current.name === "ledger") {
                $state.go('subledgersgroup');
            } else if ($state.current.name === "controlledger") {
                $state.go('ledger');
            } else if ($state.current.name === "monthWise") {
                if ($scope.controlledgerData) {
                    $state.go('controlledger');
                } else {
                    $state.go('ledger');
                }
            } else if ($state.current.name === "voucher") {
                $state.go('monthWise');
            } else if ($state.current.name === "voucherdetails") {
                $state.go('voucher');
            }
        } else {
            $window.history.back();
        }
    }
    $scope.openNav = function() {
        console.log($(window).width())
        document.getElementById("transparentView").style.width = '100%';
        document.getElementById("mySidenav").style.width = "55%";
    }

    $scope.closeNav = function() {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("transparentView").style.width = "0";
    }
    $scope.homeAction = function() {
        $scope.closeNav();
        if ($state.current.name === "company") {
            $state.transitionTo($state.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        } else {
            $state.go("company");
        }
    }
    $scope.usersPageAction = function() {
        $scope.closeNav();
        if ($state.current.name === "user") {
            $state.transitionTo($state.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        } else {
            $state.go("user");
        }
    }
    $scope.locationsPageAction = function() {
        $scope.closeNav();
        if ($state.current.name === "location") {
            $state.transitionTo($state.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        } else {
            $state.go("location");
        }
    }
    $scope.balanceSheetAction = function() {
        $scope.closeNav();
        $rootScope.balnc = "Balance sheet";
        localStorageService.set("balnc", $rootScope.balnc);
        $rootScope.findingpndlreport();
        $rootScope.location_name = "All Locations";
        $rootScope.location_id = "All Locations";
        localStorageService.set("location_id", "All Locations");
        localStorageService.set("location_name", "All Locations");
        if ($state.current.name === "balancesheet") {
            $state.transitionTo($state.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        } else {
            $state.go("balancesheet");
        }
    }
    $scope.profitAndLossAction = function() {
            $scope.closeNav();
            $rootScope.balnc = "Profit & Loss";
            localStorageService.set("balnc", $rootScope.balnc);
            $rootScope.location_name = "All Locations";
            $rootScope.location_id = "All Locations";
            localStorageService.set("location_id", "All Locations");
            localStorageService.set("location_name", "All Locations");
            $rootScope.findingpndlreport();
            if ($state.current.name === "balancesheet") {
                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            } else {
                $state.go("balancesheet");
            }
        }
        // popover hide and showerror
    $scope.popovershow = function() {
        document.getElementById("popOverTransparentView").style.width = '100%';
        document.getElementById("popOverView").style.width = "40%";
    }
    $scope.popoverhide = function() {
        document.getElementById("popOverTransparentView").style.width = '0';
        document.getElementById("popOverView").style.width = "0";
    }
    $scope.datemodelmobileshow = function() {
        $scope.popoverhide();
        $scope.vouCleared = false;
        $scope.mobCleared = false;
        //Destroy evry time and preparing model again for updating dates.
        if ($('#datetimepickermobilevoucherto').data("DateTimePicker")) {
            $scope.vouCleared = true
            $('#datetimepickermobilevoucherto').data("DateTimePicker").date($rootScope.today);
        }
        if ($('#datetimepickermobilevoucherfrom').data("DateTimePicker")) {
            $scope.vouCleared = true
            $('#datetimepickermobilevoucherfrom').data("DateTimePicker").date($rootScope.fromdate);
        }

        if ($('#datetimepickermobiledashboardto').data("DateTimePicker")) {
            $scope.mobCleared = true;
            $('#datetimepickermobiledashboardto').data("DateTimePicker").date($rootScope.today);
        }

        if ($('#datetimepickermobiledashboardfrom').data("DateTimePicker")) {
            $scope.mobCleared = true;
            $('#datetimepickermobiledashboardfrom').data("DateTimePicker").date($rootScope.startdate);
        }

        // $('#datetimepickermobiledashboardto').data("DateTimePicker").destroy();
        // $('#datetimepickermobiledashboardfrom').data("DateTimePicker").destroy();



        if ($rootScope.voucherControl) {
            $(".mFromDateTabVou").addClass("active");
            $(".mToDateTabVou").removeClass("active");
            $("#fromDateCalVou").show();
            $("#toDateCalVou").hide();
            var defaultFromDate = $rootScope.fromdate;
            var defaultToDate = $rootScope.today;
            console.log("voucherControl from", defaultFromDate);
            console.log("voucherControl to", defaultToDate);
            $('#datetimepickermobilevoucherto').datetimepicker({
                inline: true,
                format: 'YYYY-MM-DD',
                defaultDate: defaultToDate
            });
            $('#datetimepickermobilevoucherfrom').datetimepicker({
                inline: true,
                format: 'YYYY-MM-DD',
                defaultDate: defaultFromDate
            });
            $('#datetimepickermobilevoucherfrom').on('dp.change', function(e) {
                console.log("vouCleared", $scope.vouCleared);
                if (!$scope.vouCleared) {
                    $scope.minimumDateSelect = moment(e.date).format("YYYY-MM-DD");
                    // $(".mToDateTabVou").trigger('click');
                    $(".mFromDateTabVou").removeClass("active");
                    $(".mToDateTabVou").addClass("active");
                    $("#toDateCalVou").show();
                    $("#fromDateCalVou").hide();
                }
                $scope.vouCleared = false;
            });

            $('#selectmobiledatevoucher').modal('show');
        } else {
            if ($rootScope.pandlreport === true) {
                $(".mFromDateTab").addClass("active");
                $(".mToDateTab").removeClass("active");
                $("#fromDateCal").show();
                $("#toDateCal").hide();
                $(".mFromDateTab").show();
                $(".mToDateTab").show();
            } else {
                $(".mFromDateTab").removeClass("active");
                $(".mToDateTab").removeClass("active");
                $(".mFromDateTab").hide();
                $(".mToDateTab").hide();
                $("#fromDateCal").hide();
                $("#toDateCal").show();
            }
            var defaultFromDate = $rootScope.startdate;
            var defaultToDate = $rootScope.today;
            console.log("monthwise from", defaultFromDate);
            console.log("monthwise to", defaultToDate);

            $('#datetimepickermobiledashboardto').datetimepicker({
                inline: true,
                format: 'YYYY-MM-DD',
                defaultDate: defaultToDate
            });
            $('#datetimepickermobiledashboardfrom').datetimepicker({
                inline: true,
                format: 'YYYY-MM-DD',
                defaultDate: defaultFromDate
            });

            $('#datetimepickermobiledashboardfrom').on('dp.change', function(e) {
                if (!$scope.mobCleared) {
                    if ($rootScope.pandlreport === true) {
                        console.log('$s', $scope, $scope.$parent);
                        $scope.$parent.minimumDateSelect = moment(e.date).format("YYYY-MM-DD");
                        console.log('trigger')
                        $(".mToDateTab").show()
                        $(".mFromDateTab").removeClass("active");
                        $(".mToDateTab").addClass("active");
                        $("#toDateCal").show();
                        $("#fromDateCal").hide();
                        console.log("minDate", $scope.$parent.minimumDateSelect);
                    }
                }
                $scope.mobCleared = false;

            });

            $('#selectmobiledatedahboard').modal('show');

        }
    }

    $scope.$watch('minimumDateSelect', function(newValue, oldValue) {
        console.log('newValue', newValue, oldValue);
    });

    // $(document).off('click', '.mFromDateTab').on('click', '.mToDateTab',function(e) {
    //     $("#fromDateCal").show();
    //     $("#toDateCal").hide();
    // });

    $(document).off('click', '.mToDateTab').on('click', '.mToDateTab', function(e) {
        $(".mFromDateTab").removeClass("active");
        $(".mToDateTab").addClass("active");
        $("#toDateCal").show();
        $("#fromDateCal").hide();
        console.log("minDate", $scope.minimumDateSelect);
    });

    $(".mFromDateTab").on('click', function() {
        $("#fromDateCal").show();
        $("#toDateCal").hide();
        // $('#datetimepickermobiledashboardfrom').datetimepicker();
    });

    // $(".mToDateTab").on('click', function () {
    //     $(".mFromDateTab").removeClass("active");
    //     $(".mToDateTab").addClass("active");
    //     $("#toDateCal").show();
    //     $("#fromDateCal").hide();
    //     // console.log("minDate", $scope.minimumDateSelect);
    // });

    $(".mFromDateTabVou").on('click', function() {
        $("#fromDateCalVou").show();
        $("#toDateCalVou").hide();
        // $('#datetimepickermobilevoucherfrom').datetimepicker();
    });

    $(".mToDateTabVou").on('click', function() {
        $(".mFromDateTabVou").removeClass("active");
        $(".mToDateTabVou").addClass("active");
        $("#toDateCalVou").show();
        $("#fromDateCalVou").hide();
        // $('#datetimepickermobilevoucherto').datetimepicker();
    });

    $(document).ready(function() {
        // $('#datetimepickermobilevoucherto').datepicker("update", new Date());
        // $('#datetimepickermobilevoucherfrom').datepicker("update", new Date(new Date().getFullYear() - 1, 03, 01));

        // $('#datetimepickermobiledashboardto').datetimepicker({
        //     inline:true,
        //     format: 'YYYY-MM-DD'
        // });
        // $('#datetimepickermobiledashboardfrom').datetimepicker({
        //     inline:true,
        //     format: 'YYYY-MM-DD',
        //     defaultDate:defaultFromDate
        // });
        // $('#datetimepickermobilevoucherto').datetimepicker({
        //     inline:true,
        //     format: 'YYYY-MM-DD'
        // });
        // $('#datetimepickermobilevoucherfrom').datetimepicker({
        //     inline:true,
        //     format: 'YYYY-MM-DD',
        //     defaultDate:defaultFromDate
        // })

        // $('#datetimepickermobiledashboardfrom').on('dp.change',function(){
        //     $(".mToDateTab").trigger('click');
        // })

        //   $('#datetimepickermobiledashboardfrom').datepicker();
        //   $('#datetimepickermobiledashboardfrom').datepicker("setDate", new Date(new Date().getFullYear()-1,03,01));
    });
    //     $(document).ready(function () {
    //     $('#datetimepickermobiledashboardto').datepicker();
    //     $('#datetimepickermobiledashboardto').datepicker("setDate", new Date());
    //     });


    $('#saveformobiledashboard').unbind().on('click', function() {
        // $rootScope.today1 = moment($('#datetimepickermobiledashboardto').datetimepicker("getDate")).format("YYYY-MM-DD");
        // if ($rootScope.pandlreport === true) {
        // $rootScope.startdate1 =moment($('#datetimepickermobiledashboardfrom').datetimepicker("getDate")).format("YYYY-MM-DD");
        // }
        $rootScope.today1 = $('#datetimepickermobiledashboardto').data('date');
        if ($rootScope.pandlreport === true) {
            $rootScope.startdate1 = $('#datetimepickermobiledashboardfrom').data('date');
        }
        $('#selectmobiledatedahboard').modal('hide');
        $rootScope.datescalculation();
    });

    $('#saveformobilevoucher').unbind().on('click', function() {
        // $rootScope.today1 = moment($('#datetimepickermobilevoucherto').datetimepicker("getDate")).format("YYYY-MM-DD");
        // if ($rootScope.pandlreport === true) {
        //     $rootScope.startdate1 = moment($('#datetimepickermobilevoucherfrom').datetimepicker("getDate")).format("YYYY-MM-DD");
        // }
        $rootScope.today1 = $('#datetimepickermobilevoucherto').data('date');
        $rootScope.fromdate1 = $('#datetimepickermobilevoucherfrom').data('date');
        localStorageService.set('monthwisefromdate', $rootScope.fromdate1);
        localStorageService.set('monthwisetoday', $rootScope.today1);
        $('#selectmobiledatevoucher').modal('hide');
        $rootScope.datescalculation();
    });

    $rootScope.getalllocationinmobileheader = function() {
        $scope.loading = true;
        $scope.popoverhide();
        var success = function(result) {
            $scope.loading = false;
            $rootScope.locationsMobileListInHeader = result.data;
            $("#locationListInHeader").modal('show');
        }
        var error = function(result) {
            $scope.loading = false;
        }
        $http.get(domain + api + "location/compact/", config)
            .then(success, error);
    }
    $scope.searchAction = function() {
        localStorageService.set('globalSearchData', "");
        if ($state.current.name === "user") {
            $state.go('usersearch');
        } else {
            $state.go('search');
        }
    }
    $scope.balancesheetPopOverAction = function(text) {
        $scope.popoverhide();
        if (text === "balance") {
            $rootScope.pandlreport = false;
            $rootScope.balnc = "Balance sheet";
        } else {
            $rootScope.pandlreport = true;
            $rootScope.balnc = "Profit & Loss";
        }
        localStorageService.set("balnc", $rootScope.balnc);
        if ($state.current.name === "balancesheet") {
            $state.transitionTo($state.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        } else {
            $state.go("balancesheet");
        }
    }
    window.addEventListener('popstate', function(event) {


    });
});


/// locationCntl code

// $scope.getAllUsers = function(dropdownid) {
//     $scope.loading = true;
//     var success = function(result) {
//         $scope.loading = false;
//         $scope.usersList = result.data;
//         $timeout(function() {
//             $(document).ready(function() {
//                 $(dropdownid).multiselect({
//                     enableFiltering: true,
//                     includeSelectAllOption: true,
//                     includeSelectAllDivider: true,
//                     maxHeight: 250,
//                     nonSelectedText: 'Select User',
//                     filterPlaceholder: 'Search User...',
//                     allSelectedText: 'All Users',
//                     buttonWidth: '100%',
//                     dropUp: true,
//                     enableCaseInsensitiveFiltering: true,
//                     onSelectAll: function(checked) {
//                         if (checked) {
//                             $scope.users = [];
//                             for (var i = 0; i < $scope.usersList.length; i++) {
//                                 var idss = ($scope.usersList[i].user_id).toString()
//                                 $scope.users.push(idss);
//                             }
//                         } else {
//                             $scope.users = [];
//                         }
//                         console.log($scope.users)
//                     },
//                     onChange: function(option, checked, select) {
//                         if (checked) {
//                             var ids = option.val();
//                             for (var i = 0; i < $scope.usersList.length; i++) {
//                                 var idss = ($scope.usersList[i].user_id).toString()
//                                 if (idss === ids) {
//                                     $scope.users.push(idss);
//                                 }
//                             }
//                         } else {
//                             var ids = option.val();
//                             for (var i = 0; i < $scope.users.length; i++) {
//                                 if ($scope.users[i] === ids) {
//                                     $scope.users.splice(i, 1);
//                                 }
//                             }

//                         }
//                         console.log($scope.users);
//                     }

//                 });
//                 if (dropdownid === '#edituser-multiselctDropDown') {
//                     $(dropdownid).multiselect('select', $scope.users);
//                 }
//             });
//         }, 50);
//     }
//     var error = function(result) {
//         $scope.loading = false;
//         session.sessionexpried(result.status);
//     }
//     $http.get(domain + api + "user/", config)
//         .then(success, error);
// }
// $scope.gettingAllDaybooks = function(dropdownid) {
//     $scope.loading = true;
//     var success = function(result) {
//         $scope.loading = false;
//         $scope.daybookList = result.data;
//         $timeout(function() {
//             $(document).ready(function() {
//                 $(dropdownid).multiselect({
//                     enableFiltering: true,
//                     includeSelectAllOption: true,
//                     includeSelectAllDivider: true,
//                     maxHeight: 250,
//                     nonSelectedText: 'Select Daybook',
//                     filterPlaceholder: 'Search Daybook...',
//                     allSelectedText: 'All Daybooks',
//                     buttonWidth: '100%',
//                     dropUp: true,
//                     enableCaseInsensitiveFiltering: true,
//                     onSelectAll: function(checked) {
//                         if (checked) {
//                             $scope.daybooks = [];
//                             for (var i = 0; i < $scope.daybookList.length; i++) {
//                                 var idss = ($scope.daybookList[i].id).toString()
//                                 $scope.daybooks.push(idss);
//                             }
//                         } else {
//                             $scope.daybooks = [];
//                         }
//                         console.log($scope.daybooks)
//                     },
//                     onChange: function(option, checked, select) {
//                         if (checked) {
//                             var ids = option.val();
//                             for (var i = 0; i < $scope.daybookList.length; i++) {
//                                 var idss = ($scope.daybookList[i].id).toString()
//                                 if (idss === ids) {
//                                     $scope.daybooks.push(idss);
//                                 }
//                             }
//                         } else {
//                             var ids = option.val();
//                             for (var i = 0; i < $scope.daybooks.length; i++) {
//                                 if ($scope.daybooks[i] === ids) {
//                                     $scope.daybooks.splice(i, 1);
//                                 }
//                             }

//                         }
//                         console.log($scope.daybooks);
//                     },
//                     onDropdownHidden: function() {
//                         if (dropdownid === '#editdaybook-multiselctDropDown') {
//                             $scope.assigndaybookstoloaction();
//                         }
//                     }
//                 });
//                 if (dropdownid === '#editdaybook-multiselctDropDown') {
//                     $(dropdownid).multiselect('select', $scope.daybooks);
//                 }
//             });
//         }, 50);
//     }
//     var error = function(result) {
//         $scope.loading = false;
//         session.sessionexpried(result.status);
//     }
//     $http.get(domain + api + "generalledger/unassigned_daybook/", config)
//         .then(success, error);
// }

// $scope.gettingAllledgers = function(dropdownid) {
//     $scope.loading = true;
//     var success = function(result) {
//         $scope.loading = false;
//         // $scope.pushdata = {};
//         // for (var i = 0; i < result.data.length; i++) {
//         //     $scope.pushdata.display_name = result.data[i].display_name;
//         //     $scope.pushdata.name = result.data[i].name;
//         //     $scope.pushdata.id = result.data[i].id;
//         //     $scope.pushdata.ltype = result.data[i].ltype;
//         //     $scope.pushdata.name_id = result.data[i].id + "." + result.data[i].name;
//         //     $scope.ledgerList.push($scope.pushdata);
//         // }
//         $scope.ledgerList = result.data;
//         $timeout(function() {
//             $(document).ready(function() {
//                 $(dropdownid).multiselect({
//                     enableFiltering: true,
//                     includeSelectAllOption: true,
//                     includeSelectAllDivider: true,
//                     enableCaseInsensitiveFiltering: true,
//                     maxHeight: 250,
//                     nonSelectedText: 'Select ledger',
//                     filterPlaceholder: 'Search ledger...',
//                     allSelectedText: 'All ledgers',
//                     buttonWidth: '100%',
//                     dropUp: true,
//                     onSelectAll: function(checked) {
//                         if (checked) {
//                             $scope.ledgers = [];
//                             for (var i = 0; i < $scope.ledgerList.length; i++) {
//                                 var idss = ($scope.ledgerList[i].id).toString()
//                                 $scope.ledgers.push(idss);
//                             }
//                         } else {
//                             $scope.ledgers = [];
//                         }
//                         console.log($scope.ledgers)
//                     },
//                     onChange: function(option, checked, select) {
//                         if (checked) {
//                             var ids = option.val();
//                             for (var i = 0; i < $scope.ledgerList.length; i++) {
//                                 var idss = ($scope.ledgerList[i].id).toString()
//                                 if (idss === ids) {
//                                     $scope.ledgers.push(idss);
//                                 }
//                             }
//                         } else {
//                             var ids = option.val();
//                             for (var i = 0; i < $scope.ledgers.length; i++) {
//                                 if ($scope.ledgers[i] === ids) {
//                                     $scope.ledgers.splice(i, 1);
//                                 }
//                             }

//                         }
//                         console.log($scope.ledgers);
//                     },
//                     onDropdownHidden: function() {
//                         if (dropdownid === '#editledger-multiselctDropDown') {
//                             $scope.assignledgerstoloaction();
//                         }
//                     }
//                 });
//                 if (dropdownid === '#editledger-multiselctDropDown') {
//                     $(dropdownid).multiselect('select', $scope.ledgers);
//                 }
//             });
//         }, 50);
//     }
//     var error = function(result) {
//         $scope.loading = false;
//         session.sessionexpried(result.status);
//     }
//     $http.get(domain + api + "generalledger/ledger/", config)
//         .then(success, error);
// }


// $scope.getAllLoations = function(dropdownid) {
//     $scope.loading = true;
//     var success = function(result) {
//         $scope.loading = false;
//         $scope.locationsList = result.data;
//         $timeout(function() {
//             $(document).ready(function() {
//                 $(dropdownid).multiselect({
//                     enableFiltering: true,
//                     includeSelectAllOption: true,
//                     includeSelectAllDivider: true,
//                     maxHeight: 250,
//                     nonSelectedText: 'Select Location',
//                     filterPlaceholder: 'Search Location...',
//                     buttonWidth: '100%',
//                     onSelectAll: function(checked) {
//                         if (checked) {
//                             $scope.locations = [];
//                             for (var i = 0; i < $scope.locationsList.length; i++) {
//                                 var idss = ($scope.locationsList[i].id).toString()
//                                 $scope.locations.push(idss);
//                             }
//                         } else {
//                             $scope.locations = [];
//                         }
//                         console.log($scope.locations)
//                     },
//                     onChange: function(option, checked, select) {
//                         if (checked) {
//                             var ids = option.val();
//                             for (var i = 0; i < $scope.locationsList.length; i++) {
//                                 var idss = ($scope.locationsList[i].id).toString()
//                                 if (idss === ids) {
//                                     $scope.locations.push(idss);
//                                 }
//                             }
//                         } else {
//                             var ids = option.val();
//                             for (var i = 0; i < $scope.locations.length; i++) {
//                                 if ($scope.locations[i] === ids) {
//                                     $scope.locations.splice(i, 1);
//                                 }
//                             }

//                         }
//                         console.log($scope.locations);
//                     }

//                 });
//                 if (dropdownid === '#editlocation-multiselctDropDown' && $scope.locations.length >= 1) {
//                     $(dropdownid).multiselect('select', $scope.locations)
//                 }
//             });
//         }, 50);
//     }
//     var error = function(result) {
//         $scope.loading = false;
//         session.sessionexpried(result.status);
//     }
//     $http.get(domain + api + "location/", config)
//         .then(success, error);
// }
// $scope.getAllroles = function(dropdownid) {
//     $scope.loading = true;
//     var success = function(result) {
//         $scope.loading = false;
//         $scope.genaralroles = result.data;
//         $timeout(function() {
//             $(document).ready(function() {
//                 $(dropdownid).multiselect({
//                     enableFiltering: true,
//                     includeSelectAllOption: true,
//                     includeSelectAllDivider: true,
//                     maxHeight: 250,
//                     nonSelectedText: 'Select role',
//                     filterPlaceholder: 'Search role...',
//                     buttonWidth: '100%',
//                     onSelectAll: function(checked) {
//                         if (checked) {
//                             $scope.roles = [];
//                             for (var i = 0; i < $scope.genaralroles.length; i++) {
//                                 $scope.roles.push($scope.genaralroles[i].user_id);
//                             }
//                         } else {
//                             $scope.roles = [];
//                         }
//                         console.log($scope.roles)
//                     },
//                     onChange: function(option, checked, select) {
//                         if (checked) {
//                             $scope.roles.push(option.val());
//                         } else {
//                             for (var i = 0; i < $scope.roles.length; i++) {
//                                 if ($scope.roles[i] === option.val()) {
//                                     $scope.roles.splice(i, 1);
//                                 }
//                             }

//                         }
//                         console.log($scope.roles);
//                     }

//                 });
//                 if (dropdownid === '#editroles-multiselctDropDown' && $scope.roles.length >= 1) {
//                     $(dropdownid).multiselect('select', $scope.roles);
//                 }
//             });
//         }, 50);
//     }
//     var error = function(result) {
//         $scope.loading = false;
//         session.sessionexpried(result.status);
//     }
//     $http.get(domain + api + "role/", config)
//         .then(success, error);
// }