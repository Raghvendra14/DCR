angular.module('DCRApp', []).controller('DCRForm', ['$scope', '$http', function ($scope, $http) {

	//On Click Functions
	$scope.request = function() {
		$http.get('request/?connId=' + $scope.connId + '&timeout=' + $scope.timeout)
		.then(function (response) {
			var result = ''
			if (angular.equals(response.data.status, "ok")) {
				result = 'Result: {"status": "ok", "connId": ' + response.data.connId + '}'
			} else if (angular.equals(response.data.status, "killed")){
				result = 'Result: {"status": "killed", "connId": ' + response.data.connId + '}'
			}
			$scope.insertResponse = result
		}, function (error) {
			$scope.insertResponse = 'Error occured'
		})
		$scope.connId = ''
		$scope.timeout = ''
		$scope.insertResponse = ''
		$scope.insertStatus = ''
		$scope.insertKillStatus = ''
	}

	$scope.getStatus = function() {
		$http.get('/serverStatus')
		.then(function (response) {
			var status = ''
			if (angular.equals(response.data.result, '')) {
				status = 'No current connections found.'
			} else {
				status = 'Result: {' + response.data.result + '}'
			}
			$scope.insertStatus = status
		}, function (error) {
			$scope.insertStatus = 'Error occured'
		})
		$scope.insertResponse = ''
		$scope.insertStatus = ''
		$scope.insertKillStatus = ''
	}

	$scope.deleteId = function() {
		var data = {
			connId: $scope.killConnId
		}
		$http.post('/kill', data)
		.then(function (response) {
			var result = ''
			if (angular.equals(response.data.status, "ok")) {
				result = 'Result: {"status":"ok", "connId": ' + response.data.connId + '}'
			} else {
				result = 'Result: {"status":"' + response.data.status + '"}'
			}
			$scope.insertKillStatus = result
		}, function (error) {
			$scope.insertKillStatus = 'Error occured'
		})
		$scope.killConnId = ''
		$scope.insertResponse = ''
		$scope.insertStatus = ''
		$scope.insertKillStatus = ''
	}
}])