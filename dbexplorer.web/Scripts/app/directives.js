(function () {
    "use strict";
    angular.module('mcvDirectives', [])
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
                    container.addEventListener('click', function(ev) {
                        console.dir(ev);
                        if (ev.target && ev.target.attributes["data-page"]) {
                            scope.tableDataOptions.Page = parseInt(ev.target.attributes["data-page"].value);
                            scope.getData();
                        }
                    });
                    scope.$watch(attr.mcvPager, function(val) {
                        if (val && val.Count) {
                            while (container.lastChild) {
                                container.removeChild(container.lastChild);
                            }
                            var ps = scope.tableDataOptions.PageSize;
                            var total = Math.floor( val.Count / ps);
                            if (val.Count % ps) total++;

                            container.appendChild(getUi(total, scope.tableDataOptions.Page));
                        }
                    });
                }
            }
        })
    .directive('mcvMruList', function () {
        function showMruList(el) {

            $('<div />').addClass('panel').css({ height: '50px', width: el.outerWidth() +'px', position: 'absolute', top: el.outerHeight() +'px', left: '0', zIndex:100 }).appendTo(el.parent());
        }

            return {
                link:function(scope, el, attr) {
                    console.dir(['mcvMruList', scope, el, attr]);

                    el.on('$destroy', function () {
                        console.dir('destrouy');
                        el.off();
                    });

                    el.on('keyup', function(ev) {
                        if (ev.keyCode == 13) {
                            showMruList(el);
                        }
                    });
                }
            }
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