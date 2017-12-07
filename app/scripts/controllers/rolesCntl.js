var QTable = angular.module('mobiDashBoardApp');
QTable.controller('rolesCntl', function($scope, $state, $rootScope, $stateParams, $http, domain, api, $timeout, core, localStorageService, NgTableParams, session) {
    $rootScope.companytab = true;
    $rootScope.rolestab = true;
    $rootScope.locationtab = true;
    $rootScope.usertab = true;
    $rootScope.solutionstab = false;
    $rootScope.pricingtab = false;
    $rootScope.supporttab = false;
    $rootScope.gstsolutionstab = false;
    $rootScope.showheader = true;
    $rootScope.usernametab = true;
    $rootScope.activeTab = 9;
    $rootScope.patnerstab = false;
    $rootScope.logintab = false;
    $rootScope.backuptab = false;
    $rootScope.showCompanyname = false;
    $rootScope.balancesheetbreadcurmbs = false;
    $rootScope.voucherstab = true;

    $rootScope.addloc = false;
    $rootScope.addclient = false;
    $rootScope.contactus = false;
    $rootScope.adduser = false;
    $rootScope.addrole = true;
    $rootScope.addvouchertype = false;

    $scope.usersList = [];
    $scope.roleName = "";
    $scope.selectedmasters = [];
    $scope.selectedaccounts = [];
    $scope.selectedinventorys = [];
    $scope.props = {};
    $scope.selectedUsers = [];
    $scope.createRole = {};
    $scope.role_id = "";
    $scope.fields = {
        "none": 0,
        "rolename": 1
    }
    var config = {
        headers: {
            "X-CSRFToken": $rootScope.csrftoken,
            "$cookie": "csrftoken=" + $rootScope.csrftoken + '; ' + "sessionid=" + $rootScope.session_key
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
        }
    }
    $rootScope.addRole = function() {
        $("#addrole").modal('show');
    }
    $scope.addingRole = function() {

    }
    $scope.cancelForm = function() {
        $("#addrole").modal('hide');
        $("#userlist").modal('hide');
        $('#privileges').modal('hide');
        $scope.display_name = "";
        $scope.clearSearch();
    }
    $scope.getAssinedusers = function() {
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            angular.forEach($scope.selectedUsers, function(item) {
                angular.forEach(result.data.users, function(selectitem) {
                    if (item.userprofile_id === selectitem) {
                        item.select = true;
                    }
                });
            });
            $scope.userselectchange($scope.selectedUsers);
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + api + "role/" + $scope.role_id + "/assigned_users/", config)
            .then(success, error);
    }
    $scope.permissions = function() {
        var perm = $rootScope.privilege;
        var a = dcodeIO.Long.fromString(perm, true);
        var b = dcodeIO.Long.fromString("17592186044416", true);
        var val1High = a.getHighBitsUnsigned();
        var val1Low = a.getLowBitsUnsigned();

        var val2High = b.getHighBitsUnsigned();
        var val2Low = b.getLowBitsUnsigned();

        var bitwiseAndResult = dcodeIO.Long.fromBits(val1Low & val2Low, val1High & val2High, true);
        var result = bitwiseAndResult.toNumber()
        if (17592186044416 == result) {
            return false;
        }
        return true;
    }
    $scope.getAllUsers = function(rolename, id) {
        $scope.role_id = id;
        $scope.roleName = rolename;
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            $scope.getAssinedusers();
            var arry = [];
            angular.forEach(result.data, function(item) {
                $scope.props.userprofile_id = item.userprofile_id;
                $scope.props.user_id = item.user_id;
                $scope.props.username = item.username + ' (' + item.mobile + ')';
                $scope.props.select = false;
                arry.push($scope.props);
                $scope.props = {};
            });
            $scope.selectedUsers = arry;
            arry = [];
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + api + "user/", config)
            .then(success, error);
    }
    $scope.addingUserToRole = function() {
        $scope.loading = true;
        $scope.selectuserids = {};
        var array = [];
        angular.forEach($scope.selectedUsers, function(item) {
            if (item.select) {
                array.push(item.userprofile_id);
            }
        });
        $scope.selectuserids.users = array;
        $scope.selectuserids.role_id = $scope.role_id;
        var success = function(result) {
            $scope.loading = false;
            if (result.data.error === undefined) {
                $scope.getAllroles();
                $("#userlist").modal('hide');
                $scope.msg = "Users added to role successfully";
            } else {
                $scope.msg = result.data.error.message;
            }
            $scope.addremovealert();
            $scope.getAllroles();
        }
        var error = function(result) {
            $scope.loading = false;
            $("#userlist").modal('hide');
            session.sessionexpried(result.status);
        }
        $http.post(domain + api + "role/add_users/", $scope.selectuserids, config)
            .then(success, error);
    }
    $scope.clearSearch = function() {
        $scope.search_role.username = "";
    }
    $scope.getAllPrivileges = function(rolename, id) {
        $scope.role_id = id;
        $scope.roleName = rolename;
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            $scope.privileges = result.data;
            $scope.push = {};
            var arry = [];
            angular.forEach($scope.privileges[0], function(item) {
                $scope.push.id = item[1];
                $scope.push.seq = item[2];
                $scope.push.select = item[3]
                $scope.push.privilageName = item[4]
                arry.push($scope.push);
                $scope.push = {};
            });
            $scope.selectedmasters = arry;
            arry = [];
            angular.forEach($scope.privileges[1], function(item) {
                $scope.push.id = item[1];
                $scope.push.select = item[3]
                $scope.push.seq = item[2];
                $scope.push.privilageName = item[4]
                arry.push($scope.push);
                $scope.push = {};
            });
            $scope.selectedaccounts = arry;
            arry = [];
            angular.forEach($scope.privileges[2], function(item) {
                $scope.push.id = item[1];
                $scope.push.select = item[3]
                $scope.push.seq = item[2];
                $scope.push.privilageName = item[4]
                arry.push($scope.push);
                $scope.push = {};
            });
            $scope.selectedinventorys = arry;
            arry = [];
            $scope.masterselectchange($scope.selectedmasters);
            $scope.accountselectchange($scope.selectedaccounts);
            $scope.inventoryselectchange($scope.selectedinventorys);
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + api + "role/" + id + "/privilege/", config)
            .then(success, error);

    }
    $scope.showunderline = function(array, index) {
        if (index === 0) {
            return false
        }
        // if (index === array.length - 1) {
        //     return false;
        // }
        console.log(array[index].seq);
        if (array[index].seq - array[index - 1].seq >= 50) {
            return true;
        }
        return false;
    }
    $scope.editRolewithexistingDetails = function(role) {
        $scope.role_id = role.id;
        $scope.display_name = role.display_name;
    }
    $scope.editingRole = function() {
        $scope.createRole.display_name = $scope.display_name;
        if ($scope.allValidationscheck($scope.createRole)) {
            return;
        }
        var success = function(result) {
            $scope.loading = false;
            $scope.getAllroles();
            $("#editrole").modal('hide');
            if (result.data.error === undefined) {
                $scope.msg = "Roles edited succesfully";
            } else {
                $scope.msg = result.data.error.message;
            }
            $scope.display_name = "";
            $scope.addremovealert();
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
            $("#editrole").modal('hide');
            $scope.display_name = "";
        }
        $scope.loading = true;
        $http.post(domain + api + "role/" + $scope.role_id + "/modify/", $scope.createRole, config)
            .then(success, error);
    }
    $scope.editcancelForm = function() {
        $("#editrole").modal('hide');
        $scope.display_name = "";
    }
    $scope.deleteRole = function() {
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            $scope.getAllroles();
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + api + "role/" + $scope.role_id + "/delete/", config)
            .then(success, error);
    }
    $scope.removeRole = function(role) {
        // $scope.role_id = role.id;
        // $scope.display_name = role.display_name;
        $("#editrole").modal('hide');
        // $("#deleteModal").modal('show');
    }
    $scope.checkAllUserPrivilages = function() {
        if ($scope.selectAll) {
            $scope.selectAll = true
        } else {
            $scope.selectAll = false;
        }
        angular.forEach($scope.selectedUsers, function(item) {
            if (item.user_id.toString() !== $rootScope.owner_id) {
                item.select = $scope.selectAll;
            }
        });
    }
    $scope.checkAllMasterPrivilages = function() {
        if ($scope.masterselectall) {
            $scope.masterselectall = true
        } else {
            $scope.masterselectall = false;
        }
        angular.forEach($scope.selectedmasters, function(item) {
            item.select = $scope.masterselectall;
        });
    }
    $scope.checkAllAccountPrivilages = function() {
        if ($scope.accountselectall) {
            $scope.accountselectall = true
        } else {
            $scope.accountselectall = false;
        }
        angular.forEach($scope.selectedaccounts, function(item) {
            item.select = $scope.accountselectall;
        });
    }
    $scope.checkAllInventoryPrivilages = function() {
        if ($scope.inventoryselectall) {
            $scope.inventoryselectall = true
        } else {
            $scope.inventoryselectall = false;
        }
        angular.forEach($scope.selectedinventorys, function(item) {
            item.select = $scope.inventoryselectall;
        });
    }
    $scope.getAllroles = function() {
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            $scope.roles = result.data;
            $scope.multiroletbl = new NgTableParams({ count: $scope.roles.length }, { dataset: $scope.roles });
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + api + "role/", config)
            .then(success, error);
    }
    $scope.getAllroles();
    $scope.calculateSeletedItems = function(selectArray) {
        var count = 0;
        angular.forEach(selectArray, function(item) {
            if (item.select) {
                count += 1;
            }
        });
        return count;
    }
    $scope.addingRole = function() {
        $scope.createRole.display_name = $scope.display_name;
        if ($scope.allValidationscheck($scope.createRole)) {
            return;
        }
        var success = function(result) {
            $scope.loading = false;
            $("#addrole").modal('hide');
            if (result.data.error === undefined) {
                $scope.msg = "Role created successfully";
            } else {
                $scope.msg = result.data.error.message;
            }
            $scope.getAllroles();
            $scope.display_name = "";
            $scope.addremovealert();
        }
        var error = function(result) {
            $scope.loading = false;
            $("#addrole").modal('hide');
            $scope.display_name = "";
            session.sessionexpried(result.status);

        }
        $scope.loading = true;
        $http.post(domain + api + "role/", $scope.createRole, config)
            .then(success, error);
    }
    $scope.addingPrivilegesToRole = function() {
        $scope.loading = true;
        $scope.selectprivileges = {};
        var array = [];
        angular.forEach($scope.selectedmasters, function(item) {
            if (item.select) {
                array.push(item.id);
            }
        });
        $scope.selectprivileges.masters = array;
        $scope.selectprivileges.role_id = $scope.role_id;
        array = [];
        angular.forEach($scope.selectedaccounts, function(item) {
            if (item.select) {
                array.push(item.id);
            }
        });
        $scope.selectprivileges.accounts = array;
        array = [];
        angular.forEach($scope.selectedinventorys, function(item) {
            if (item.select) {
                array.push(item.id);
            }
        });
        $scope.selectprivileges.inventory = array;
        var success = function(result) {
            $scope.loading = false;
            $('#privileges').modal('hide');
            $scope.msg = "Privileges added to role successfully";
        }
        var error = function(result) {
            $scope.loading = false;
            $('#privileges').modal('hide');
        }
        $http.post(domain + api + "role/add_privileges/", $scope.selectprivileges, config)
            .then(success, error);
    }
    $scope.userselectchange = function(array) {
        var count = 0;
        angular.forEach(array, function(item) {
            if (item.select) {
                count += 1;
            }
        });
        if (count === array.length) {
            $scope.selectAll = true;
        } else {
            $scope.selectAll = false;
        }
    }
    $scope.masterselectchange = function(array) {
        var count = 0;
        angular.forEach(array, function(item) {
            if (item.select) {
                count += 1;
            }
        });
        if (count === array.length) {
            $scope.masterselectall = true;
        } else {
            $scope.masterselectall = false;
        }
    }
    $scope.accountselectchange = function(array) {
        var count = 0;
        angular.forEach(array, function(item) {
            if (item.select) {
                count += 1;
            }
        });
        if (count === array.length) {
            $scope.accountselectall = true;
        } else {
            $scope.accountselectall = false;
        }
    }
    $scope.inventoryselectchange = function(array) {
        var count = 0;
        angular.forEach(array, function(item) {
            if (item.select) {
                count += 1;
            }
        });
        if (count === array.length) {
            $scope.inventoryselectall = true;
        } else {
            $scope.inventoryselectall = false;
        }
    }
    $scope.validations = function() {
        $scope.field = $scope.fields.none;
        $scope.showerrormessage = false;
    }
    $scope.allValidationscheck = function(data) {
        if (data.display_name === undefined || data.display_name === "") {
            $scope.showerrormessage = true;
            $scope.field = $scope.fields.rolename;
            $scope.errormessage = "Please enter role name";
            return true;
        }
        return false;
    }
    $scope.roleshistoryshow = function(role) {
        $scope.roleid = {};
        $scope.histroyList = [];
        $scope.roleid.id = role.id;
        $scope.display_name = role.display_name;
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            $('#rolehistory').modal('show');
            $scope.histroyList = result.data;
            $scope.roleshistorytable = new NgTableParams({ count: $scope.histroyList.length }, { dataset: $scope.histroyList });
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.post(domain + api + "role/history/", $scope.roleid, config)
            .then(success, error);
    }
});


// $scope.roles = [{
//         "rolename": "Administrator",
//         "users": "2",
//         "is_active": true
//     },
//     {
//         "rolename": "Cashier",
//         "users": "5",
//         "is_active": true
//     },
//     {
//         "rolename": "Remote cashier",
//         "users": "4",
//         "is_active": true
//     },
//     {
//         "rolename": "Accountant",
//         "users": "4",
//         "is_active": true
//     }
// ]
// $scope.multiroletbl = new NgTableParams({ count: $scope.roles.length }, { dataset: $scope.roles });