angular.module('sociogram.controllers', [])

    .controller('AppCtrl', function ($scope, $state, OpenFB) {

        $scope.logout = function () {
            OpenFB.logout();
            $state.go('app.login');
        };

        $scope.revokePermissions = function () {
            OpenFB.revokePermissions().then(
                function () {
                    $state.go('app.login');
                },
                function () {
                    alert('Revoke permissions failed');
                });
        };

    })

    .controller('LoginCtrl', function ($http, $scope, $location, OpenFB) {

        $scope.facebookLogin = function () {

            OpenFB.login('email,user_birthday').then(
                function (success) {
                    OpenFB.get('/me').success(function(user){
                        
                        var date = new Date();
                        var year = date.getFullYear();
                        var month = date.getMonth()+1;
                        if (month<10){
                            month="0" + month;
                        }
                        var day = date.getDate();

                        var values = user.birthday.split("/");
                        var dayOfBirth = values[1];
                        var monthOfBirth = values[0];
                        var yearOfBirth = values[2];

                        var age = year - yearOfBirth;

                        if(month<monthOfBirth){
                            age = age - 1;
                        }
                        
                        if(month == monthOfBirth && day<dayOfBirth){
                            age = age - 1;
                        }

                        var latitude = window.localStorage['latitude'];
                        var longitude = window.localStorage['longitude'];


                        /* TEMOS QUE FAZER O MD5 */

                        var userJson = {'user.name':user.name,'user.email':user.email,'user.age':age,'user.password':user.id,'user.loc_lat':latitude,'user.loc_long':longitude};

                        $http({method: 'GET', url: 'http://localhost:8080/barterserver/user/post/save', params: userJson}).
                        success(function(data, status, headers, config) {
                          // this callback will be called asynchronously
                          // when the response is available
                          /*CRIA SESSAO PORCA!!!*/
                          window.localStorage['sessao.userId'] = data.id;
                          window.localStorage['sessao.name'] = data.name;
                          window.localStorage['sessao.email'] = data.email;
                          window.localStorage['sessao.age'] = data.age;
                        }).
                        error(function(data, status, headers, config) {
                          // called asynchronously if an error occurs
                          // or server returns response with an error status.
                        });
                    });
                    //$location.path('/app/person/me/feed');
                },
                function () {
                    alert('OpenFB login failed');
                });
        };

    })

    .controller('ShareCtrl', function ($scope, OpenFB) {

        $scope.item = {};

        $scope.share = function () {
            OpenFB.post('/me/feed', $scope.item)
                .success(function () {
                    $scope.status = "This item has been shared on OpenFB";
                })
                .error(function(data) {
                    alert(data.error.message);
                });
        };

    })

    .controller('ProfileCtrl', function ($scope, OpenFB) {
        OpenFB.get('/me').success(function (user) {
            $scope.user = user;
        });
    })

    .controller('PersonCtrl', function ($scope, $stateParams, OpenFB) {
        OpenFB.get('/' + $stateParams.personId).success(function (user) {
            $scope.user = user;
        });
    })

    .controller('FriendsCtrl', function ($scope, $stateParams, OpenFB) {
        OpenFB.get('/' + $stateParams.personId + '/friends', {limit: 50})
            .success(function (result) {
                $scope.friends = result.data;
            })
            .error(function(data) {
                alert(data.error.message);
            });
    })

    .controller('MutualFriendsCtrl', function ($scope, $stateParams, OpenFB) {
        OpenFB.get('/' + $stateParams.personId + '/mutualfriends', {limit: 50})
            .success(function (result) {
                $scope.friends = result.data;
            })
            .error(function(data) {
                alert(data.error.message);
            });
    })

    .controller('FeedCtrl', function ($scope, $stateParams, OpenFB, $ionicLoading) {

        $scope.show = function() {
            $scope.loading = $ionicLoading.show({
                content: 'Loading feed...'
            });
        };
        $scope.hide = function(){
            $scope.loading.hide();
        };

        function loadFeed() {
            $scope.show();
            OpenFB.get('/' + $stateParams.personId + '/home', {limit: 30})
                .success(function (result) {
                    $scope.hide();
                    $scope.items = result.data;
                    // Used with pull-to-refresh
                    $scope.$broadcast('scroll.refreshComplete');
                })
                .error(function(data) {
                    $scope.hide();
                    alert(data.error.message);
                });
        }

        $scope.doRefresh = loadFeed;

        loadFeed();

    });