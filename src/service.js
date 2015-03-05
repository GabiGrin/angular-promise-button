(function () {
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
