var QTable = angular.module('mobiDashBoardApp');
QTable.controller('locationCntl', function($scope, $state, $rootScope, $stateParams, $http, domain, api, $timeout, core, localStorageService, NgTableParams, dataMove, session, mobileWidth) {

    $rootScope.companytab = true;
    $rootScope.locationtab = true;
    $rootScope.usertab = true;
    $rootScope.solutionstab = false;
    $rootScope.pricingtab = false;
    $rootScope.supporttab = false;
    $rootScope.gstsolutionstab = false;
    $rootScope.showheader = true;
    $rootScope.usernametab = true;
    $rootScope.activeTab = 6;
    $rootScope.patnerstab = false;
    $rootScope.logintab = false;
    $rootScope.backuptab = false;
    $rootScope.rolestab = true;
    $rootScope.balancesheetbreadcurmbs = false;
    $rootScope.showCompanyname = false;
    $rootScope.voucherstab = true;
    $rootScope.downloadstab = false;
    $rootScope.moreIconShow = false;

    $rootScope.addloc = true;
    $rootScope.addclient = false;
    $rootScope.contactus = false;
    $rootScope.adduser = false;
    $rootScope.addrole = false;
    $rootScope.addvouchertype = false;
    $rootScope.mobilebreadcurmbs = false;

    $rootScope.screenName = "Locations";


    var screenwidth = $(window).width();
    if (screenwidth > mobileWidth) {
        $rootScope.showheader = true;
        $rootScope.mobileheader = false;
    } else {
        $rootScope.showheader = false;
        $rootScope.mobileheader = true;
    }

    $scope.props = {};
    $scope.userlist = [];
    $scope.selectedUsers = [];
    $scope.selectedDaybooks = [];
    $scope.selectedLedgers = [];
    $scope.transcationledgers = [];
    $scope.ledgers = [];
    $scope.daybooks = [];
    $scope.searchEnable = false;
    $scope.daybookselectAll = false;
    $scope.ledgerselectall = false;
    $scope.ledgerUnselectAll = false;
    $scope.userSelectAll = false;
    $scope.location_id = "";
    $scope.location_name = "";
    $scope.search_user = {};
    $scope.search_daybooks = {};
    $scope.search_ledgers = {};
    $scope.histroyList = [];
    $scope.fields = {
        "none": 0,
        "name": 1,
        "mobile": 2,
        "addr1": 3,
        "addr2": 4,
        "city": 5,
        "state": 6,
        "zip": 7,
        "fax": 8,
        "email": 9,
        "web": 10,
        "gstin": 11,
        "tan": 12
    }
    $scope.states = [{
            "code": "AN",
            "name": "Andaman and Nicobar Islands"
        },
        {
            "code": "AP",
            "name": "Andhra Pradesh"
        },
        {
            "code": "AR",
            "name": "Arunachal Pradesh"
        },
        {
            "code": "AS",
            "name": "Assam"
        },
        {
            "code": "BR",
            "name": "Bihar"
        },
        {
            "code": "CG",
            "name": "Chandigarh"
        },
        {
            "code": "CH",
            "name": "Chhattisgarh"
        },
        {
            "code": "DH",
            "name": "Dadra and Nagar Haveli"
        },
        {
            "code": "DD",
            "name": "Daman and Diu"
        },
        {
            "code": "DL",
            "name": "Delhi"
        },
        {
            "code": "GA",
            "name": "Goa"
        },
        {
            "code": "GJ",
            "name": "Gujarat"
        },
        {
            "code": "HR",
            "name": "Haryana"
        },
        {
            "code": "HP",
            "name": "Himachal Pradesh"
        },
        {
            "code": "JK",
            "name": "Jammu and Kashmir"
        },
        {
            "code": "JH",
            "name": "Jharkhand"
        },
        {
            "code": "KA",
            "name": "Karnataka"
        },
        {
            "code": "KL",
            "name": "Kerala"
        },
        {
            "code": "LD",
            "name": "Lakshadweep"
        },
        {
            "code": "MP",
            "name": "Madhya Pradesh"
        },
        {
            "code": "MH",
            "name": "Maharashtra"
        },
        {
            "code": "MN",
            "name": "Manipur"
        },
        {
            "code": "ML",
            "name": "Meghalaya"
        },
        {
            "code": "MZ",
            "name": "Mizoram"
        },
        {
            "code": "NL",
            "name": "Nagaland"
        },
        {
            "code": "OR",
            "name": "Odisha"
        },
        {
            "code": "PY",
            "name": "Puducherry"
        },
        {
            "code": "PB",
            "name": "Punjab"
        },
        {
            "code": "RJ",
            "name": "Rajasthan"
        },
        {
            "code": "SK",
            "name": "Sikkim"
        },
        {
            "code": "TN",
            "name": "Tamil Nadu"
        },
        {
            "code": "TS",
            "name": "Telangana"
        },
        {
            "code": "TR",
            "name": "Tripura"
        },
        {
            "code": "UP",
            "name": "Uttar Pradesh"
        },
        {
            "code": "UK",
            "name": "Uttarakhand"
        },
        {
            "code": "WB",
            "name": "West Bengal"
        }
    ];
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
        // $scope.isNumberKey = function($event) {
        //     if (!(($event.keyCode >= 48 && $event.keyCode <= 57) || ($event.keyCode === 8 || $event.keyCode === 46))) {
        //         $event.preventDefault();
        //     }
        // }
    $scope.search = function() {
        if ($scope.searchEnable) {
            $scope.searchEnable = false;
        } else {
            $scope.searchEnable = true;
            $timeout(function() {
                $('[name="name"]').focus();
            }, 50);
        }
    }
    $scope.getAllLoations = function() {
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            if (result.data.error === undefined) {
                if (result.data.length === 0) {
                    session.sessionexpried("No Data");
                }
                $scope.locationsList = result.data;
                $scope.loctionstable = new NgTableParams({ count: $scope.locationsList.length }, { dataset: $scope.locationsList });
            } else {
                $scope.msg = result.data.error.message;
                $scope.addremovealert();
            }
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + api + "location/compact/", config)
            .then(success, error);
    }
    $scope.getAllLoations();

    $rootScope.addLocation = function() {
        // $scope.getAllUsers('#user-multiselctDropDown');
        // $scope.gettingAllDaybooks('#daybook-multiselctDropDown');
        // $scope.gettingAllledgers('#ledger-multiselctDropDown');
        $timeout(function() {
            $("#add_location").modal('show');
        }, 50);
        $scope.props.is_Active = true;
    }
    $scope.cancelForm = function() {
        $scope.props = {};
        // $('#user-multiselctDropDown').multiselect("deselectAll", false).multiselect("refresh");
        // $('#daybook-multiselctDropDown').multiselect("deselectAll", false).multiselect("refresh");
        // $('#ledger-multiselctDropDown').multiselect("deselectAll", false).multiselect("refresh");
        $("#add_location").modal('hide');
        $scope.clearSearchfordaybooks();
        $scope.clearSearchforldgers();
        $scope.clearSearchforuser();
        $scope.field = "";
        $scope.showerrormessage = false;
    }
    $scope.editcancelForm = function() {
        $scope.props = {};
        // $('#edituser-multiselctDropDown').multiselect("deselectAll", false).multiselect("refresh");
        // $('#editdaybook-multiselctDropDown').multiselect("deselectAll", false).multiselect("refresh");
        // $('#editledger-multiselctDropDown').multiselect("deselectAll", false).multiselect("refresh");
        $("#edit_location").modal('hide');
        $scope.field = "";
        $scope.showerrormessage = false;
    }
    $scope.addingLocation = function() {
        // $scope.props.user_id = $scope.users;
        // $scope.props.ledger_id = $scope.ledgers;
        // $scope.props.daybook_id = $scope.daybooks;
        if ($scope.props.is_Active) {
            $scope.props.status = 'A';
        } else {
            $scope.props.status = 'I';
        }
        if (!$scope.props.gstin) {
            $scope.props.gstin = "";
        }
        if (!$scope.props.tan) {
            $scope.props.tan = "";
        }
        if ($scope.allValidationscheck($scope.props)) {
            return;
        }
        var success = function(result) {
            $scope.loading = false;
            $scope.cancelForm();
            if (result.data.error === undefined) {
                $scope.msg = "loaction added successfully";
            } else {
                $scope.msg = result.data.error.message;
            }
            $scope.addremovealert();
            $scope.getAllLoations();
        }
        var error = function(result) {
            $scope.loading = false;
            $scope.cancelForm();
            session.sessionexpried(result.status);
            $scope.getAllLoations();
        }
        $scope.loading = true;
        $http.post(domain + api + "location/", $scope.props, config)
            .then(success, error);
    }
    $scope.editLocation = function() {
        // $scope.props.user_id = $scope.users;
        // $scope.props.ledger_id = $scope.ledgers;
        // $scope.props.daybook_id = $scope.daybooks;
        if ($scope.props.is_Active) {
            $scope.props.status = 'A';
        } else {
            $scope.props.status = 'I';
        }
        if (!$scope.props.gstin) {
            $scope.props.gstin = "";
        }
        if (!$scope.props.tan) {
            $scope.props.tan = "";
        }
        if ($scope.allValidationscheck($scope.props)) {
            return;
        }
        var success = function(result) {
            if (result.status === 200) {
                $scope.loading = false;
                if (result.data.error === undefined) {
                    $scope.msg = "Location details edited successfully";
                } else {
                    $scope.msg = result.data.error.message;
                }
            }
            $scope.addremovealert();
            $scope.editcancelForm();
            $scope.getAllLoations();
            $scope.props = {};
        }
        var error = function(result) {
            $scope.loading = false;
            $scope.editcancelForm();
            session.sessionexpried(result.status);
            $scope.props = {};
        }
        $scope.loading = true;
        $http.post(domain + api + "location/" + $scope.props.id + "/modify/", $scope.props, config)
            .then(success, error);
    }
    $scope.editLocationwithexistingDetails = function(locationDetais) {
        $scope.props.display_name = locationDetais.display_name;
        $scope.props.address_line_1 = locationDetais.address_line_1;
        $scope.props.address_line_2 = locationDetais.address_line_2;
        $scope.props.city = locationDetais.city;
        $scope.props.state = locationDetais.state;
        $scope.props.postal_code = locationDetais.postal_code;
        $scope.props.mobile = locationDetais.mobile;
        $scope.props.id = locationDetais.id;
        $scope.props.web = locationDetais.web;
        $scope.props.gstin = locationDetais.gstin;
        $scope.props.tan = locationDetais.tan;
        $scope.props.fax = locationDetais.fax;
        $scope.props.email = locationDetais.email;
        if (locationDetais.status === 'A') {
            $scope.props.is_Active = true;
        } else {
            $scope.props.is_Active = false;
        }
        $("#edit_location").modal('show');
        // $scope.getselectedusers(locationDetais);
        // $scope.getselectdaybooks(locationDetais);
        // $scope.getselectedleders(locationDetais);
        // $scope.getAllUsers('#edituser-multiselctDropDown');
        // $scope.gettingAllDaybooks('#editdaybook-multiselctDropDown');
        // $scope.gettingAllledgers('#editledger-multiselctDropDown');

    }
    $scope.deletelocation = function(location_id) {
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            $scope.getAllLoations();
            $("#deleteModal").modal('hide');
            if (result.data.error === undefined) {
                $scope.msg = "loaction deleted successfully";
            } else {
                $scope.msg = result.data.error.message;
            }
            $scope.addremovealert();
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + api + "location/" + location_id + "/delete/", config)
            .then(success, error);
    }

    $scope.deletemodelshow = function() {
        $("#edit_location").modal('hide');
    }


    /////////////////////////////////// Users//////////////////////////////
    $scope.assignUsersToLocation = function(location) {
        $scope.location_name = location.display_name;
        $scope.getAllUsers(location);
        $("#userlist").modal('show');
    }
    $scope.getAssinedusers = function(location) {
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            if (result.data.error === undefined) {
                angular.forEach($scope.selectedUsers, function(item) {
                    angular.forEach(result.data, function(selectitem) {
                        if (item.user_id === selectitem.user_id) {
                            item.select = true;
                        }
                    });
                });
                $scope.selectedUsers.length === 0 ? "" : $scope.userselectchange($scope.selectedUsers);
            } else {
                $scope.msg = result.data.error.message;
                $scope.addremovealert();
            }
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + api + "location/" + location.id + "/users/", config)
            .then(success, error);
    }

    $scope.getAllUsers = function(location) {
        $scope.location_id = location.id;
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            if (result.data.error === undefined) {
                var arry = [];
                angular.forEach(result.data, function(item) {
                    $scope.props.user_id = item.user_id;
                    $scope.props.username = item.username + ' (' + item.mobile + ')';
                    $scope.props.select = false;
                    arry.push($scope.props);
                    $scope.props = {};
                });
                $scope.selectedUsers = arry;
                arry = [];
                $scope.getAssinedusers(location);
            } else {
                $scope.msg = result.data.error.message;
                $scope.addremovealert();
            }
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + api + "user/", config)
            .then(success, error);
    }
    $scope.addingUserToLocation = function() {
        $scope.loading = true;
        var array = []
        angular.forEach($scope.selectedUsers, function(item) {
            if (item.select) {
                array.push(item.user_id);
            }
        })
        var data = { "user_id": array };
        var success = function(result) {
            $scope.loading = false;
            if (result.data.error === undefined) {
                $scope.msg = "Users updated for location";
            } else {
                $scope.msg = result.data.error.message;
            }
            $scope.addremovealert();
            $("#userlist").modal('hide');
            $scope.getAllLoations();

        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
            $("#userlist").modal('hide');
            $scope.getAllLoations();
        }
        $http.post(domain + api + "location/" + $scope.location_id + "/add_userlocation/", data, config)
            .then(success, error);

    }
    $scope.checkAllUsers = function() {
        if ($scope.userSelectAll) {
            $scope.userSelectAll = true
        } else {
            $scope.userSelectAll = false;
        }
        angular.forEach($scope.selectedUsers, function(item) {
            if (item.user_id.toString() !== $rootScope.owner_id) {
                item.select = $scope.userSelectAll;
            }
        });
    }
    $scope.userselectchange = function(array) {
        var count = 0;
        angular.forEach(array, function(item) {
            if (item.select) {
                count += 1;
            }
        });
        if (count === array.length) {
            $scope.userSelectAll = true;
        } else {
            $scope.userSelectAll = false;
        }
    }


    //////////////////////// daybooks//////////////////////////
    $scope.assignDaybooksToLocation = function(location) {
        $scope.location_id = location.id
        $scope.location_name = location.display_name;
        $("#daybooks").modal('show');
        $scope.gettingAllDaybooks(location);
    }
    $scope.gettingAllDaybooks = function(location) {
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            if (result.data.error === undefined) {
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
                $scope.daybooks = arry;
                $scope.getselectdaybooks(location);
            } else {
                $scope.msg = result.data.error.message;
                $scope.addremovealert();
            }
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + api + "generalledger/unassigned_daybook/", config)
            .then(success, error);
    }
    $scope.getselectdaybooks = function(location) {
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            if (result.data.error === undefined) {
                $scope.push = {}
                var arry = [];
                angular.forEach(result.data, function(item) {
                    $scope.push.id = item.g_id;
                    $scope.push.select = true;
                    $scope.push.name = item.g_name
                    $scope.push.display_name = item.g_d_name;
                    arry.push($scope.push);
                    $scope.push = {};
                });
                var alldaybooksarray = arry;
                alldaybooksarray = alldaybooksarray.concat($scope.daybooks);
                $scope.selectedDaybooks = alldaybooksarray;

                // angular.forEach($scope.selectedDaybooks, function(item) {
                //     angular.forEach(result.data, function(selectitem) {
                //         if (item.id === selectitem.id) {
                //             item.select = true;
                //         }
                //     });
                // });
                $scope.selectedDaybooks.length === 0 ? "" : $scope.daybookselectchange($scope.selectedDaybooks);
            } else {
                $scope.msg = result.data.error.message;
                $scope.addremovealert();
            }
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }

        $http.get(domain + api + "location/" + location.id + "/assigned_daybook/", config)
            .then(success, error);
    }
    $scope.addingDaybookToLocation = function() {
        $scope.loading = true;
        var array = []
        angular.forEach($scope.selectedDaybooks, function(item) {
            if (item.select) {
                array.push(item.id);
            }
        })
        var data = { "gl_id": array };
        var success = function(result) {
            $scope.loading = false;
            $("#daybooks").modal('hide');
            if (result.data.error === undefined) {
                $scope.msg = "Daybooks updated for location";
            } else {
                $scope.msg = result.data.error.message;
            }
            $scope.addremovealert();
            $scope.getAllLoations();
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
            $("#daybooks").modal('hide');
            $scope.getAllLoations();
        }
        $http.post(domain + api + "location/" + $scope.location_id + "/add_daybook/", data, config)
            .then(success, error);

    }
    $scope.daybookselectchange = function(array) {
        var count = 0;
        angular.forEach(array, function(item) {
            if (item.select) {
                count += 1;
            }
        });
        if (count === array.length) {
            $scope.daybookselectAll = true;
        } else {
            $scope.daybookselectAll = false;
        }
    }
    $scope.checkAllDaybooks = function() {
        if ($scope.daybookselectAll) {
            $scope.daybookselectAll = true
        } else {
            $scope.daybookselectAll = false;
        }
        angular.forEach($scope.selectedDaybooks, function(item) {
            item.select = $scope.daybookselectAll;
        });
    }

    /////////////////////////////// ledgers/////////////////////////

    $scope.assignLedgersToLocation = function(location) {
        $scope.location_id = location.id;
        $scope.location_name = location.display_name;
        $("#ledgers").modal('show');
        $scope.gettingAllledgers(location);
    }
    $scope.gettingAllledgers = function(location) {
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            if (result.data.error === undefined) {
                $scope.push = {}
                var arry = [];
                angular.forEach(result.data, function(item) {
                    $scope.push.id = item.id;
                    $scope.push.select = false;
                    $scope.push.name = item.name;
                    $scope.push.display_name = item.qualified_name;
                    arry.push($scope.push);
                    $scope.push = {};
                });
                $scope.selectedLedgers = arry;
                $scope.getselectedleders(location);
            } else {
                $scope.msg = result.data.error.message;
                $scope.addremovealert();
            }
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + api + "generalledger/ledger/", config)
            .then(success, error);
    }

    $scope.getselectedleders = function(location) {
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            if (result.data.error === undefined) {
                angular.forEach($scope.selectedLedgers, function(item) {
                    angular.forEach(result.data, function(selectitem) {
                        if (item.id === selectitem.id) {
                            item.select = true;
                        }
                    });
                });
                $scope.selectedLedgers.length === 0 ? "" : $scope.ledgerselectchange($scope.selectedLedgers);
            } else {
                $scope.msg = result.data.error.message;
                $scope.addremovealert();
            }
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + api + "location/" + location.id + "/assigned_ledgers/", config)
            .then(success, error);
    }

    $scope.updateEachledgerChange = function(item, selectedLedgerArray) {
        $scope.ledgerselectchange(selectedLedgerArray);
        if (item.select) {
            $scope.loading = true;
            var array = [];
            array.push(item.id);
            var data = { "gl_id": array };
            var success = function(result) {
                $scope.loading = false;
                if (result.data.error === undefined) {
                    $scope.msg = "ledger assinged to location is successful";
                } else {
                    item.select = false;
                    $scope.msg = result.data.error.message;
                }
                $scope.addremovealert();
            }
            var error = function(result) {
                $scope.loading = false;
                session.sessionexpried(result.status);
                $("#ledgers").modal('hide');
            }
            $http.post(domain + api + "location/" + $scope.location_id + "/add_ledgers/", data, config)
                .then(success, error);
        } else {
            $scope.deleteLedgerId = item.id;
            $scope.deleteLedgerData('partialUnCheck');
        }
    }

    $scope.deleteLedgerData = function(checkType) {
        $scope.loading = true;
        var array = [];
        var data = {};
        if (checkType === 'completeUnCheck') {
            if ($scope.ledgerUnselectAll) {
                angular.forEach($scope.selectedLedgers, function(item) {
                    array.push(item.id);
                })
            } else {
                array.push($scope.deleteLedgerId);
            }
            data.force = true;
        } else {
            array.push($scope.deleteLedgerId);
            data.force = false;
        }
        data.gl_id = array;
        var success = function(result) {
            $scope.loading = false;
            if (result.data.error === undefined) {
                $scope.msg = "ledgers unassigned to location successfull";
                $scope.addremovealert();
            } else if (result.data.error !== undefined && result.data.error.code === 1105) {
                var msgs = "";
                angular.forEach(result.data.error.ledgers, function(item) {
                    msgs = item.display_name;
                })
                $scope.errMsg = msgs;
                $('#deleteledger').modal('show');
            } else if (result.data.error !== undefined && result.data.error.code === 4006) {
                $scope.msg = result.data.error.message;
                $scope.deleteNoAction();
                $scope.addremovealert();
            } else {
                $scope.msg = result.data.error.message;
                $scope.addremovealert();
            }
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
            $("#ledgers").modal('hide');
        }
        $http.post(domain + api + "location/" + $scope.location_id + "/delete_ledgers/", data, config)
            .then(success, error);
    }
    $scope.deleteNoAction = function() {
        if ($scope.ledgerUnselectAll) {
            angular.forEach($scope.selectedLedgers, function(item) {
                // angular.forEach($scope.transcationledgers, function(tranc) {
                //     if (tranc.id === item.id) {
                item.select = true;
                //     }
                // })
            })
        } else {
            angular.forEach($scope.selectedLedgers, function(item) {
                if ($scope.deleteLedgerId === item.id) {
                    item.select = true;
                }
            })
        }
    }
    $scope.UpdateAllLedgerToLocation = function() {
        $scope.loading = true;
        var array = []
        angular.forEach($scope.selectedLedgers, function(item) {
            array.push(item.id);
        })
        var data = { "gl_id": array };
        var success = function(result) {
            $scope.loading = false;
            if (result.data.error === undefined) {
                if ($scope.ledgerselectall) {
                    $scope.msg = "ledgers assigned to location successfull";
                } else {
                    $scope.msg = "ledgers unassigned to location successfull";
                }
                $scope.addremovealert();
            } else if (result.data.error !== undefined && result.data.error.code === 1105) {
                var msgs = "";
                $scope.transcationledgers = result.data.error.ledgers;
                angular.forEach(result.data.error.ledgers, function(item) {
                    msgs = msgs.length > 0 ? msgs + ',' + item.display_name : msgs + item.display_name;
                })
                $scope.errMsg = msgs;
                $('#deleteledger').modal('show');
            } else if (result.data.error !== undefined && result.data.error.code === 4006) {
                if ($scope.ledgerselectall) {
                    $scope.msg = result.data.error.message;
                } else {
                    $scope.msg = result.data.error.message;
                }
                $scope.addremovealert();
            }
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
            $("#ledgers").modal('hide');
        }
        if ($scope.ledgerselectall) {
            $http.post(domain + api + "location/" + $scope.location_id + "/add_ledgers/", data, config)
                .then(success, error);
        } else {
            data.force = false;
            $http.post(domain + api + "location/" + $scope.location_id + "/delete_ledgers/", data, config)
                .then(success, error);
        }

    }

    $scope.ledgerselectchange = function(array) {
        var count = 0;
        angular.forEach(array, function(item) {
            if (item.select) {
                count += 1;
            }
        });
        if (count === array.length) {
            $scope.ledgerselectall = true;
        } else {
            $scope.ledgerselectall = false;
        }
    }
    $scope.checkAllLedgers = function() {
            if ($scope.ledgerselectall) {
                $scope.ledgerselectall = true;
                $scope.ledgerUnselectAll = false;
            } else {
                $scope.ledgerselectall = false;
                $scope.ledgerUnselectAll = true;
            }
            angular.forEach($scope.selectedLedgers, function(item) {
                item.select = $scope.ledgerselectall;
            });

            $scope.UpdateAllLedgerToLocation();
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
    $scope.clearSearchforuser = function() {
        $scope.search_user.username = "";
    }
    $scope.clearSearchfordaybooks = function() {
        $scope.search_daybooks.name = "";
    }
    $scope.clearSearchforldgers = function() {
        $scope.search_ledgers.name = "";
    }
    $scope.validations = function() {
        $scope.showerrormessage = false;
        $scope.field = $scope.fields.none;
    }
    $scope.allValidationscheck = function(data) {
        if (data.display_name === undefined || data.display_name === "") {
            $scope.showerrormessage = true;
            $scope.field = $scope.fields.name;
            $scope.errormessage = "Please enter name";
            return true;
        }
        if (!data.mobile || data.mobile === undefined || data.mobile === "") {
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
        if (data.postal_code !== null && data.postal_code !== undefined && (data.postal_code.length > 0 && data.postal_code.length !== 6)) {
            $scope.showerrormessage = true;
            $scope.field = $scope.fields.zip;
            $scope.errormessage = "Please enter valid zip";
            return true;
        }
        if (data.fax !== null && data.fax !== undefined && (data.fax.length > 0 && data.fax.length !== 11)) {
            $scope.showerrormessage = true;
            $scope.field = $scope.fields.fax;
            $scope.errormessage = "Please enter valid fax";
            return true;
        }
        if (data.email !== null && data.email !== undefined && (data.email.length > 0 && !$scope.emailValidation(data.email))) {
            $scope.showerrormessage = true;
            $scope.field = $scope.fields.email;
            $scope.errormessage = "Please enter valid email address";
            return true;
        }
        if (data.gstin !== null && data.gstin !== undefined && (data.gstin.length > 0 && data.gstin.length !== 15 && !$scope.gstinValidations(data.gstin))) {
            $scope.showerrormessage = true;
            $scope.field = $scope.fields.gstin;
            $scope.errormessage = "Please enter valid gstin";
            return true;
        }
        if (data.tan !== null && data.tan !== undefined && (data.tan.length > 0 && data.tan.length !== 10 && !$scope.tanValidations(data.tan, data.gstin))) {
            $scope.showerrormessage = true;
            $scope.field = $scope.fields.tan;
            $scope.errormessage = "Please enter valid tan";
            return true;
        }
        return false;
    }
    $scope.emailValidation = function(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    $scope.gstinValidations = function(gstinVal) {
        var reggst = /^([0-9]){2}([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}([0-9]){1}([a-zA-Z]){1}([0-9]){1}?$/;
        return reggst.test(gstinVal);
    }
    $scope.tanValidations = function(tanVal, gstinVal) {
        var reggst = /^([a-zA-Z]){4}([0-9]){5}([a-zA-Z]){1}?$/;
        if (gstinVal !== null && gstinVal !== undefined && (gstinVal.length > 0 && gstinVal.length !== 15 && !$scope.gstinValidations(gstinVal))) {
            if (gstinVal.substr(5, 1) === tanVal.substr(3, 1)) {
                return reggst.test(tanVal);
            } else {
                return false;
            }
        } else {
            return reggst.test(tanVal);
        }
    }
    $scope.locationhistoryshow = function(location) {
        $scope.loctionid = {};
        $scope.histroyList = [];
        $scope.loctionid.id = location.id
        $scope.location_name = location.display_name;
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            $('#locationhistory').modal('show');
            if (result.data.error === undefined) {
                $scope.histroyList = result.data;
                $scope.loctionshistorytable = new NgTableParams({ count: $scope.histroyList.length }, { dataset: $scope.histroyList });
            } else {
                $scope.msg = result.data.error.message;
                $scope.addremovealert();
            }
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.post(domain + api + "location/history/", $scope.loctionid, config)
            .then(success, error);
    }
    $scope.dashboardAction = function(user) {
        if (user.status === 'I') {
            $scope.msg = "Access denied due to location inactive";
            $scope.addremovealert()
            return;
        }
        $rootScope.location_id = user.id;
        $rootScope.location_name = user.display_name;
        $rootScope.locat.display_name = user.display_name;
        $rootScope.balnc = "Profit & Loss";
        localStorageService.set("balnc", $rootScope.balnc);
        $rootScope.findingpndlreport();
        localStorageService.set("location_id", user.id);
        localStorageService.set("location_name", user.display_name);
        dataMove.setdatesData({})
        $rootScope.isSearched = false;
        localStorageService.set("isSearched", false);
        $rootScope.today1 = undefined;
        $rootScope.fromdate1 = undefined;
        $rootScope.startdate1 = undefined;
        $rootScope.startdate = undefined;
        $rootScope.today = undefined;
        $rootScope.fromdate = undefined;

        $state.go('balancesheet');
    }
    $scope.mobilebackButtonAction = function() {
        $state.go('company');
    }

});