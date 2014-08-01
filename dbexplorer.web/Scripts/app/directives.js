(function () {
    "use strict";
    angular.module('mcvDirectives', [])
        .controller('MruListController', ['$scope', function ($scope) {

            var storage = window.localStorage;
            var storageName;
            var storageItem;

           
            
            $scope.items = [];


            this.addItem = function(item) {
                if (storageItem.indexOf(item) < 0) {
                    storageItem.splice(0, 0, item);
                    storage.setItem(storageName, JSON.stringify(storageItem));
                }
            }

            this.init = function(attr) {
                storageName = "MruList-" + attr.mcvMruList;
                
                storageItem = JSON.parse( storage.getItem(storageName));
                if (!storageItem || !angular.isArray(storageItem)) {
                    storageItem = [];
                    storage.setItem(storageName, JSON.stringify( storageItem));
                }

            }

            this.filterList = function(val)
            {
                if (val) {
                    $scope.items = storageItem.filter(function(i) { return i.toUpperCase().indexOf(val.toUpperCase()) >=  0; });
                } else {
                    $scope.items = storageItem;
                }
                $scope.$apply();
            }

        }])

        .directive('mcvMruList', ['$compile', function ($compile) {
            //65-90, 48-57,40

            var mruEl = null;

            function makeMruEl(el, ctrl, $scope) {
                mruEl = angular.element("<div ng-hide='items.length == 0'><ul><li ng-repeat='item in items'>{{item}}</li></ul></div>").css({  width: el[0].offsetWidth + 'px', position: 'absolute', top: el[0].offsetHeight + 'px', left: '0', zIndex: 100 });


                el.parent().append(mruEl);
                $compile(mruEl)($scope);

            }

            return {
                controller: 'MruListController',
                link: function (scope, el, attr, ctrl) {
                    ctrl.init(attr);
                    console.dir(['mcvMruList', arguments]);
                    makeMruEl(el, ctrl, scope);
                    el.on('$destroy', function () {
                        console.dir('destroy');
                        el.off();
                    });

                    el.on('keyup', function (ev) {
                        
                        console.log(ev.keyCode + ": " + el.val());
                        if (ev.keyCode == 13) {
                            ctrl.addItem(el.val());
                        }
                        ctrl.filterList(el.val());
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
            });


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