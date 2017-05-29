var socket = io();
angular.module('DCRApp', []).controller('DCRForm', ['$scope', function ($scope) {
	$scope.request = function() {
		var data = {
			connId: $scope.connId,
			timeout: $scope.timeout
		}
		$scope.connId = ''
		$scope.timeout = ''
		$scope.insertResponse = ''
		console.log('Sending request with', data)
		socket.emit('request', data)
	}

	socket.on('response', function(data) {
		console.log(data)
		if (angular.equals(data.status, "ok")) {
			$scope.$apply(function () {
				$scope.insertResponse = 'Result: {"status": "ok", "connId": ' + data.connId + '}'
			})
		}	
	})
}])