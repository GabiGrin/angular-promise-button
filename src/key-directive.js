//(function () {
//  'use strict';
//  angular.module('gg.promise-button')
//    .directive('promiseButtonKey', function (PromiseButton, $timeout, $compile) {
//      return {
//        restrict: 'A',
//        link: function (scope, elem, attrs) {
//          var key = attrs.promiseButtonKey;
//          var opts = PromiseButton.getOptionsForKey(key);
//          var originalHtml = elem.html();
//          var eventPrefix = 'promiseButton.' + key + '.';
//
//          scope.$on(eventPrefix + 'loading', function () {
//
//            elem.html(opts.loadingTemplate);
//            elem.attr('disabled', true);
//          });
//
//          scope.$on(eventPrefix + 'success', function () {
//            finalize(true);
//          });
//
//          scope.$on(eventPrefix + 'error', function () {
//            finalize(false);
//          });
//
//          function finalize(status) {
//            var message = status ? opts.successTemplate : opts.errorTemplate;
//            elem.html(message);
//            elem.removeAttr('disabled');
//
//            $timeout(function () {
//              elem.html(originalHtml);
//              $compile(elem)(scope);
//            }, opts.messageDuration);
//          }
//        }
//      };
//    }
//  );
//})();
