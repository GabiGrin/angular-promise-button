(function () {
  'use strict';
  angular.module('gg.promise-button')
    .directive('promiseButton', function ($log, $timeout, PromiseButton, $sce) {

      return {
        restrict: 'A',
        transclude: true,
        template: '<span class="promise-button-container">' +
        '<span class="original-content" ng-if="status===\'idle\'" ng-transclude></span>' +
        '<span class="loading-message" ng-if="status===\'loading\'" ng-bind-html="vm.loadingTemplate"></span>' +
        '<span class="success-message" ng-if="status===\'success\'" ng-bind-html="vm.successTemplate"></span>' +
        '<span class="error-message" ng-if="status===\'error\'" ng-bind-html="vm.errorTemplate"></span>' +
        '</span>',
        scope: true,
        link: function (scope, elem, attrs) {
          var warned = false;
          var opts = PromiseButton.getOptions(scope.$eval(attrs.promiseButtonOpts));
          var targetKey = attrs.promiseButtonTargetKey;
          var key = attrs.promiseButtonKey;
          var eventPrefix = 'promiseButton.' + key + '.';

          scope.vm = {
            loadingTemplate: $sce.trustAsHtml(opts.loadingTemplate),
            successTemplate: $sce.trustAsHtml(opts.successTemplate),
            errorTemplate: $sce.trustAsHtml(opts.errorTemplate)
          };

          scope.status = 'idle';


          function setLoading() {
            scope.status = 'loading';
            elem.attr('disabled', true);
          }

          function setResult(status) {
            scope.status = status ? 'success' : 'error';
            elem.attr('disabled', false);
            $timeout(function () {
              scope.status = 'idle';
            }, opts.messageDuration);
          }

          if (key) {
            scope.$on(eventPrefix + 'loading', setLoading);
            scope.$on(eventPrefix + 'success', function () {
              setResult(true);
            });
            scope.$on(eventPrefix + 'error', function () {
              setResult(false);
            });
          }

          elem.bind('click', function () {
            //cancel original

            scope.$apply(function () {

              var promise = scope.$eval(attrs.promiseButton);

              function finalize(status) {
                return function () {
                  if (targetKey) {
                    if (status) {
                      PromiseButton.setButtonSuccess(targetKey);
                    } else {
                      PromiseButton.setButtonError(targetKey);
                    }
                  } else {
                    setResult(status);
                  }
                };
              }

              if (promise && promise.then) {
                if (targetKey) {
                  PromiseButton.setButtonLoading(targetKey);
                } else {
                  setLoading();
                }
                promise.then(finalize(true), finalize(false));
              } else {
                if (!warned) {
                  $log.warn('click handler of promise-button must return a promise for it to work!');
                  warned = true;
                }
              }

            });

          });
        }
      };
    }
  );
})
();
