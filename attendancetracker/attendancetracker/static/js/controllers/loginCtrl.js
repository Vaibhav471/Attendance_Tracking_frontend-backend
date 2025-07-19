myApp.controller('loginController', function ($scope, AuthService, $http, $window) {
    console.log("Ctrl called");

    $scope.username = '';
    $scope.password = '';

    $scope.login = function () {
        console.log("Clicked");

        AuthService.login($scope.username, $scope.password)
            .then(function (token) {
                console.log("Login Successful, Token:", token);

                return $http.post("http://localhost:8000/get-user-by-token/", {
                    token: token
                });
            })
            .then(function (response) {
                console.log("Fetched User:", response.data);

                const userData = response.data;
                const loggedInUser = {
                    email: userData.email,     
                    name: userData.username,   
                    id: userData.id           
                };

                
                $window.sessionStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

                console.log("Saved in session:", loggedInUser);

                window.location.href = "#!/welcome";
            })
            .catch(function (error) {
                console.error("Login failed:", error.data || error);
                $scope.username = '';
                $scope.password = '';
                alert("Invalid credentials");
            });
    };
});
