var socket = io();
angular.module('DCRApp', []).controller('DCRForm', ['$scope', function ($scope) {

	//On Click Functions
	$scope.request = function() {
		var data = {
			connId: $scope.connId,
			timeout: $scope.timeout
		}
		$scope.connId = ''
		$scope.timeout = ''
		$scope.insertResponse = ''
		$scope.insertStatus = ''
		$scope.insertKillStatus = ''
		console.log('Sending request with', data)
		socket.emit('request', data)
	}

	$scope.getStatus = function() {
		$scope.insertResponse = ''
		$scope.insertStatus = ''
		$scope.insertKillStatus = ''
		socket.emit('get-status')
	}

	$scope.deleteId = function() {
		var data = {
			connId: $scope.killConnId
		}
		$scope.killConnId = ''
		$scope.insertResponse = ''
		$scope.insertStatus = ''
		$scope.insertKillStatus = ''
		socket.emit('kill-connId', data)
	}

	// Socket functions
	socket.on('response', function(data) {
		console.log(data)
		var result = ''
		if (angular.equals(data.status, "ok")) {
			result = 'Result: {"status": "ok", "connId": ' + data.connId + '}'
		} else if (angular.equals(data.status, "killed")){
			result = 'Result: {"status": "killed", "connId": ' + data.connId + '}'
		}
		$scope.$apply(function () {
				$scope.insertResponse = result
		})
	})

	socket.on('status', function(data) {
		var status = ''
		if (angular.equals(data.result, '')) {
			status = 'No current connections found.'
		} else {
			console.log(data)
			status = 'Result: {' + data.result + '}'
		}
		$scope.$apply(function() {
			$scope.insertStatus = status
		})
	})

	socket.on('killed', function(data) {
		console.log(data)
		var result = ''
		if (angular.equals(data.status, "ok")) {
			result = 'Result: {"status":"ok", "connId": ' + data.connId + '}'
		} else {
			result = 'Result: {"status":"' + data.status + '"}'
		}
		$scope.$apply(function() {
			$scope.insertKillStatus = result
		})
	})
}])