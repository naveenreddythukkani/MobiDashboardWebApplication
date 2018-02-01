var QTable = angular.module('mobiDashBoardApp');
QTable.controller('vouchersettingsCntl', function($scope, $state, $rootScope, $stateParams, $http, domain, api, $timeout, core, localStorageService, NgTableParams, session, $filter, $timeout) {
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
    $rootScope.activeTab = 10;
    $rootScope.patnerstab = false;
    $rootScope.logintab = false;
    $rootScope.backuptab = false;
    $rootScope.showCompanyname = false;
    $rootScope.balancesheetbreadcurmbs = false;
    $rootScope.voucherstab = true;
    $rootScope.downloadstab = false;

    $rootScope.addloc = false;
    $rootScope.addclient = false;
    $rootScope.contactus = false;
    $rootScope.adduser = false;
    $rootScope.addrole = false;
    $rootScope.addvouchertype = true;

    $scope.active = 'yearly';
    $scope.voucherFields = {};
    $scope.voucherFields.isTypeselected = false;
    $scope.voucherFields.isLocationSelected = false;
    $scope.voucherFields.isDayBookAllowed = false;
    $scope.voucherFields.isStoresAllowed = false;
    $scope.voucherFields.isDayBookShow = false;
    $scope.voucherFields.isStoresShow = false;
    $scope.voucherFields.isBType = false;
    $scope.voucherFields.isCType = false;
    $scope.samplePrefix = false;

    $scope.voucherSubmit = {};
    var editPosition = 0;
    var isPrefixValid = true;
    var typeIndex = 0;


    $scope.voucherSubmit.sep1 = '';
    $scope.voucherSubmit.sep2 = '';
    $scope.voucherSubmit.startNo = 1;
    console.log("VoucherSetting ctrl", "fire");
    $scope.field = [];
    $scope.fields = {
        "type": 0,
        "name": 1,
        "location": 2,
        "daybook": 3,
        "store": 4,
        "prefix": 5,
        "sep1": 6,
        "rotation": 7,
        "sep2": 8,
        "startNo": 9
    }


    $scope.search = function() {
        if ($scope.searchEnable) {
            $scope.searchEnable = false;
        } else {
            $scope.searchEnable = true;
            $timeout(function() {
                $('[name="vou_type"]').focus();
            }, 50);
        }
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
    $scope.getAllVoucherTypes = function() {
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            if (result.data.error !== undefined) {
                $scope.msg = result.data.error.message;
                $scope.addremovealert();
            } else {
                if (result.data.length === 0) {
                    session.sessionexpried("No Data");
                }
                $scope.vouchersdata = result.data;
                // console.log("AllVouchers",JSON.parse($scope.vouchersdata));
                $scope.multivouchertable = new NgTableParams({ count: $scope.vouchersdata.length }, { dataset: $scope.vouchersdata });
            }
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + api + "voucherprefix/", config)
            .then(success, error);
    }
    $scope.getAllVoucherTypes();
    $scope.showpreifixOptions = function(change) {
        if (change === 'Y') {
            return "Yearly"
        } else if (change === 'M') {
            return "Monthly"
        } else if (change === 'D') {
            return "Daily"
        }
    }


    $scope.addremovealert = function() {
        $("#success-alert").addClass('in');
        $("#success-alert").fadeTo(2000, 500).slideUp(500, function() {
            $("#success-alert").removeClass('in');
        });
    }

    $rootScope.addvouchertype = function() {
        editPosition = -1; //To tell it is add voucher
        $("#addvochertype").modal('show');
        $scope.getVoucherTypes('add');
    }

    $rootScope.editVoucherModel = function(position) {
        editPosition = position;
        console.log("editVoucherModel", "fire", position);
        $("#editvochertype").modal('show');
        $scope.getVoucherTypes('edit');
    }


    var editFunction = function() {
        var saveData = $scope.vouchersdata[editPosition];
        console.log("SaveData", saveData);

        $scope.voucherSubmit.editVoucherId = saveData.id;
        if (saveData.display_name != null) {
            $scope.voucherSubmit.name = saveData.display_name;
        }

        $scope.voucherSubmit.sep1 = saveData.separator1;


        if (saveData.variable_prefix != null) {
            $scope.voucherSubmit.rotation = saveData.variable_prefix;
        }

        $scope.voucherSubmit.sep2 = saveData.separator2;


        if (saveData.prefix != null) {
            $scope.voucherSubmit.prefix = saveData.prefix;
        }
        if (saveData.start_no != null) {
            $scope.voucherSubmit.startNo = saveData.start_no;
        }

        if (saveData.vou_type_id != null) {
            $scope.voucherSubmit.typeData = saveData.vou_type_id;
            $scope.typeDataSelect($scope.voucherSubmit.typeData);
        }

        if (saveData.location_id != null) {
            $scope.voucherSubmit.locationData = saveData.location_id;
            $scope.showDetails($scope.voucherSubmit.locationData);
        }

        if (saveData.daybook_id != null) {
            $scope.voucherSubmit.dayBookId = saveData.daybook_id;
            $scope.validations();
        }

        if (saveData.store_id != null) {
            $scope.voucherSubmit.storeSelect = saveData.store_id;
            $scope.validations();
        }

        $scope.setActive($scope.showpreifixOptions(saveData.prefix_options));
        $scope.voucherSubmit.allowId = saveData.allow_manual_id;
        $scope.voucherSubmit.reNumber = saveData.renumber;
        $scope.voucherSubmit.printVoucher = saveData.print_voucher;

        $scope.prefixValidation();
    }

    $scope.cancelForm = function() {
        $scope.clearScopeData();
        $("#editvochertype").modal('hide');
        $("#addvochertype").modal('hide');
        $scope.field = "";
        $scope.showerrormessage = false;
    }

    $scope.voucherHistoryShow = function(voucher) {
        $scope.voucherId = {};
        $scope.histroyList = [];
        $scope.voucherId.id = voucher.id
        $scope.display_name = voucher.display_name;
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            if (result.data.error !== undefined) {
                $scope.msg = result.data.error.message;
                $scope.addremovealert();
            } else {
                $('#voucherhistory').modal('show');
                $scope.histroyList = result.data;
                $scope.loctionshistorytable = new NgTableParams({ count: $scope.histroyList.length }, { dataset: $scope.histroyList });
            }
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.post(domain + api + "voucherprefix/history/", $scope.voucherId, config)
            .then(success, error);
    }

    $scope.getVoucherTypes = function(arg) {
        $scope.loading = true;

        var success = function(result) {
            $scope.loading = false;
            if (result.data.error !== undefined) {
                $scope.msg = result.data.error.message;
                $scope.addremovealert();
            } else {
                console.log("getVoucherTypes", JSON.stringify(result));
                var filetrData = [];
                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].status === 'A') {
                        filetrData.push(result.data[i])
                    }
                }
                $scope.selectedTypes = filetrData;
                $scope.getAllLoations(arg);
            }
        }

        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + api + "vouchertypes/", config)
            .then(success, error);

    }

    $scope.typeDataSelect = function(data) {
        console.log("typeDataSelect", data);
        $scope.validations();
        if ($scope.selectedTypes && data) {
            for (var i = 0; i < $scope.selectedTypes.length; i++) {
                if ($scope.selectedTypes[i].id === parseInt(data)) {
                    typeIndex = i;
                    break;
                }
            }
            $scope.voucherSubmit.type = $scope.selectedTypes[typeIndex].id;
            for (var j = 0; j < $scope.typeBCArray.length; j++) {
                $scope.voucherFields.isTypeselected = true;
                if ($scope.typeBCArray[j].name === $scope.selectedTypes[typeIndex].vou_type) {
                    if ($scope.selectedTypes[typeIndex].vou_type == 'BR' || $scope.selectedTypes[typeIndex].vou_type == 'BP') {
                        console.log("BANK", "FIRE");
                        $scope.voucherFields.isBType = true;
                        $scope.voucherFields.isCType = false;
                        $scope.voucherFields.isDayBookAllowed = true;
                        $scope.voucherFields.isStoresAllowed = false;
                        $scope.voucherFields.isStoresShow = false;
                    } else if ($scope.selectedTypes[typeIndex].vou_type == 'CR' || $scope.selectedTypes[typeIndex].vou_type == 'CP') {
                        console.log("CASH", "FIRE");
                        $scope.voucherFields.isCType = true;
                        $scope.voucherFields.isBType = false;
                        $scope.voucherFields.isDayBookAllowed = true;
                        $scope.voucherFields.isStoresAllowed = false;
                        $scope.voucherFields.isStoresShow = false;
                    } else if ($scope.selectedTypes[typeIndex].vou_type == 'SR' ||
                        $scope.selectedTypes[typeIndex].vou_type == 'SI' ||
                        $scope.selectedTypes[typeIndex].vou_type == 'RR' ||
                        $scope.selectedTypes[typeIndex].vou_type == 'IR' ||
                        $scope.selectedTypes[typeIndex].vou_type == 'TI' ||
                        $scope.selectedTypes[typeIndex].vou_type == 'TO') {
                        console.log("STORE", "FIRE");
                        $scope.voucherFields.isStoresAllowed = true;
                        $scope.voucherFields.isDayBookAllowed = false;
                        $scope.voucherFields.isDayBookShow = false;
                    }
                    break;
                } else {
                    console.log("NOthing", "FIRE");
                    $scope.voucherFields.isDayBookAllowed = false;
                    $scope.voucherFields.isBType = false;
                    $scope.voucherFields.isCType = false;
                    $scope.voucherFields.isStoresAllowed = false;
                    $scope.voucherFields.isDayBookShow = false;
                    $scope.voucherFields.isStoresShow = false;
                }
            }

            if ($scope.voucherFields.isLocationSelected) {
                console.log("isLocationSelectedAlert", $scope.voucherSubmit.locationData);
                $scope.showDetails($scope.voucherSubmit.locationData);
            }

        }
    }

    $scope.getAllLoations = function(arg) {
        $scope.loading = true;
        var success = function(result) {
            $scope.loading = false;
            if (result.data.error !== undefined) {
                $scope.msg = result.data.error.message;
                $scope.addremovealert();
            } else {
                $scope.selectedLocations = result.data;
                if (arg === 'edit') {
                    editFunction();
                }
            }
        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.get(domain + api + "location/", config)
            .then(success, error);
    }


    $scope.showDetails = function(location) {
        $scope.validations();
        if (location) {
            $scope.voucherFields.isLocationSelected = true;
            if ($scope.voucherFields.isDayBookAllowed) {
                // console.log("DayBook","fire");
                $scope.getdaybooks(location);
                $scope.voucherFields.isDayBookShow = true;
            } else if ($scope.voucherFields.isStoresAllowed) {
                $scope.getAllStores(location);
                $scope.voucherFields.isStoresShow = true;
            } else {
                $scope.voucherFields.isDayBookShow = false;
                $scope.voucherFields.isStoresShow = false;
            }
        }
    }


    $scope.getdaybooks = function(location) {
        if (location) {
            console.log("LocationId", location);
            $scope.loading = true;
            $scope.isLocationSelected = true;
            var success = function(result) {
                $scope.loading = false;
                if (result.data.error !== undefined) {
                    $scope.msg = result.data.error.message;
                    $scope.addremovealert();
                } else {
                    var filterData = [];
                    for (var i = 0; i < result.data.length; i++) {
                        if ($scope.voucherFields.isBType && result.data[i].ltype === 'B' && result.data[i].status === 'A') {
                            filterData.push(result.data[i]);
                        } else if ($scope.voucherFields.isCType && result.data[i].ltype === 'C' && result.data[i].status === 'A') {
                            filterData.push(result.data[i]);
                        }
                    }
                    $scope.selectedDaybooks = filterData;
                }

            }
            var error = function(result) {
                $scope.loading = false;
                session.sessionexpried(result.status);
            }

            $http.get(domain + api + "location/" + location + "/assigned_daybook/", config)
                .then(success, error);
        }
    }


    $scope.getAllStores = function(location) {
        $scope.loading = true;
        var obj = { "location_id": location }
        var success = function(result) {
            $scope.loading = false;
            if (result.data.error !== undefined) {
                $scope.msg = result.data.error.message;
                $scope.addremovealert();
            } else {
                var filterData = [];
                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].status === 'A') {
                        filterData.push(result.data[i]);
                    }
                }
                $scope.selectedStores = filterData;
            }

        }
        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }
        $http.post(domain + api + "store/location_stores/", obj, config)
            .then(success, error);

    }

    $scope.setActive = function(type) {
        $scope.active = type;
    };
    $scope.setActive("Yearly");

    $scope.isActive = function(type) {
        // console.log("isActive", type);
        return type === $scope.active;
    };

    $scope.sepratorValid = function(eve) {
        console.log("keycode", eve.keyCode, eve.target.value);
        console.log("keycodeValue", eve.key);
        var key = eve.keyCode;
        var value = parseInt(eve.key);

        if (value >= 0 || value <= 9) {
            eve.preventDefault();
            return true
        }

        if ((key < 48 || key > 57) && (key < 187 || key > 192) && (key < 219 || key > 222) && key != 106 && key != 111 && key != 8 && key != 37 && key != 39) {
            eve.preventDefault();
            return true
        }
    }



    $scope.validations = function() {
        $scope.field[0] = "";
        $scope.showerrormessage = false;
    }


    $scope.AllVoucherValidations = function() {

        $scope.showerrormessage = false;
        var data = $scope.voucherSubmit;
        var url = "voucherprefix/";
        var submitObj = {};

        if (editPosition != -1) {
            url = "voucherprefix/" + $scope.voucherSubmit.editVoucherId + "/modify/";
        }

        if (data.type === undefined) {
            $scope.field[0] = $scope.fields.type;
            $scope.showerrormessage = true;
            $scope.errormessage = "Please select Type.";
            return true;
        }
        if (data.locationData == undefined) {
            $scope.field[0] = $scope.fields.location;
            $scope.showerrormessage = true;
            $scope.errormessage = "Please select Location";
            return true;
        }


        submitObj.vou_type_id = $scope.voucherSubmit.type;
        submitObj.location_id = $scope.voucherSubmit.locationData;

        if ($scope.selectedTypes[typeIndex].vou_type === 'BR' ||
            $scope.selectedTypes[typeIndex].vou_type === 'BP' ||
            $scope.selectedTypes[typeIndex].vou_type === 'CR' ||
            $scope.selectedTypes[typeIndex].vou_type === 'CP') {
            if (data.dayBookId === undefined || data.dayBookId === null) {
                $scope.field[0] = $scope.fields.daybook;
                $scope.showerrormessage = true;
                $scope.errormessage = "Please select Daybook";
                return true;
            }
            submitObj.gl_id = data.dayBookId;
        }


        if ($scope.selectedTypes[typeIndex].vou_type === 'SR' ||
            $scope.selectedTypes[typeIndex].vou_type === 'SI' ||
            $scope.selectedTypes[typeIndex].vou_type === 'RR' ||
            $scope.selectedTypes[typeIndex].vou_type === 'IR' ||
            $scope.selectedTypes[typeIndex].vou_type === 'TI' ||
            $scope.selectedTypes[typeIndex].vou_type === 'TO') {

            if (data.storeSelect === undefined || data.storeSelect === null) {
                $scope.field[0] = $scope.fields.store;
                $scope.showerrormessage = true;
                $scope.errormessage = "Please select Store";
                return true;
            }
            submitObj.store_id = data.storeSelect;

        }

        if (!isPrefixValid) {
            $scope.showerrormessage = true;
            $scope.errormessage = "Voucher prefix should be of maximum 10 characters.";
            return true;
        }


        $scope.loading = true;

        if (data.name != undefined) {
            submitObj.display_name = data.name;
        }

        if (data.startNo != undefined) {
            submitObj.start_no = data.startNo;
        }

        if (data.sep1 != undefined) {
            submitObj.separator1 = data.sep1;
        }


        if (data.sep2 != undefined) {
            submitObj.separator2 = data.sep2;
        }

        if (data.prefix != undefined) {
            submitObj.prefix = data.prefix;
        }

        if (data != undefined) {
            submitObj.variable_prefix = data.rotation;
        }

        switch ($scope.active) {
            case 'daily':
                submitObj.prefix_options = 'D';
                break;
            case 'monthly':
                submitObj.prefix_options = 'M';
                break;
            case 'yearly':
                submitObj.prefix_options = 'Y';
                break;
        }

        submitObj.allow_manual_id = $scope.voucherSubmit.allowId;
        submitObj.renumber = $scope.voucherSubmit.reNumber;
        submitObj.print_voucher = $scope.voucherSubmit.printVoucher;

        var success = function(result) {
            $scope.loading = false;
            console.log("voucherprefix", JSON.stringify(result));
            if (result.data.error === undefined) {
                if (editPosition != -1) {
                    $scope.msg = "Voucher edited successfully";
                } else {
                    $scope.msg = "Voucher added successfully";
                }
                $scope.cancelForm();
                $scope.addremovealert();
                $scope.clearScopeData();
                $scope.getAllVoucherTypes();
                $scope.addremovealert();
            } else {
                $scope.msg = result.data.error.message;
                $scope.showerrormessage = true;
                $scope.errormessage = result.data.error.message;
                $scope.addremovealert();
                return true;
            }
        }


        var error = function(result) {
            $scope.loading = false;
            session.sessionexpried(result.status);
        }

        $http.post(domain + api + url, submitObj, config)
            .then(success, error);
    }


    $scope.restrictData = function() {
        $scope.field = [];
        $scope.showerrormessage = false;
        var prefix = $scope.voucherSubmit.prefix;
        var sep1 = $scope.voucherSubmit.sep1;
        var sep2 = $scope.voucherSubmit.sep2;
        var rotation = $scope.voucherSubmit.rotation;

        if (prefix === undefined || prefix === null) {
            prefix = "";
        }
        if (sep1 === null || sep1 === undefined) {
            sep1 = "";
        }
        if (sep2 === null || sep2 === undefined) {
            sep2 = "";
        }

        if (rotation != $scope.rotationPolicy[0].name) {
            console.log("rotation name" + rotation);
            console.log("rotation.length" + rotation.length);
            var rotationLength = rotation.length;

            $scope.errormessage = "Voucher prefix should be of maximum 10 characters.";
            switch (rotationLength) {
                case 5:
                    if (prefix.length >= 4 && sep1.length === 1 && sep2.length === 1) {
                        $scope.showerrormessage = true;
                        isPrefixValid = false;
                        $scope.field[0] = $scope.fields.prefix;
                        $scope.field[1] = $scope.fields.sep1;
                        $scope.field[3] = $scope.fields.sep2;
                    } else if (prefix.length >= 5 && sep1.length === 1) {
                        $scope.showerrormessage = true;
                        isPrefixValid = false;
                        $scope.field[0] = $scope.fields.prefix;
                        $scope.field[1] = $scope.fields.sep1;
                    } else if (prefix.length >= 5 && sep2.length === 1) {
                        $scope.showerrormessage = true;
                        isPrefixValid = false;
                        $scope.field[0] = $scope.fields.prefix;
                        $scope.field[3] = $scope.fields.sep2;
                    } else if (prefix.length >= 5) {
                        $scope.showerrormessage = true;
                        isPrefixValid = false;
                        $scope.field[0] = $scope.fields.prefix;
                    } else {
                        isPrefixValid = true;
                    }
                    break;
                case 7:

                    if (prefix.length >= 2 && sep1.length === 1 && sep2.length === 1) {
                        $scope.showerrormessage = true;
                        isPrefixValid = false;
                        $scope.field[0] = $scope.fields.prefix;
                        $scope.field[1] = $scope.fields.sep1;
                        $scope.field[3] = $scope.fields.sep2;
                    } else if (prefix.length >= 3 && sep1.length === 1) {
                        $scope.showerrormessage = true;
                        isPrefixValid = false;
                        $scope.field[0] = $scope.fields.prefix;
                        $scope.field[1] = $scope.fields.sep1;
                    } else if (prefix.length >= 3 && sep2.length === 1) {
                        $scope.showerrormessage = true;
                        isPrefixValid = false;
                        $scope.field[0] = $scope.fields.prefix;
                        $scope.field[3] = $scope.fields.sep2;
                    } else if (prefix.length >= 3) {
                        $scope.showerrormessage = true;
                        isPrefixValid = false;
                        $scope.field[0] = $scope.fields.prefix;
                    } else {
                        isPrefixValid = true;
                    }
                    break
                case 8:
                    if (prefix.length >= 1 && sep1.length === 1 && sep2.length === 1) {
                        $scope.showerrormessage = true;
                        isPrefixValid = false;
                        $scope.field[0] = $scope.fields.prefix;
                        $scope.field[1] = $scope.fields.sep1;
                        $scope.field[3] = $scope.fields.sep2;
                    } else if (prefix.length >= 2 && sep1.length === 1) {
                        $scope.showerrormessage = true;
                        isPrefixValid = false;
                        $scope.field[0] = $scope.fields.prefix;
                        $scope.field[1] = $scope.fields.sep1;
                    } else if (prefix.length >= 2 && sep2.length === 1) {
                        $scope.showerrormessage = true;
                        isPrefixValid = false;
                        $scope.field[0] = $scope.fields.prefix;
                        $scope.field[3] = $scope.fields.sep2;
                    } else if (prefix.length >= 2) {
                        $scope.showerrormessage = true;
                        isPrefixValid = false;
                        $scope.field[0] = $scope.fields.prefix;
                    } else {
                        isPrefixValid = true;
                    }
                    break;
                case 9:
                    if (prefix.length >= 1 && sep1.length === 1 && sep2.length === 1) {
                        $scope.showerrormessage = true;
                        isPrefixValid = false;
                        $scope.field[0] = $scope.fields.prefix;
                        $scope.field[1] = $scope.fields.sep1;
                        $scope.field[3] = $scope.fields.sep2;
                    } else if (prefix.length >= 1 && sep1.length === 1) {
                        $scope.showerrormessage = true;
                        isPrefixValid = false;
                        $scope.field[0] = $scope.fields.prefix;
                        $scope.field[1] = $scope.fields.sep1;
                    } else if (prefix.length >= 1 && sep2.length === 1) {
                        $scope.showerrormessage = true;
                        isPrefixValid = false;
                        $scope.field[0] = $scope.fields.prefix;
                        $scope.field[3] = $scope.fields.sep2;
                    } else if (prefix.length > 1) {
                        $scope.showerrormessage = true;
                        isPrefixValid = false;
                        $scope.field[0] = $scope.fields.prefix;
                    } else if (sep1.length === 1 && sep2.length === 1) {
                        $scope.showerrormessage = true;
                        isPrefixValid = false;
                        $scope.field[1] = $scope.fields.sep1;
                        $scope.field[3] = $scope.fields.sep2;
                    } else {
                        isPrefixValid = true;
                    }
                    break;
            }

        } else {
            if (prefix.length >= 10 && sep1.length === 1 && sep2.length === 1) {
                $scope.showerrormessage = true;
                isPrefixValid = false;
                $scope.field[0] = $scope.fields.prefix;
                $scope.field[1] = $scope.fields.sep1;
                $scope.field[3] = $scope.fields.sep2;
            } else if (prefix.length > 10 && sep1.length === 1) {
                $scope.showerrormessage = true;
                isPrefixValid = false;
                $scope.field[0] = $scope.fields.prefix;
                $scope.field[1] = $scope.fields.sep1;
            } else if (prefix.length > 10 && sep2.length === 1) {
                $scope.showerrormessage = true;
                isPrefixValid = false;
                $scope.field[0] = $scope.fields.prefix;
                $scope.field[3] = $scope.fields.sep2;
            } else {
                isPrefixValid = true;
            }
        }

    }

    $scope.prefixValidation = function() {
        var mainPrefix = "Preview   : ";
        var prefix = $scope.voucherSubmit.prefix;
        var sep1 = $scope.voucherSubmit.sep1;
        var sep2 = $scope.voucherSubmit.sep2;
        var rotation = $scope.voucherSubmit.rotation;
        var todayDate = new Date();
        var date = todayDate.getDate();
        var month = todayDate.getMonth() + 1;
        var fullYear = todayDate.getFullYear();
        var year = fullYear.toString().substr(2, 2);
        if (date < 10) {
            date = '0' + date;
        }
        if (month < 10) {
            month = '0' + month;
        }

        if (prefix === undefined || prefix === null) {
            prefix = "";
        }
        if (sep1 === null || sep1 === undefined) {
            sep1 = "";
        }
        if (sep2 === null || sep2 === undefined) {
            sep2 = "";
        }
        switch (rotation) {
            case $scope.rotationPolicy[0].name:
                //"None"
                mainPrefix = mainPrefix + prefix + sep1 + sep2;
                break;
            case $scope.rotationPolicy[1].name:
                // "dd/mm"
                var selectDate = date + "/" + month;
                console.log(date + "/" + month);
                mainPrefix = mainPrefix + prefix + sep1 + selectDate + sep2;

                break;
            case $scope.rotationPolicy[2].name:
                // "mmm/by-ey"
                var by = "";
                var ey = "";
                if (month > 3) {
                    var by = year;
                    var ey = parseInt(year) + 1;
                } else {
                    var by = parseInt(year) - 1;
                    var ey = year;
                }
                var filt = $filter("date")(todayDate, "medium").substr(0, 3);
                console.log(filt + "/" + by + "-" + ey);
                mainPrefix = mainPrefix + prefix + sep1 + filt + "/" + by + "-" + ey + sep2;
                break;
            case $scope.rotationPolicy[3].name:
                // "mm/by-ey"
                var by = "";
                var ey = "";
                if (month > 3) {
                    var by = year;
                    var ey = parseInt(year) + 1;
                } else {
                    var by = (parseInt(year) - 1);
                    var ey = year;
                }
                // var filt = $filter("date")(todayDate, "medium").substr(0, 3);
                console.log(filt + "/" + by + "-" + ey);
                mainPrefix = mainPrefix + prefix + sep1 + month + "/" + by + "-" + ey + sep2;
                break;
            case $scope.rotationPolicy[4].name:
                // "name": "mm/yy"
                console.log(month + "/" + year);
                var selectDate = month + "/" + year;
                mainPrefix = mainPrefix + prefix + sep1 + selectDate + sep2;
                break;
            case $scope.rotationPolicy[5].name:
                // "mm/yyyy"
                console.log(month + "/" + fullYear);
                var selectDate = month + "/" + fullYear;
                mainPrefix = mainPrefix + prefix + sep1 + selectDate + sep2;
                break;
        }

        if ($scope.voucherSubmit.startNo != undefined) {
            mainPrefix = mainPrefix + $scope.voucherSubmit.startNo;
        }

        $scope.mainPrefix = mainPrefix;
        console.log("mainPrefix", $scope.mainPrefix);
        $scope.samplePrefix = true;
        $scope.restrictData();
    }

    $scope.clearScopeData = function() {
        $scope.voucherSubmit = {}; //Clearing scope data.
        $scope.voucherFields = {};
        // $scope.voucherSubmit.sep1 = '';
        // $scope.voucherSubmit.sep2 = '';
        $scope.voucherSubmit.startNo = 1;
        $scope.samplePrefix = false;

        $scope.voucherSubmit.rotation = 'None';
    };

    $scope.typeBCArray = [{
        "name": "BR"
    }, {
        "name": "CR"
    }, {
        "name": "BP"
    }, {
        "name": "CP"
    }, {
        "name": "SR"
    }, {
        "name": "SI"
    }, {
        "name": "RR"
    }, {
        "name": "IR"
    }, {
        "name": "TI"
    }, {
        "name": "TO"
    }]
    $scope.vouchermodifcationsdata = [{
            "name": "Allow user to specify voucher id manually"
        },
        {
            "name": "Re number subsequent vouchers, if a new voucher is inserted in between vouchers"
        },
        {
            "name": "Allow user to print voucher after creation"
        }
    ]
    $scope.rotationPolicy = [{
        "name": "None"
    }, {
        "name": "dd/mm"
    }, {
        "name": "mmm/by-ey"
    }, {
        "name": "mm/by-ey"
    }, {
        "name": "mm/yy"
    }, {
        "name": "mm/yyyy"
    }]

    $scope.separators = [{
        "name": ""
    }, {
        "name": "\\"
    }, {
        "name": "-"
    }]
});