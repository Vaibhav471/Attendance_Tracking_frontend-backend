myApp.controller('loginController', function ($scope) {
    console.log("Ctrl called");
    $scope.email = '';
    $scope.password = '';

    const userMap = new Map([
        ["test1@djubo.com", { password: "india1", name: "Test User 1" }],
        ["test2@djubo.com", { password: "india2", name: "Test User 2" }],
        ["test3@djubo.com", { password: "india3", name: "Test User 3" }]
    ]);

    $scope.login = function () {
        console.log("Clicked");

        const user = userMap.get($scope.email);

        if (user && user.password === $scope.password) {
            const loggedInUser = {
                name: user.name,
                email: $scope.email
            };
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            window.location.href = '#!/welcome';
        } else {
            $scope.email = '';
            $scope.password = '';
            alert("Invalid credentials");
        }
    };
});
