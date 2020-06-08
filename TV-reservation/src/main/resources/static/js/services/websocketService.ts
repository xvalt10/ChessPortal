import { JwtAuthenticationService } from './jwtAuthenticationService';
import { Injectable } from '@angular/core';
import {WEBSOCKET_BASEURL} from '../constants.js';


@Injectable({providedIn: 'root'})
export class WebSocketService {
    constructor(private authenticationService:JwtAuthenticationService) { }

    socket:WebSocket;

    initWebSockets():WebSocket{
		if(typeof this.socket === 'undefined' || this.socket.readyState !== this.socket.OPEN){
			const jwtToken = this.authenticationService.getJwtToken();
			this.socket = new WebSocket(`${WEBSOCKET_BASEURL}/actions?token=${jwtToken}`);
		}	
	
			return this.socket;		
	}

	closeWebSocket(){
		this.socket.close();
	}
    
}