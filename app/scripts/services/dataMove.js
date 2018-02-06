var MobiDash = angular.module('mobiDashBoardApp');
MobiDash.service('dataMove', function(localStorageService) {
    this.setgroupdata = function(myData) {
        localStorageService.set("groupData", myData);
    };
    this.getgroupdata = function() {
        return localStorageService.get("groupData");
    };
    this.setsubgroupdata = function(myData) {
        localStorageService.set("subgroupData", myData);
    };
    this.getsubgroupdata = function() {
        return localStorageService.get("subgroupData");
    };
    this.setledgerData = function(myData) {
        localStorageService.set("ledger", myData);
    };
    this.getledgerData = function() {
        return localStorageService.get("ledger");
    };
    this.setcontrolledgerData = function(myData) {
        localStorageService.set("controlledger", myData);
    };
    this.getcontrolledgerData = function() {
        return localStorageService.get("controlledger");
    };
    this.setlocationwiseData = function(myData) {
        localStorageService.set("locationwise", myData);
    }
    this.getlocationwiseData = function() {
        return localStorageService.get("locationwise");
    }
    this.setmonthwiseData = function(myData) {
        localStorageService.set("monthwise", myData);
    }
    this.getmonthwiseData = function() {
        return localStorageService.get("monthwise");
    }
    this.setvoucherData = function(myData) {
        localStorageService.set("voucherData", myData);
    };
    this.getvoucherData = function() {
        return localStorageService.get("voucherData");
    };
    this.clearAlldata = function(data) {
        angular.forEach(data, function(item) {
            localStorageService.remove(item);
            console.log(localStorageService.get(item));
        });
    }
    this.setdatesData = function(myData) {
        localStorageService.set("alldates", myData);
    }
    this.getdatesData = function() {
        return localStorageService.get("alldates");
    };
    this.setsearchgroupData = function(myData) {
        localStorageService.set("searchgroupData", myData);
    }
    this.getsearchgroupData = function() {
        return localStorageService.get("searchgroupData");
    }
    this.setsearchsubgroupData = function(myData) {
        localStorageService.set("searchsubgroupData", myData);
    }
    this.getsearchsubgroupData = function() {
        return localStorageService.get("searchsubgroupData");
    }
    this.setsearchledgerData = function(myData) {
        localStorageService.set("searchledgerData", myData);
    }
    this.getsearchledgerData = function() {
        return localStorageService.get("searchledgerData");
    }
    this.setsearchcontrolledgerData = function(myData) {
        localStorageService.set("searchcontrolledgerData", myData);
    }
    this.getsearchcontrolledgerData = function() {
        return localStorageService.get("searchcontrolledgerData");
    }
    this.setsearchmonthwiseData = function(myData) {
        localStorageService.set("searchmonthwise", myData);
    }
    this.getsearchmonthwiseData = function() {
        return localStorageService.get("searchmonthwise");
    }
    this.setsearchvoucherData = function(myData) {
        localStorageService.set("searchvoucherData", myData);
    };
    this.getsearchvoucherData = function() {
        return localStorageService.get("searchvoucherData");
    };

    this.setusersearchData = function(myData) {
        localStorageService.set("usersearchData", myData);
    };
    this.getusersearchData = function() {
        return localStorageService.get("usersearchData");
    };
});




MobiDash.factory('session', function($state, localStorageService) {
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
                    localStorageService.clearAll();
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
            if (status === "No Data") {
                swal({
                    title: "",
                    text: "No data found.",
                    type: 'warning',
                    confirmButtonColor: '#facea8',
                    confirmButtonText: "Ok",
                }).then(function() {});

            }
        }
    };
});