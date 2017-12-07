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
});