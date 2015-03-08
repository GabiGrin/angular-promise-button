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
