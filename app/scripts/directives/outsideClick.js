var MobiDash = angular.module('mobiDashBoardApp');
MobiDash.directive("outsideClick", ['$document', function($document) {
    return {
        link: function($scope, $element, $attributes) {
            var scopeExpression = $attributes.outsideClick;
            var onDocumentClick = function(event) {
                console.log(event.target.id);
                if (event.target.id != 'clientsdata' || event.target.id != 'dropdownMenuhideshow') {
                    $scope.$apply(scopeExpression);
                }
            };
            $document.on("click", onDocumentClick);
            $element.on('$destroy', function() {
                $document.off("click", onDocumentClick);
            });
        }
    }
}]);
MobiDash.directive("messageAlert", function() {
    return {
        template: '<div class="alert  alert-position-success" id="success-alert" style="display:none;"><strong>{{msg}}</strong></div>',
        restrict: 'E',
        $scope: true,
        link: function($scope, $timeout) {
            if ($scope.loadmsg) {
                $timeout(function() {
                    $("#success-alert").addClass('in');
                    $("#success-alert").fadeTo(2000, 500).slideUp(500, function() {
                        $("#success-alert").removeClass('in');
                    });
                }, 50);
            }
        }
    };
});

MobiDash.directive('mobileValidation', function() {
    return {
        link: function(scope, el, attr) {
            el.bind("keydown", function(event) {
                //ignore all characters that are not numbers, except backspace, delete, left arrow and right arrow
                if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 97 || event.keyCode > 105) && event.keyCode != 8 && event.keyCode != 46 && event.keyCode != 37 && event.keyCode != 39 && event.keyCode != 9) {
                    event.preventDefault();
                }
            });
        }
    }
});