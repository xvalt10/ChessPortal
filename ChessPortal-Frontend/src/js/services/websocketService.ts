import { JwtAuthenticationService } from './jwtAuthenticationService';
import { Injectable } from '@angular/core';
import { WEBSOCKET_BASEURL } from '../constants.js';
import { ActivatedRoute, Router } from "@angular/router";



@Injectable({ providedIn: 'root' })
export class WebSocketService {
	constructor(private authenticationService: JwtAuthenticationService, private router:Router) { }

	socket: WebSocket;

	initWebSocket(): WebSocket {
		if (typeof this.socket === 'undefined' || this.socket.readyState !== this.socket.OPEN) {
			const jwtToken = this.authenticationService.getJwtToken();
			if (jwtToken) {
				this.socket = new WebSocket(`${WEBSOCKET_BASEURL}/actions?token=${jwtToken}`);
			} else{
				this.router.navigate(['/login']);
			}

		}
		return this.socket;
	}

	closeWebSocket() {
		this.socket.close();
	}

	send(message) {
		this.waitForConnection(() => {
			
			this.socket.send(message);

		}, 10);
	};

	waitForConnection(callback, interval) {
		if (this.socket.readyState === 1) {
			callback();
		} else {
			console.log("Waiting for socket to connect.");
			var that = this;
			// optional: implement backoff for interval here
			setTimeout(function () {
				that.waitForConnection(callback, interval);
			}, interval);
		}
	};


	seekNewOponentCommand(time, increment, minRating?, maxRating?){
		minRating = minRating || 0
		maxRating = maxRating || 9999

		const seekDetails = {
			action: "seekOponent",
			user: this.authenticationService.authenticatedUser,
			time,
			increment,
			minRating,
			maxRating
		  };
	  
		  this.socket.send(JSON.stringify(seekDetails));
	}

}