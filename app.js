angular.module('app', ['ui.router'])
    .service('MyTimeoutService', function ($q, $timeout) {
        var defer = $q.defer();

        $timeout(function () {
            defer.resolve('This is the promise value');
        }, 1500);

        return defer.promise;
    })
    .controller('TopController', function ($scope) {
        // State Change Events
        // https://github.com/angular-ui/ui-router/wiki
        $scope.$on('$viewContentLoaded', function (event) {
            console.log('View content loaded');
            console.log(event);
        });

        console.log('top ->');
        $scope.inheritMessage = 'I am the walrus and I still exist!';
    })
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/top/nest');

        $stateProvider
            .state('top', {
                abstract: true,
                url: '/top',
                controller: 'TopController',
                templateUrl: 'views/layout.html'
            })
            .state('top.nest', {
                url: '/nest',
                views: {
                    'list': {
                        template: '<ul><li>1</li><li>2</li></ul>'
                    },
                    'main': {
                        template: '<h1>Main View</h1>',
                        controller: function ($scope) {
                            console.log('top.nest main->');
                            console.log($scope.inheritMessage);
                        }
                    },
                    '': {
                        templateUrl: 'views/top.nest.unnamed.html'
                    }
                }
            })
            .state('top.nest.edit', {
                url: '/edit',
                resolve: {
                    'myTimeoutResult': 'MyTimeoutService'
                },
                views: {
                    // to overwrite the state view 'main', we need to reference
                    // the 'owner' of the 'main' view.
                    // In this case it's the parent.
                    // https://github.com/angular-ui/ui-router/wiki/Multiple-Named-Views
                    // View Names - Relative vs. Absolute Names
                    'main@top': {
                        templateUrl: 'views/top.nest.edit.html',
                        controller: function ($scope, myTimeoutResult) {
                            console.log('top.nest.edit main->');
                            console.log($scope.inheritMessage);
                            console.log(myTimeoutResult);
                        }
                    }
                    // if we tried to just use 'main' to overwrite, it would not manage it
                    // as it would relatively look for a 'main' ui-view in this
                    // state's parent, which in this case is the nest view,
                    // which does not have a template.
                }
            })
            .state('top.nest.edit.overwriteall', {
                url: '/overwriteall',
                views: {
                    // will target the unnamed view in the index.html
                    // Logically this state translates to '' + @ + ''.
                    // No name, the 'at sign', no name.
                    '@': {
                        template: '<h1>I have overwritten the whole top level view, even though I am nested many levels down. I do not inherit my scope from the parent scopes. Look at your console.</h1>',
                        controller: function ($scope) {
                            console.log('top.nest.edit.overwriteall ->')
                            console.log($scope.inheritMessage);
                        }
                    }
                }
            })
    });
