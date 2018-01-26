var QTable = angular.module('mobiDashBoardApp');
QTable.controller('userCntl', function($scope, $state, $rootScope, $stateParams, $http, domain, api, $timeout, core, localStorageService, NgTableParams, dataMove, session, $filter, mobileWidth) {

    $rootScope.companytab = true;
    $rootScope.locationtab = true;
    $rootScope.usertab = true;
    $rootScope.solutionstab = false;
    $rootScope.pricingtab = false;
    $rootScope.supporttab = false;
    $rootScope.gstsolutionstab = false;
    $rootScope.showheader = true;
    $rootScope.usernametab = true;
    $rootScope.activeTab = 7;
    $rootScope.patnerstab = false;
    $rootScope.logintab = false;
    $rootScope.backuptab = false;
    $rootScope.rolestab = true;
    $rootScope.showCompanyname = false;
    $rootScope.balancesheetbreadcurmbs = false;
    $rootScope.voucherstab = true;
    $rootScope.downloadstab = false;
    $rootScope.moreIconShow= false;
    $rootScope.mobilebreadcurmbs = false;

    $rootScope.addloc = false;
    $rootScope.addclient = false;
    $rootScope.contactus = false;
    $rootScope.adduser = true;
    $rootScope.addrole = false;
    $rootScope.addvouchertype = false;

    $scope.props = {};
    $scope.locationsList = [];
    $scope.users = [];
    $scope.push = {};
    $scope.locations = [];
    $scope.roles = [];
    $scope.userDetails = {};
    $scope.props.security = "any";
    $scope.selectedRoles = [];
    $scope.selectedLocations = [];
    $scope.histroyList = [];
    $scope.search_location = {};
    $scope.search_role = {};
    $scope.user_id = ''
    $scope.username = '';
    $scope.searchEnable = false;
    $scope.showerrormessage = false;
    $rootScope.screenName = "Users";

    var screenwidth = $(window).width();
    if (screenwidth > mobileWidth) {
        $rootScope.showheader = true;
        $rootScope.mobileheader = false;
    } else {
        $rootScope.showheader = false;
        $rootScope.mobileheader = true;
    }
    $scope.fields = {
        "none": 0,
        "mobile": 1,
        "username": 2,
        "email": 3,
        "mac": 4,
        "ip": 5
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
    $scope.search = function() {
        if ($scope.searchEnable) {
            $scope.searchEnable = false;
        } else {
            $scope.searchEnable = true;
            $timeout(function() {
                $('[name="phonewithNameSearch"]').focus();
            }, 50);

        }
    }
    $rootScope.addUser = function() {
        $("#add_user").modal('show');
        $scope.props.is_active = true;
        $scope.props.security = "any";
        // $scope.getAllLoations('#location-multiselctDropDown');
        // $scope.getAllroles('#roles-multiselctDropDown');
    }
    $scope.getAllUsers = function() {
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            if(result.data.length===0){
              session.sessionexpried("No Data");
            }
            console.log(result.data[0]);
            var obj = {};
            var array = [];
            angular.forEach(result.data, function(item) {
                obj.phonewithNameSearch = item.username + item.mobile;
                obj.username = item.username;
                obj.mobile = item.mobile;
                obj.email = item.email;
                obj.locations = item.locations;
                obj.roles = item.roles;
                obj.ip_addr = item.ip_addr;
                obj.is_active = item.is_active;
                obj.login_restriction = item.login_restriction;
                obj.mac_addr = item.mac_addr;
                obj.mobile_only = item.mobile_only;
                obj.status = item.status;
                obj.track_interval = item.track_interval;
                obj.track_user = item.track_user;
                obj.trackfrom_time = item.trackfrom_time;
                obj.trackto_time = item.trackto_time;
                obj.user_id = item.user_id;
                obj.userprofile_id = item.userprofile_id;
                obj.vouchermodifydays = item.vouchermodifydays;
                array.push(obj);
                obj = {};
            });
            $scope.users = array;
            $scope.usertable = new NgTableParams({ count: $scope.users.length }, { dataset: $scope.users });
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + api + "user/", config)
            .then(success, error);

    }
    $scope.getAllUsers();
    $scope.edituserwithexistingDetails = function(user) {
        $("#edit_user").modal('show');
        $scope.addingchangesforedit(user);
        // $scope.getAllLoations('#editlocation-multiselctDropDown');
        // $scope.getAllroles('#editroles-multiselctDropDown');
    }

    $scope.addingchangesforedit = function(user) {
        $scope.props = user;
        if (user.login_restriction === "A") {
            $scope.props.security = "any";
        } else if (user.login_restriction === "B") {
            $scope.props.security = "both"
            $scope.props.ip_addr = user.ip_addr;
            $scope.props.mac_addr = user.mac_addr;
        } else if (user.login_restriction === "I") {
            $scope.props.security = "ip"
            $scope.props.ip_addr = user.ip_addr;
        } else if (user.login_restriction === "M") {
            $scope.props.security = "mac"
            $scope.props.mac_addr = user.mac_addr;
        }
        if (user.status === "A") {
            $scope.props.status = true;
        } else {
            $scope.props.status = false;
        }
        // for (var i = 0; i < user.locations.length; i++) {
        //     var string = user.locations[i].location_id;
        //     $scope.locations.push(string);
        // }
        // for (var i = 0; i < user.roles.length; i++) {
        //     var string = user.roles[i].id;
        //     $scope.roles.push(string);
        // }
    }
    $scope.cancelForm = function() {
        $("#add_user").modal('hide');
        // $('#roles-multiselctDropDown').multiselect("deselectAll", false).multiselect("refresh");
        // $('#location-multiselctDropDown').multiselect("deselectAll", false).multiselect("refresh");
        $scope.resetForm();
        $scope.clearSearch();
        $scope.field = "";
        $scope.showerrormessage = false;
    }
    $scope.editcancelForm = function() {
        $("#edit_user").modal('hide');
        // $('#editroles-multiselctDropDown').multiselect("deselectAll", false).multiselect("refresh");
        // $('#editlocation-multiselctDropDown').multiselect("deselectAll", false).multiselect("refresh");
        $scope.resetForm();
        $scope.field = "";
        $scope.showerrormessage = false;
    }
    $scope.resetForm = function() {
        $scope.props = {};
        $scope.locationsList = [];
        $scope.locations = [];
        $scope.roles = [];
    }
    $scope.addingUser = function() {
        var login_restriction;
        if ($scope.props.security === "mac") {
            login_restriction = 'M';
        } else if ($scope.props.security === "ip") {
            login_restriction = 'I';
        } else if ($scope.props.security === "both") {
            login_restriction = 'B';
        } else if ($scope.props.security === "any") {
            login_restriction = 'A';
        }
        $scope.userDetails.login_restriction = login_restriction;
        $scope.userDetails.mobile = $scope.props.mobile;
        $scope.userDetails.username = $scope.props.username;
        $scope.userDetails.email = $scope.props.email;
        $scope.userDetails.vouchermodifydays = $scope.props.vouchermodifydays;
        $scope.userDetails.ip_addr = $scope.props.ip_addr;
        $scope.userDetails.mac_addr = $scope.props.mac_addr;
        $scope.userDetails.trackuser = false;
        $scope.userDetails.is_active = $scope.props.is_active;
        if ($scope.allValidations($scope.userDetails)) {
            return;
        }
        var success = function(result) {
            $scope.loading = false;
            if (result.data.error === undefined) {
                $scope.getAllUsers();
                $scope.msg = "User added successfully";
            } else {
                $scope.msg = result.data.error.message;
            }
            $scope.addremovealert();
            $scope.cancelForm();
        }
        var error = function(result) {
                $scope.loading = false;
                session.sessionexpried(result.status);
            }
            // $scope.userDetails.roles = $scope.roles;
            // $scope.userDetails.location_id = $scope.locations;


        $scope.loading = true;
        $http.post(domain + api + "user/", $scope.userDetails, config)
            .then(success, error);
    }
    $scope.showinglocations = function(locations) {
        locations = $filter('orderBy')(locations, 'location_name');
        var location = [];
        for (var i = 0; i < locations.length; i++) {
            if (i <= 1) {
                location.push(locations[i].location_name);
            }
        }
        return location;
    }
    $scope.showingroles = function(roles) {
        roles = $filter('orderBy')(roles, 'display_name');
        var role = [];
        for (var i = 0; i < roles.length; i++) {
            if (i <= 1) {
                role.push(roles[i].display_name);
            }
        }
        return role;
    }
    $scope.editingUser = function() {
        var login_restriction;
        if ($scope.props.security === "mac") {
            login_restriction = 'M';
        } else if ($scope.props.security === "ip") {
            login_restriction = 'I';
        } else if ($scope.props.security === "both") {
            login_restriction = 'B';
        } else if ($scope.props.security === "any") {
            login_restriction = 'A';
        }
        $scope.userDetails.login_restriction = login_restriction;
        $scope.userDetails.is_active = $scope.props.is_active;
        $scope.userDetails.mobile = $scope.props.mobile;
        $scope.userDetails.username = $scope.props.username;
        $scope.userDetails.email = $scope.props.email;
        $scope.userDetails.vouchermodifydays = $scope.props.vouchermodifydays;
        $scope.userDetails.ip_addr = $scope.props.ip_addr;
        $scope.userDetails.mac_addr = $scope.props.mac_addr;
        $scope.userDetails.user_id = $scope.props.user_id;
        $scope.userDetails.trackuser = false;
        if ($scope.allValidations($scope.userDetails)) {
            return;
        }
        $scope.userDetails.first_name = $scope.props.username;
        $scope.userDetails.username = "";
        var success = function(result) {
            if (result.data.error === undefined) {
                $scope.editcancelForm();
                $scope.getAllUsers();
                $scope.msg = "User Details edited successfully";
            } else {
                $scope.msg = result.data.error.message;
            }
            $scope.addremovealert();
        }
        var error = function(result) {
                $scope.loading = false;
                $scope.editcancelForm();
                $scope.getAllUsers();
                session.sessionexpried(result.status);
            }
            // $scope.userDetails.roles = $scope.roles;
            // $scope.userDetails.location_id = $scope.locations;
        $scope.loading = false;
        $http.post(domain + api + "user/" + $scope.userDetails.user_id + "/modify/", $scope.userDetails, config)
            .then(success, error);
    }

    $scope.deletemodelshow = function() {
        $("#edit_user").modal('hide');
    }
    $scope.deleteUser = function(delete_id) {
        $scope.loading = true;
        $scope.deletion = {};
        $scope.deletion.user_id = delete_id;
        var success = function(result) {
            $scope.loading = false;
            $scope.getAllUsers();
            $scope.msg = "User deleted successfully";
            $scope.addremovealert();
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + api + "user/" + delete_id + "/delete/", config)
            .then(success, error);
    }
    $scope.isNumberKey = function($event) {
        if (!(($event.keyCode >= 48 && $event.keyCode <= 57) || ($event.keyCode === 8 || $event.keyCode === 46 || $event.keyCode === 9))) {
            $event.preventDefault();
        }
    }

    /////////////////////// locations//////////////////////////////

    $scope.assignLocationsToUser = function(user) {
        $scope.user_id = user.user_id;
        $scope.username = user.username;
        $('#locations').modal('show')
        $scope.getAllLoations(user);

    }
    $scope.getAllLoations = function(user) {
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            $scope.push = {}
            var arry = [];
            angular.forEach(result.data, function(item) {
                $scope.push.id = item.id;
                $scope.push.select = false;
                $scope.push.name = item.name
                $scope.push.display_name = item.display_name;
                arry.push($scope.push);
                $scope.push = {};
            });
            $scope.selectedLocations = arry;
            arry = [];
            $scope.getselectedLocations(user);
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + api + "location/compact/", config)
            .then(success, error);
    }
    $scope.getselectedLocations = function(user) {
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            angular.forEach($scope.selectedLocations, function(item) {
                angular.forEach(result.data, function(selectitem) {
                    if (item.id === selectitem) {
                        item.select = true;
                    }
                });
            });
            $scope.selectedLocations.length === 0 ? "" : $scope.locationselectchange($scope.selectedLocations);
        }
        var error = function(result) {
            $scope.loading = false;
        }
        $http.get(domain + api + "user/" + user.user_id + "/user_location/", config)
            .then(success, error);
    }
    $scope.addinglocationToUser = function() {
        $scope.loading = true;
        var array = []
        angular.forEach($scope.selectedLocations, function(item) {
            if (item.select) {
                array.push(item.id);
            }
        })
        var data = { "location_id": array };
        var success = function(result) {
            $scope.loading = false;
            if (result.data.error === undefined) {
                $scope.msg = "Locations updated for User";
            } else {
                $scope.msg = result.data.error.message;
            }
            $("#locations").modal('hide');
            $scope.addremovealert();
            $scope.getAllUsers();
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
            $("#locations").modal('hide');

        }
        $http.post(domain + api + "user/" + $scope.user_id + "/add_user_to_location/", data, config)
            .then(success, error);
    }
    $scope.checkAllLocations = function() {
        if ($scope.locationSelectAll) {
            $scope.locationSelectAll = true
        } else {
            $scope.locationSelectAll = false;
        }
        angular.forEach($scope.selectedLocations, function(item) {
            item.select = $scope.locationSelectAll;
        });
    }
    $scope.locationselectchange = function(array) {
        var count = 0;
        angular.forEach(array, function(item) {
            if (item.select) {
                count += 1;
            }
        });
        if (count === array.length) {
            $scope.locationSelectAll = true;
        } else {
            $scope.locationSelectAll = false;
        }
    }


    ///////////////////////Roles//////////////////////
    $scope.assignRolesToUser = function(user) {
        $scope.userprofile_id = user.userprofile_id;
        $scope.username = user.username;
        $('#roles').modal('show')
        $scope.getAllroles(user);
    }
    $scope.getAllroles = function(user) {
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            $scope.push = {}
            var arry = [];
            angular.forEach(result.data, function(item) {
                $scope.push.id = item.id;
                $scope.push.select = false;
                $scope.push.display_name = item.display_name;
                arry.push($scope.push);
                $scope.push = {};
            });
            $scope.selectedRoles = arry;
            arry = [];
            $scope.getAssinedroles(user);
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + api + "role/", config)
            .then(success, error);
    }
    $scope.getAssinedroles = function(user) {
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            angular.forEach($scope.selectedRoles, function(item) {
                angular.forEach(result.data, function(selectitem) {
                    if (item.id === selectitem) {
                        item.select = true;
                    }
                });
            });
            $scope.selectedRoles.length === 0 ? "" : $scope.roleselectchange($scope.selectedRoles);
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + api + "user/" + $scope.userprofile_id + "/user_roles/", config)
            .then(success, error);
    }
    $scope.addingRoleToUser = function() {
        $scope.loading = true;
        var array = []
        angular.forEach($scope.selectedRoles, function(item) {
            if (item.select) {
                array.push(item.id);
            }
        })
        var data = { "role_id": array };
        var success = function(result) {
            $scope.loading = false;
            if (result.data.error === undefined) {
                $scope.msg = "Roles updated for User";
            } else {
                $scope.msg = result.data.error.message;
            }
            $scope.addremovealert();
            $("#roles").modal('hide');
            $scope.getAllUsers();
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
            $("#roles").modal('hide');

        }
        $http.post(domain + api + "user/" + $scope.userprofile_id + "/add_userroles/", data, config)
            .then(success, error);
    }

    $scope.checkAllRoles = function() {
        if ($scope.roleSelectAll) {
            $scope.roleSelectAll = true
        } else {
            $scope.roleSelectAll = false;
        }
        angular.forEach($scope.selectedRoles, function(item) {
            item.select = $scope.roleSelectAll;
        });
    }
    $scope.roleselectchange = function(array) {
            var count = 0;
            angular.forEach(array, function(item) {
                if (item.select) {
                    count += 1;
                }
            });
            if (count === array.length) {
                $scope.roleSelectAll = true;
            } else {
                $scope.roleSelectAll = false;
            }
        }
        ////////////////// genaral function///////////////////

    $scope.calculateSeletedItems = function(selectArray) {
        var count = 0;
        angular.forEach(selectArray, function(item) {
            if (item.select) {
                count += 1;
            }
        });
        return count;
    }
    $scope.clearSearch = function() {
        $scope.search_location.name = "";
        $scope.search_role.display_name = "";
    }
    $scope.ipvalidation = function(ipAddr) {
        if (ipAddr != '0.0.0.0' && ipAddr != '255.255.255.255' && ipAddr.match(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/)) {
            return true;
        } else {
            return false;
        }
    }
    $scope.macAdressValidation = function(macAddr) {
        var alphaNum = /^[A-Za-z0-9]+$/;
        if (macAddr.length == 12 && alphaNum.test(macAddr)) {
            return true;
        } else {
            return false;
        }
    }
    $scope.emailValidation = function(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    $scope.validations = function() {
        $scope.showerrormessage = false;
        $scope.field = $scope.fields.none;
    }
    $scope.allValidations = function(data) {
        if (data.mobile === undefined || data.mobile === "") {
            $scope.showerrormessage = true;
            $scope.field = $scope.fields.mobile;
            $scope.errormessage = "Please enter mobile number";
            return true;
        }
        if (data.mobile.length !== 10) {
            $scope.showerrormessage = true;
            $scope.field = $scope.fields.mobile;
            $scope.errormessage = "Please enter valid mobile number";
            return true;
        }
        if (data.username === undefined || data.username === "") {
            $scope.showerrormessage = true;
            $scope.field = $scope.fields.username;
            $scope.errormessage = "Please enter username";
            return true;
        }
        if (data.email === undefined || data.email === "") {
            $scope.showerrormessage = true;
            $scope.field = $scope.fields.email;
            $scope.errormessage = "Please enter email";
            return true;
        }
        if (data.email !== undefined && (data.email.length > 0 && !$scope.emailValidation(data.email))) {
            $scope.showerrormessage = true;
            $scope.field = $scope.fields.email;
            $scope.errormessage = "Please enter valid email address";
            return true;
        }
        if (data.login_restriction === 'B') {
            if (!data.mac_addr || data.mac_addr === undefined || data.mac_addr === "") {
                $scope.showerrormessage = true;
                $scope.field = $scope.fields.mac;
                $scope.errormessage = "Please enter mac address";
                return true;
            }
            if (data.mac_addr && !$scope.macAdressValidation(data.mac_addr)) {
                $scope.showerrormessage = true;
                $scope.field = $scope.fields.mac;
                $scope.errormessage = "Please enter valid mac address";
                return true;
            }
            if (!data.ip_addr || data.ip_addr === undefined || data.ip_addr === "") {
                $scope.showerrormessage = true;
                $scope.field = $scope.fields.ip;
                $scope.errormessage = "Please enter ip address";
                return true;
            }
            if (data.ip_addr && !$scope.ipvalidation(data.ip_addr)) {
                $scope.showerrormessage = true;
                $scope.field = $scope.fields.ip;
                $scope.errormessage = "Please enter valid ip address";
                return true;
            }
        }
        if (data.login_restriction === 'M') {
            if (!data.mac_addr || data.mac_addr === undefined || data.mac_addr === "") {
                $scope.showerrormessage = true;
                $scope.field = $scope.fields.mac;
                $scope.errormessage = "Please enter mac address";
                return true;
            }
            if (data.mac_addr && !$scope.macAdressValidation(data.mac_addr)) {
                $scope.showerrormessage = true;
                $scope.field = $scope.fields.mac;
                $scope.errormessage = "Please enter valid mac address";
                return true;
            }
        }
        if (data.login_restriction === 'I') {
            if (!data.ip_addr || data.ip_addr === undefined || data.ip_addr === "") {
                $scope.showerrormessage = true;
                $scope.field = $scope.fields.ip;
                $scope.errormessage = "Please enter ip address";
                return true;
            }
            if (data.ip_addr && !$scope.ipvalidation(data.ip_addr)) {
                $scope.showerrormessage = true;
                $scope.field = $scope.fields.ip;
                $scope.errormessage = "Please enter valid ip address";
                return true;
            }
        }
        return false;
    }
    $scope.userhistory = function(user) {
        $scope.histroyList = [];
        $scope.usersid = {};
        $scope.usersid.id = user.user_id;
        $scope.username = user.username;
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            $('#userhistory').modal('show');
            $scope.histroyList = result.data;
            $scope.usershistorytable = new NgTableParams({ count: $scope.histroyList.length }, { dataset: $scope.histroyList });
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.post(domain + api + "user/history/", $scope.usersid, config)
            .then(success, error);
    }


});
