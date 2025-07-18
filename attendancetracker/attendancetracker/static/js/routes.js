myApp.config(function($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl : "static/partial/login.html",
        controller : 'loginController'
    })
    .when('/welcome', {
        templateUrl : "static/partial/welcome.html",
        controller : 'welcomeController'
    })
    .when('/leave-details', {
        templateUrl : "static/partial/leaveDetails.html",
        controller : 'leaveController'
    })
    .when('/admin-login', {
        templateUrl : "static/partial/adminLogin.html",
        controller : 'adminLoginController'
    })
    .when('/admin-welcome', {
        templateUrl : "static/partial/adminWelcome.html",
        controller : 'adminWelcomeController'
    })
})