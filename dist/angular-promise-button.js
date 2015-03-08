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
          var targetKey = attrs.promiseButtonTargetKey;
          elem.bind('click', function (e) {
            //cancel original
            var originalHtml = elem.html();
            e.stopImmediatePropagation();
            e.preventDefault();
            var promise = scope.$eval(attrs.ngClick);

            function finalize(status) {
              return function () {
                if (targetKey) {
                  if (status) {
                    PromiseButton.setButtonSuccess(targetKey);
                  } else {
                    PromiseButton.setButtonError(targetKey);
                  }
                } else {
                  var message = status ? opts.resolvedTemplate : opts.rejectedTemplate;
                  elem.html(message);
                  elem.removeAttr('disabled');

                  $timeout(function () {
                    elem.html(originalHtml);
                  }, opts.messageDuration);
                }
              };
            }

            if (promise && promise.then) {
              if (targetKey) {
                PromiseButton.setButtonLoading(targetKey);
              } else {
                elem.html(opts.loadingTemplate);
                elem.attr('disabled', true);
              }
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
    .directive('promiseButtonKey', function (PromiseButton, $timeout) {
      return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
          var key = attrs.promiseButtonKey;
          var opts = PromiseButton.getOptionsForKey(key);
          var originalHtml = elem.html();
          var eventPrefix = 'promiseButton.' + key + '.';

          console.log('eventPrefix', eventPrefix);

          scope.$on(eventPrefix + 'loading', function () {

            elem.html(opts.loadingTemplate);
            elem.attr('disabled', true);
          });

          scope.$on(eventPrefix + 'success', function () {
            finalize(true);
          });

          scope.$on(eventPrefix + 'error', function () {
            finalize(false);
          });

          function finalize(status) {
            var message = status ? opts.resolvedTemplate : opts.rejectedTemplate;
            elem.html(message);
            elem.removeAttr('disabled');

            $timeout(function () {
              elem.html(originalHtml);
            }, opts.messageDuration);
          }
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

      var optsPerKey = {};

      this.defaultOptions = defaultOptions;

      this.$get = function ($rootScope) {

        function broadcastEvent(name, key) {
          $rootScope.$broadcast('promiseButton.' + key + '.' + name);
        }

        return {
          getOptions: function (externalOptions) {
            return angular.extend({}, defaultOptions, externalOptions || {});
          },
          getOptionsForKey: function (key) {
            return angular.extend({}, defaultOptions, optsPerKey[key] || {});
          },
          setOptionsForKey: function (key, opts) {
            optsPerKey[key] = opts;
          },
          setButtonLoading: function (key) {
            broadcastEvent('loading', key);
          },
          setButtonSuccess: function (key) {
            broadcastEvent('success', key);
          },
          setButtonError: function (key) {
            broadcastEvent('error', key);
          }
        };
      };
    });
})();
