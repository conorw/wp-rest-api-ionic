angular.module('starter.services', [])
  .service('LoginService', function ($q, $http, $window) {
    // this service is used to contact a Wordpress REST API end point
    // and request an authentication token
    function login(email, password, success, failure) {

      var data = {
        username: email,
        password: password
      };

      // Erase the token if the user fails to log in
      delete $window.sessionStorage.token;

      // the important bit, contact the end point and ask for a token
      $http.post('/server/wp-json/jwt-auth/v1/token', data).error(function (error) {
        failure(error);
      }).success(function (data) {
        // you are now logged in, save to session storage, the auth interceptor will pick up
        // and add to each request
        $window.sessionStorage.token = data.token;
        success(data);
      });

    }

    return {
      loginUser: function (name, pw) {
        var deferred = $q.defer();

        login(name, pw, function () {
          deferred.resolve('Welcome ' + name + '!');
        }, function () {
          deferred.reject('Wrong credentials.');
        });

        return deferred.promise;
      }
    }
  }).service('WordpressService', function ($q, $http) {
    function createReport(score, report) {

      var deferred = $q.defer();

      var data = {
        title: score,
        excerpt: report,
        content: report,
        status: 'publish'
      };
      // the important bit, make a request to the server to create a new post
      // The Authentication header will be added to the request automatically by our Interceptor service
      $http.post('/server/wp-json/wp/v2/posts', data).error(function (error) {
        deferred.reject(error);
      }).success(function (data) {
        deferred.resolve(data);
      });

      return deferred.promise;

    }

    return {
      createReport: createReport
    }
  }).factory('authInterceptor', function ($rootScope, $q, $window) {
    // intercept all http requests 
    // if a token is in localstorage
    // add it to all requests 
    return {
      request: function (config) {
        config.headers = config.headers || {};
        //if there is a token,add it to the http reques
        if ($window.sessionStorage.token) {
          config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
        }
        return config;
      },
      response: function (response) {
        if (response.status === 401) {
          // handle the case where the user is not authenticated
        }
        return response || $q.when(response);
      }
    };
  });
