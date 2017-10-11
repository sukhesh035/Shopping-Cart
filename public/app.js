var app = angular.module("harish_test", ['ui.router']);

app.config(function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/login');

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'templates/login.html'
    });

    $stateProvider.state('register', {
        url: '/register',
        templateUrl: 'templates/register.html'
    });

    $stateProvider.state('products', {
        url: '/products',
        templateUrl: 'templates/products.html'
    });

    $stateProvider.state('orders', {
        url: '/orders',
        templateUrl: 'templates/createOrder.html'
    });

    $stateProvider.state('orderList', {
        url: '/orderList',
        templateUrl: 'templates/myOrders.html'
    });


});

app.controller("registerController", function ($scope, $http, $state) {
    $scope.registerUser = function () {
        var data = {
            username: $scope.userName,
            password: $scope.password
        }
        $http.post("/registerUser", data).then(function (response) {
            console.log(response);
            if (response.data) {
                $scope.navLogin();
            }
        });
    }

    $scope.navLogin = function () {
        $state.go("login");
    }
});

app.controller("loginController", function ($scope, $http, $state, $window) {
    $scope.loginUser = function () {
        var data = {
            username: $scope.userName,
            password: $scope.password
        }
        $http.post("/login", data).then(function (response) {
            if (response.data) {
                $window.localStorage["username"] = $scope.userName
                // $localStorage.put("username":$scope.userName);
                $state.go("products");
            } else {

            }
        });
    }

    $scope.navRegister = function () {
        $state.go("register");
    }

});

app.controller("orderController", function ($scope, $http, $state) {
    $scope.orderConfig = {};
    $scope.showOrderDetails = true;
    $scope.showProductSection = false;
    $scope.product = {};
    $scope.getProductList = function () {
        $http.get("/productList").then(function (resposne) {
            console.log(resposne);
            $scope.productList = resposne.data;
        });
    }
    $scope.getProductList();

    $scope.navorders = function () {
        $state.go("orders");
    }

    $scope.shipping = function () {
        $scope.showOrderDetails = false;
    }

    $scope.saveOrder = function () {
        $scope.orderConfig.username = localStorage.getItem("username");
        $http.post("/saveOrder", $scope.orderConfig).then(function (response) {
            console.log(response);
        });
    }

    $scope.addProduct = function () {
        $http.post("/addProduct", $scope.product).then(function (response) {
            console.log(response);
        });
    }

    $scope.getOrderList = function(){
        $http.get("/getOrder/"+localStorage.getItem("username")).then(function(response){
            $scope.orderList = response.data;
        });
    }

});