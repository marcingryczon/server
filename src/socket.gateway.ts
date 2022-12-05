import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { from } from 'rxjs';
import { Server } from 'socket.io';

@WebSocketGateway(8080)
export class ScocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  rooms: string[] = [];
  roomClients: { [key: string]: string[] } = {};
  @WebSocketServer()
  server: Server;
  constructor() {
    console.log('server gateway');
  }

  afterInit(server: Server): void {
    //   from(server.fetchSockets()).subscribe(
    //     (sockets) => (this.activeSockets = [...this.activeSockets, ...sockets]),
    //   );
  }
  // getSockets(): any[] {
  //   return this.activeSockets;
  // }

  @SubscribeMessage('openSockets')
  async handleConnection(client: any, ...args: any[]): Promise<void> {
    const sockets = (await this.server.fetchSockets()).reduce((acc, val) => {
      acc.push(val.id);
      return acc;
    }, []);
    this.server.emit('openSockets', sockets);
  }

  async handleDisconnect(client: any, ...args: any[]): Promise<void> {
    const sockets = (await this.server.fetchSockets()).reduce((acc, val) => {
      acc.push(val.id);
      return acc;
    }, []);
    this.server.emit('openSockets', sockets);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinToSocket(client: any, ...args: any[]): Promise<void> {
    if (!Object.keys(this.roomClients).includes(args[0])) {
      this.roomClients[args[0]] = [client.id];
    } else {
      this.roomClients[args[0]].push(client.id);
    }
    this.server.socketsJoin(args[0]);
    console.log(this.roomClients);
    this.server.emit('rooms', Object.keys(this.roomClients));
  }

  @SubscribeMessage('rooms')
  async getRooms(client: any, ...args: any[]): Promise<void> {
    this.server.emit('rooms', Object.keys(this.roomClients));
  }

  @SubscribeMessage('cursorPosition')
  async updateCursor(client: any, ...args: any[]): Promise<void> {
    this.server.to('room').emit('updateCursorPos', args[0]);
  }

  @SubscribeMessage('pressedKey')
  async updateCursorClick(client: any, ...args: any[]): Promise<void> {
    this.server.to('room').emit('updateKeyup', args[0]);
  }

  @SubscribeMessage('cursorClick')
  async updateKeys(client: any, ...args: any[]): Promise<void> {
    this.server.to('room').emit('updateCursorClick', args[0]);
  }

  // @SubscribeMessage('sockets')
  // handleEvent(
  //   @MessageBody() data: string,
  //   @ConnectedSocket() client: Socket,
  // ): void {
  //   from(this.server.fetchSockets()).pipe(map((sockets) => sockets));
  //   // Object.entries(this.server.engine.clients).forEach((key: [string, any], value) => {
  //   //   console.log(key[1].id);
  //   // });
  //   this.server.emit('events', data);
  // }
}
