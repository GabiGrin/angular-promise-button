(function () {
  'use strict';
  angular.module('gg.promise-button')
    .directive('promiseButton', function ($log, $timeout, PromiseButton) {

      return {
        restrict: 'A',
        transclude: true,
        template: '<span class="promise-button-container">' +
        '<span class="original-content" ng-transclude></span>' +
        '<span class="message"></span>' +
        '</span>',
        link: function (scope, elem, attrs) {
          var warned = false;
          var opts = PromiseButton.getOptions(scope.$eval(attrs.promiseButtonOpts));
          var targetKey = attrs.promiseButtonTargetKey;
          var originalContent = angular.element(elem[0].querySelector('.original-content'));
          var messageNode = angular.element(elem[0].querySelector('.message')).detach();
          var container = elem.children().eq(0);

          elem.bind('click', function () {
            //cancel original
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
                  messageNode.html(message);
                  originalContent.detach();
                  container.append(messageNode);
                  elem.removeAttr('disabled');

                  $timeout(function () {
                    messageNode.detach();
                    container.append(originalContent);
                  }, opts.messageDuration);
                }
              };
            }

            if (promise && promise.then) {
              if (targetKey) {
                PromiseButton.setButtonLoading(targetKey);
              } else {
                originalContent.detach();
                container.append(messageNode);
                messageNode.html(opts.loadingTemplate);
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
