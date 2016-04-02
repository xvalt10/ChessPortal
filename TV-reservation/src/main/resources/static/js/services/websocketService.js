/**
 * 
 */

angular.module('websocketModule').factory('WebSocketService',['$http', '$q','$window', function( $http,$q, $window){
		
return {
	initWebSockets: function(){
		
			socket = new WebSocket(
					"ws://localhost:8082/actions");
						
			return socket;

			


		
	}
	
}

}]);
