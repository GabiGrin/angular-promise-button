(function () {
  'use strict';
  angular.module('gg.promise-button')
    .directive('promiseButton', function ($log, $timeout, PromiseButton) {

      return {
        priority: -1,
        restrict: 'A',
        link: function (scope, elem, attrs) {
          var warned = false;
          var opts = PromiseButton.getOptions(scope.$eval(attrs.promiseButtonOpts));
          var targetKey = attrs.promiseButtonTargetKey;
          elem.bind('click', function () {
            //cancel original
            var originalHtml = elem.html();
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
