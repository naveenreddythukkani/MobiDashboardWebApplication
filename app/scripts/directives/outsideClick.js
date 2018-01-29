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

MobiDash.directive('mobileValidation', function($window, $parse) {
    return {
        link: function(scope, el, attr) {
            var ctrlDown = false;
            var ctrlKey = 17; var vKey = 86; var cKey = 67;
            var cmdKey = 91;
            el.bind("keyup", function(event) {
                 if ((event.keyCode == ctrlKey)|| (event.keyCode == cmdKey)){
                     ctrlDown = false;
                   }
             });
            el.bind("keydown", function(event) {
                 if ((event.keyCode == ctrlKey) || (event.keyCode == cmdKey)){
                     ctrlDown = true;
                   }
                   if ((event.keyCode < 48 || event.keyCode > 57)
                    && (event.keyCode < 96 || event.keyCode > 105)
                    && (event.keyCode != 8)
                    && (event.keyCode != 46)
                    && (event.keyCode != 37)
                    && (event.keyCode != 39)
                    &&(event.keyCode != 9)
                    &&!(ctrlDown && (event.keyCode == 86 || event.keyCode == 88 || event.keyCode == 67 || event.keyCode == 82))) {
                          event.preventDefault();
                   }
            });
            el.bind("paste", function(event) {
              setTimeout(function(){
                  var value=el.val();
                  value=value.replace(/\D/g,'');
                  el.val(value);
              }, 4);
              });
            }
            }
});
MobiDash.directive('fixedTableHeaders', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $timeout(function() {
                container = element.parentsUntil(attrs.fixedTableHeaders);
                element.stickyTableHeaders({ scrollableArea: container, "fixedOffset": 0 });
            }, 0);
        }
    }
}]);
