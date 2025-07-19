angular.module('myApp').service('AuthService', function($http, $window) {

  var API_URL = "http://localhost:8000/api-token-auth/";

  this.login = function(username, password) {
    return $http.post(API_URL, {
      username: username,
      password: password
    })
    .then(function(response) {
      var token = response.data.token;

      $window.sessionStorage.setItem('authToken', token);

      

      return token;
    })
    .catch(function(error) {
      console.error("Login failed:", error.data || error);
      throw error;
    });
  };

  this.getToken = function() {
    return $window.sessionStorage.getItem('authToken');
  };

  this.logout = function() {
    $window.sessionStorage.removeItem('authToken');
  };

});
