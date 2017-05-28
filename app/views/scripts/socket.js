var socket = io();
angular.module('DCRApp', []).controller('DCRForm', ['$scope', function ($scope) {
	$scope.request = function() {
		var data = {
			connId: $scope.connId,
			timeout: $scope.timeout
		}
		console.log('Sending request with', data)
		socket.emit('request', data)
	}
	socket.on('response', function(data) {
		console.log(data)
	})
}])