angular.module('sociogram', ['ionic', 'openfb', 'sociogram.controllers'])

    .run(function ($rootScope, $state, $ionicPlatform, $window, OpenFB) {

        //OpenFB.init('489987941127071','http://localhost/BoaTroca-Ionic/www/oauthcallback.html',window.localStorage);
        OpenFB.init('489987941127071');

        navigator.geolocation.getCurrentPosition(function(postion){
           window.localStorage['latitude'] = postion.coords.latitude;
           window.localStorage['longitude'] = postion.coords.longitude;
        });

        $ionicPlatform.ready(function () {
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });

        $rootScope.$on('$stateChangeStart', function(event, toState) {
            if (toState.name !== "app.login" && toState.name !== "app.logout" && !$window.sessionStorage['fbtoken']) {
                $state.go('app.login');
                event.preventDefault();
            }
        });

        $rootScope.$on('OAuthException', function() {
            $state.go('app.login');
        });

    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: "AppCtrl"
            })
            .state('app.home', {
                url: "/home",
                views:{
                    'menuContent': {
                        templateUrl: "templates/home.html",
                        controller: "HomeCtrl"
                    }
                }
            })
            .state('app.login', {
                url: "/login",
                views: {
                    'menuContent': {
                        templateUrl: "templates/login.html",
                        controller: "LoginCtrl"
                    }
                }
            })
            .state('app.logout', {
                url: "/logout",
                views: {
                    'menuContent': {
                        templateUrl: "templates/logout.html",
                        controller: "LogoutCtrl"
                    }
                }
            })

            .state('app.profile', {
                url: "/profile",
                views: {
                    'menuContent': {
                        templateUrl: "templates/profile.html",
                        controller: "ProfileCtrl"
                    }
                }
            })
            .state('app.mypictures', {
                url: "/mypictures",
                views: {
                    'menuContent': {
                        templateUrl: "templates/mypictures.html",
                        controller: "MyPicturesCtrl"
                    }
                }
            })
            .state('app.registerpicture', {
                url: "/registerpicture",
                views: {
                    'menuContent': {
                        templateUrl: "templates/registerpicture.html",
                        controller: "RegisterPicturerCtrl"
                    }
                }
            })
            .state('app.friends', {
                url: "/person/:personId/friends",
                views: {
                    'menuContent': {
                        templateUrl: "templates/friend-list.html",
                        controller: "FriendsCtrl"
                    }
                }
            })
            .state('app.mutualfriends', {
                url: "/person/:personId/mutualfriends",
                views: {
                    'menuContent': {
                        templateUrl: "templates/mutual-friend-list.html",
                        controller: "MutualFriendsCtrl"
                    }
                }
            })
            .state('app.person', {
                url: "/person/:personId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/person.html",
                        controller: "PersonCtrl"
                    }
                }
            })
            .state('app.feed', {
                url: "/person/:personId/feed",
                views: {
                    'menuContent': {
                        templateUrl: "templates/feed.html",
                        controller: "FeedCtrl"
                    }
                }
            })

            .state('app.searchresult', {
                url: "/searchresult",
                views: {
                    'menuContent': {
                        templateUrl: "templates/search-result.html",
                        controller: "searchResultCtrl"
                    }
                }
            });

        // fallback route
        $urlRouterProvider.otherwise('/app/home');

    });
