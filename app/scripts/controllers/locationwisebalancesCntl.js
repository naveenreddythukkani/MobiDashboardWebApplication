var QTable = angular.module('mobiDashBoardApp');
QTable.controller('locationwisebalancesCntl', function($scope, $state, $rootScope, $stateParams, $http, domain, api, $timeout, core, localStorageService, NgTableParams, dataMove, session, $filter, mobileWidth) {

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
    $rootScope.moreIconShow= true;
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
    if($rootScope.isSearched){
       $('#mainpageContollerStart').addClass('balancesheetheader');
       $('#mainpageContollerStart').removeClass('balancesheetheadermove');
    }else{
      $('#mainpageContollerStart').addClass('balancesheetheadermove');
    }
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
    // $scope.clearlocalstorage = function() {
    //     dataMove.setvoucherData({});
    //     dataMove.setmonthwiseData({});
    //     $rootScope.getlocalstoredata();
    // }
    // $scope.clearlocalstorage();

    $scope.locationsData= [
      {
        'name':'ctiyworkshop',
        'amount':'34561.02'
      },
      {
        'name':'banjarahills',
        'amount':'34541.09'
      },
      {
        'name':'lbnagar',
        'amount':'-34521.20'
      },
      {
        'name':'dsnr',
        'amount':'34561.00'
      },
      {
        'name':'jubli hills',
        'amount':'554561.00'
      },
      {
        'name':'vizag',
        'amount':'-243561.00'
      }
    ]

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
            month = month - 1;
            console.log(month.toString().length);
            if (month.toString().length == 1) {
                month = '0' + month;
                if (month == 00) {
                    month = 12;
                    year = year - 1;
                }
            }
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
    }
   $rootScope.datescalculation();
});
