'use strict';
angular.module('gg.promise-button', []);
;(function () {
  'use strict';
  angular.module('gg.promise-button')
    .directive('promiseButton', function ($log, $timeout, PromiseButton) {
      return {
        priority: -1,
        restrict: 'A',
        link: function (scope, elem, attrs) {
          var warned = false;
          var opts = PromiseButton.getOptions(scope.$eval(attrs.promiseButton));
          elem.bind('click', function (e) {
            //cancel original
            var originalHtml = elem.html();
            e.stopImmediatePropagation();
            e.preventDefault();
            var promise = scope.$eval(attrs.ngClick);

            function finalize(status) {
              return function () {
                var message = status ? opts.resolvedTemplate : opts.rejectedTemplate;
                elem.html(message);
                elem.removeAttr('disabled');

                $timeout(function () {
                  elem.html(originalHtml);
                }, opts.messageDuration);
              };
            }

            if (promise && promise.then) {
              elem.html(opts.loadingTemplate);
              elem.attr('disabled', true);
              promise.then(finalize(true), finalize(false));
            } else {
              if (!warned) {
                $log.warn('click handler of promise-button must return a promise for it to work!');
                warned = true;
              }
            }

          });
        }
      };
    }
  );
})();
;(function () {
  'use strict';
  angular.module('gg.promise-button')
    .provider('PromiseButton', function () {

      var defaultOptions = {
        resolvedTemplate: '✓',
        rejectedTemplate: 'Oops, something went wrong',
        loadingTemplate: 'loading..',
        messageDuration: 2000
      };

      this.$get = function () {
        return {
          getOptions: function (externalOptions) {
            return angular.extend({}, defaultOptions, externalOptions || {});
          }
        };
      };
    });
})();
