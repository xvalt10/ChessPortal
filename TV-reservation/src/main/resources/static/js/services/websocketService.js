/**
 * 
 */

angular.module('websocketModule').factory('WebSocketService',['$http', '$q','$window', function( $http,$q, $window){

	let socket;
return {
	initWebSockets: function(){
		if(typeof socket === 'undefined' || socket.readyState !== socket.OPEN){
			socket = new WebSocket(
					"ws://localhost:8082/actions");
		}
			return socket;
		
	},
	closeWebSocket: function(){
		socket.close();
	}

	
}

}]);
