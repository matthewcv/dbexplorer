(function () {
    "use strict";

    angular.element.prototype.is = function(selector) {
        var el = this[0];
        return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
    }


    angular.module('mcvDirectives', [])
        .controller('MruListController', ['$scope', 'localStorage', '$element', function ($scope, storage, $element) {

            var storageName ;

                $scope.$watch('item', function() {
                    var ngModel = $element.data('$ngModelController');
                    ngModel.$setViewValue($scope.item);
                    
                });

            $scope.items = [];
            $scope.item = "";
            $scope.showList = false;
            $scope.selectedIndex = -1;
            $scope.displayedItems = [];


            this.addOrSelectItem = function (item) {
                console.log("addOrSelectItem -" + $scope.selectedIndex);

                if (item && $scope.displayedItems.indexOf(item) >= 0) {
                    $scope.selectedIndex = $scope.displayedItems.indexOf(item);
                    return this.addOrSelectItem();
                }
                else if ($scope.selectedIndex > -1) {
                    $scope.item = $scope.displayedItems[$scope.selectedIndex];
                    $scope.showList = false;
                    $scope.selectedIndex = -1;
                    $scope.$apply();
                } else {
                    item = $scope.item.trim();
                    if ($scope.items.indexOf(item) < 0 && item.length) {
                        $scope.items.splice(0, 0, item);
                        storage.setItem(storageName, JSON.stringify($scope.items));
                        $scope.showList = false;
                        $scope.selectedIndex = -1;
                        $scope.$apply();
                    }
                }
            }

            this.init = function(attr) {
                storageName = "MruList-" + attr.mcvMruList;
                var storageItem = JSON.parse( storage.getItem(storageName));
                if (!storageItem || !angular.isArray(storageItem)) {
                    storageItem = [];
                    storage.setItem(storageName, JSON.stringify( storageItem));
                }

                $scope.items = storageItem;
            }

            this.moveSelection = function(up) {
                var lastIdx = $scope.displayedItems.length - 1;

                if (up) {
                    if ($scope.selectedIndex <= 0) {
                        $scope.selectedIndex = lastIdx;
                    }
                    else { $scope.selectedIndex--; }

                } else {
                    if ($scope.selectedIndex == lastIdx) {
                        $scope.selectedIndex = 0;
                    } else {
                        $scope.selectedIndex++;
                    }

                }
                console.log("moveSelection -" + $scope.selectedIndex);

                $scope.$apply();
            }

            this.deleteItem = function() {
                if ($scope.selectedIndex >= 0 && !$scope.item) {
                    console.log('deleting item');
                    $scope.items.splice($scope.selectedIndex, 1);
                    storage.setItem(storageName, JSON.stringify($scope.items));
                    if ($scope.selectedIndex == $scope.items.length) {
                        $scope.selectedIndex--;
                    }
                    $scope.$apply();
                }
            }

            //this.filterList = function(val) {
            //    console.log('filter list');
            //    console.dir($scope);
            //    if (val) {
            //        $scope.items = storageItem.filter(function(i) { return i.toUpperCase().indexOf(val.toUpperCase()) >=  0; });
            //    } else {
            //        $scope.items = storageItem;
            //    }
            //    $scope.$apply();
            //}

        }])

        .directive('mcvMruList', [ function () {
            //65-90, 48-57,40

            var mruEl = null;


            return {
                controller: 'MruListController',
                templateUrl: '/Content/Templates/mru-template.html',
                scope: {
                    select: '&onSelect',
                    placeholder: '@',
                    buttonText:'@'
                },
                require:['mcvMruList','ngModel'],
                link: function (scope, el, attr, ctrls) {
                    var ctrl = ctrls[0];
                    var ngModel = ctrls[1];
                    ctrl.init(attr);
                    var input = angular.element( el[0].querySelector("input[type='text']"));
                    var button =  angular.element(el[0].querySelector("input[type='button']"));
                    var list = angular.element(el[0].querySelector(".mru-list"));
                    list.css({ top: input[0].offsetHeight + "px", width: input[0].offsetWidth + "px" });

                    el.on('$destroy', function () {
                        el.off();
                        input.off();
                        button.off();
                    });

                    list.on('click', function (ev) {
                        var target = angular.element(ev.target);
                        if (target.is(".mru-item")) {
                            
                            ctrl.addOrSelectItem(target.scope().item);
                        }
                    });
                    input.on('dblclick', function(ev) {
                        if (!scope.showList) {
                            scope.showList = true;
                            scope.$apply();
                        }
                    }).on('blur', function() {
                        setTimeout(function() {
                            scope.showList = false;
                            scope.$apply();
                        }, 200);
                    }).on('keydown', function (ev) {
                        console.log("keydown -" + scope.selectedIndex + ", " + ev.keyCode);
                        if (ev.keyCode == 13) {
                            ctrl.addOrSelectItem();
                        } else if (ev.keyCode == 40 || ev.keyCode == 38) {
                            if (!scope.showList) {
                                scope.showList = true;
                                scope.$apply();
                            } else {
                                ctrl.moveSelection(ev.keyCode == 38);
                            }
                            ev.preventDefault();
                        } else if(ev.keyCode == 46) {
                            ctrl.deleteItem();
                        }


                        scope.showList = true;
                        //console.log(ev.keyCode + ": " + input.val());
                        
                    });
                }
            }
        }])

            .directive('mcvPager', function () {
                /*Pager directive.  generates the pager ui and invokes methods on the scope to change the page.
                Expects the scope to implement this interface:
                {
                    tableDataOptions:{
                        Page:<int>,  //what is the current page.  mcvPager will set this value when the user clicks on the UI and it will use this value to know what is the current page
                        PageSize:<int>,  //how many records per page 
                    }
                    getData:function(){} //a function that will go get the right page of data
                }
    
                the value bound to the mcvPager directive should be an object that has a 'Count' property that says the total count of all records.
                */
                return {

                    link: function (scope, el, attr) {
                        var container = el[0];
                        container.addEventListener('click', function (ev) {
                            if (ev.target && ev.target.attributes["data-page"]) {
                                scope.tableDataOptions.Page = parseInt(ev.target.attributes["data-page"].value);
                                scope.getData();
                            }
                        });
                        scope.$watch(attr.mcvPager, function (val) {
                            if (val && val.Count) {
                                while (container.lastChild) {
                                    container.removeChild(container.lastChild);
                                }
                                var ps = scope.tableDataOptions.PageSize;
                                var total = Math.floor(val.Count / ps);
                                if (val.Count % ps) total++;

                                container.appendChild(getUi(total, scope.tableDataOptions.Page));
                            }
                        });
                    }
                }
            })
.factory('localStorage',function() {
            return window.localStorage;
        })
    ;


    function getUi(totalPages, currentPage) {
        var frag = document.createDocumentFragment();
        frag.appendChild(document.createTextNode("Page " + currentPage + " of " + totalPages));

        var leftNode = spanOrA(currentPage == 1, currentPage - 1, " <<< ");
        frag.appendChild(leftNode);

        var rightNode = spanOrA(currentPage == totalPages, currentPage + 1, " >>> ");
        frag.appendChild(rightNode);

        return frag;
    }

    function spanOrA(span, pageAttr, text) {
        var el = document.createElement(span ? "span" : "a");
        el.setAttribute('data-page', pageAttr);
        el.appendChild(document.createTextNode(text));
        return el;
    }

})();