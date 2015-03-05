/**
 * Created by Gabriel_Grinberg on 3/5/15.
 */
'use strict';

describe('promise button ', function () {
  var $compile,
    $scope,
    $q,
    $log,
    $timeout,
    PromiseButton,
    body,
    defaultOptions;

  beforeEach(function () {
    module('gg.promise-button');
    inject(function (_$compile_, $document, _$rootScope_, _$q_, _$timeout_, _$log_, _PromiseButton_) {
      $compile = _$compile_;
      body = $document.find('body').empty();
      $scope = _$rootScope_;
      $q = _$q_;
      $log = _$log_;
      $timeout = _$timeout_;
      PromiseButton = _PromiseButton_;
    });

    defaultOptions = PromiseButton.getOptions();
  });


  function fakePromise(response, shouldFail) {
    var dfd = $q.defer();
    $timeout(function () {
      if (shouldFail) {
        dfd.reject(response);
      } else {
        dfd.resolve(response);
      }
    }, 2000);

    return dfd.promise;
  }

  function createDirective(html) {
    var elem = angular.element(html);
    body.append(elem);
    elem = $compile(elem)($scope);
    $scope.$digest();
    return elem;
  }

  describe('service', function () {

    it('should exist', function () {
      expect(PromiseButton).toBeDefined();
    });
  });

  describe('directive', function () {

    it('should switch to loading when clicked', function () {
      $scope.loadData = function () {
        return fakePromise('data');
      };
      var elem = createDirective('<button promise-button ng-click="loadData()">Load data</button>');

      elem.triggerHandler('click');
      $scope.$digest();

      expect(elem.text()).toBe(defaultOptions.loadingTemplate);
    });

    it('should show success if promise passed or error if otherwise', function () {
      $scope.loadData = function () {
        return fakePromise('data');
      };
      var elem = createDirective('<button promise-button ng-click="loadData()">Load data</button>');

      elem.triggerHandler('click');
      $timeout.flush();
      $scope.$digest();

      expect(elem.html()).toBe(defaultOptions.resolvedTemplate);

      $scope.loadData = function () {
        return fakePromise('data', true);
      };

      elem.triggerHandler('click');
      $timeout.flush();
      $scope.$digest();
      expect(elem.html()).toBe(defaultOptions.rejectedTemplate);
    });

    it('should warn if onclick handler did not return promise, but just once', function () {
      $scope.loadData = function () {
        $scope.someVar = 'yo';
      };
      var elem = createDirective('<button promise-button ng-click="loadData()">Load data</button>');
      spyOn($log, 'warn');
      elem.triggerHandler('click');
      $scope.$digest();
      expect($log.warn).toHaveBeenCalled();
      $log.warn.reset();
      elem.triggerHandler('click');
      $scope.$digest();
      expect($log.warn).not.toHaveBeenCalled();
    });

    it('should not affect the actual click function', function () {
      $scope.loadData = function () {
        $scope.someVar = 'yo';
      };
      var elem = createDirective('<button promise-button ng-click="loadData()">Load data</button>');

      elem.triggerHandler('click');

      $scope.$digest();
      expect($scope.someVar).toBe('yo');
    });

    it('should return to original text after some time', function () {
      $scope.loadData = function () {
        return fakePromise('data');
      };
      var elem = createDirective('<button promise-button ng-click="loadData()">Load data</button>');

      elem.triggerHandler('click');
      $timeout.flush();
      $scope.$digest();
      $timeout.flush();
      $scope.$digest();
      expect(elem.text()).toBe('Load data');
    });

    it('should take options from element if present', function () {
      $scope.loadData = function () {
        return fakePromise('data');
      };

      $scope.opts = {
        loadingTemplate: '1, 2, 3'
      };

      var elem = createDirective('<button promise-button="opts" ng-click="loadData()">Load data</button>');

      elem.triggerHandler('click');
      $scope.$digest();
      expect(elem.text()).toBe('1, 2, 3');
    });
  });

});
