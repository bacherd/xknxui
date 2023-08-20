import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
//import { webSocket } from 'rxjs/webSocket'
//import { retry, RetryConfig } from "rxjs/operators";

const WS_URL = "ws://localhost:8124/ws"
//const retryConfig: RetryConfig = {
//  delay: 3000,
//};

@Injectable({
providedIn: 'root',
})
export class WebsocketService {

  private socket: any;
  messageReceived: Subject<string> = new Subject<string>();

  constructor() {
      this.connect();
  }

  connect(): void {
    console.log("Try to connect to " + WS_URL)
    this.socket = new WebSocket(WS_URL);

    this.socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    this.socket.onmessage = (event : any) => {
      console.log('Received message:', event.data);
      const message = event.data;
      this.messageReceived.next(message);
    };

    this.socket.onclose = (event : any) => {
      console.log('WebSocket connection closed:', event);
      setTimeout(this.connect, 1000);
    };

    this.socket.onerror = (error : any) => {
      console.error('WebSocket error:', error);
      setTimeout(this.connect, 1000);
    };
  }

  sendMessage(message: string): void {
    this.socket.send(message);
  }

  closeConnection(): void {
    this.socket.close();
  }

}
