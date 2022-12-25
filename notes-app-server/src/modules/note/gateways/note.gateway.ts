import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

enum NoteEvent {
  RoomJoinRequested = 'room-join-requested',
  NoteUpdateRequested = 'note-update-requested',
  NoteUpdated = 'note-updated',
  NoteCreateRequested = 'note-create-requested',
  NoteCreated = 'note-created',
}
@WebSocketGateway({
  cors: true,
  namespace: 'notes',
  transports: ['websocket', 'polling'],
})
export class NoteGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() wss: Server;
  private logger: Logger = new Logger(NoteGateway.name);

  afterInit() {
    this.logger.log('Initialized!');
  }

  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    this.logger.log(`Client connected with args: ${JSON.stringify(args)}`);
  }

  @SubscribeMessage(NoteEvent.RoomJoinRequested)
  handleRoomJoin(client: Socket, { room }: { room: string }) {
    this.logger.debug(`Client's room join requested: ${JSON.stringify(room)}`);
    client.join(room);
  }

  @SubscribeMessage(NoteEvent.NoteUpdateRequested)
  handleNoteUpdateRequested(
    client: Socket,
    note: {
      id: string;
      userId: string;
      title: string;
      body: string;
      createdAt: number;
      updatedAt: number;
    },
  ) {
    this.logger.debug(`Client NOTE_UPDATE_REQUESTED: ${JSON.stringify(note)}`);
    client.broadcast.to(note.userId).emit(NoteEvent.NoteUpdated, note);
  }

  @SubscribeMessage(NoteEvent.NoteCreateRequested)
  handleNoteCreateRequested(
    client: Socket,
    note: {
      id: string;
      userId: string;
      title: string;
      body: string;
      createdAt: number;
      updatedAt: number;
    },
  ) {
    this.logger.debug(
      `Client ${NoteEvent.NoteCreateRequested}: ${JSON.stringify(note)}`,
    );
    client.broadcast.to(note.userId).emit(NoteEvent.NoteCreated, note);
  }
}
