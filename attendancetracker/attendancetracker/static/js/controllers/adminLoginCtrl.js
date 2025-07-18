myApp.controller('adminLoginController',function($scope){
    $scope.email=''
    $scope.password=''

    $scope.login = function(){
        if($scope.email==="admin@djubo.com" && $scope.password==="india"){
           window.location.href = '#!/admin-welcome';
    } else {
         $scope.email=''
         $scope.password=''
        alert("Invalid credentials");
    }
    }
})