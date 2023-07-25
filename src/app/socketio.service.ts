import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  public getSocket(): Socket {
    return this.socket;
  }
}
