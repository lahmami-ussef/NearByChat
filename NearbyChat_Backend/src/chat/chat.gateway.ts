import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ZoneService } from '../zone/zone.service';
import { MessageService } from '../message/message.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Dictionnaires pour stocker l'état des connexions
  // clientId -> userId / username / currentZoneId
  private activeClients = new Map<string, { userId: string; username: string; zoneId?: string }>();
  // zoneId -> count
  private zoneUserCounts = new Map<string, number>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly zoneService: ZoneService,
    private readonly messageService: MessageService,
  ) {}

  // Sécurisation à la connexion (vérifier JWT)
  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token?.split(' ')[1] || client.handshake.auth.token; // format "Bearer token" ou juste "token"
      if (!token) throw new Error('No token provided');
      
      const payload = this.jwtService.verify(token);
      this.activeClients.set(client.id, {
        userId: payload.sub,
        username: payload.username,
      });
      console.log(`Client connected: ${payload.username} (${client.id})`);
    } catch (e) {
      console.log('Unauthorized connection attempt:', e.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const clientData = this.activeClients.get(client.id);
    if (clientData) {
      if (clientData.zoneId) {
        this.leaveZone(client, clientData.zoneId, clientData.username);
      }
      this.activeClients.delete(client.id);
      console.log(`Client disconnected: ${clientData.username} (${client.id})`);
    }
  }

  // updateLocation event -> Résout la zone et gère le changement de room
  @SubscribeMessage('updateLocation')
  async handleUpdateLocation(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { latitude: number; longitude: number },
  ) {
    const clientData = this.activeClients.get(client.id);
    if (!clientData) return;

    try {
      // Résolution de la zone côté backend (sécurité)
      const newZone = await this.zoneService.resolveZone(body.latitude, body.longitude, clientData.userId);

      const oldZoneId = clientData.zoneId;
      const newZoneId = newZone?.id;

      // Si changement de zone (y compris passage à aucune zone)
      if (oldZoneId !== newZoneId) {
        if (oldZoneId) {
          this.leaveZone(client, oldZoneId, clientData.username);
        }
        
        if (newZoneId) {
          this.joinZone(client, newZoneId, newZone.name, clientData.username);
        } else {
          // L'utilisateur n'est plus dans aucune zone (optionnel, on peut le notifier)
          clientData.zoneId = undefined;
          client.emit('zoneAssigned', { zoneId: null, zoneName: 'Outside Zones' });
        }
      }
    } catch (e) {
      client.emit('error', { message: e.message });
    }
  }

  // sendMessage event -> Enregistre et broadcast
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { text: string },
  ) {
    const clientData = this.activeClients.get(client.id);
    if (!clientData || !clientData.zoneId) return;

    // Sauvegarde en DB
    const msgh = await this.messageService.createMessage(
      body.text,
      clientData.userId,
      clientData.zoneId,
    );

    // Broadcast aux membres de la zone (sauf l'expéditeur qui l'affiche déjà localement)
    client.to(clientData.zoneId).emit('newMessage', {
      username: clientData.username,
      text: msgh.text,
      createdAt: msgh.createdAt,
    });
  }

  // typing event -> Broadcast aux autres
  @SubscribeMessage('typing')
  handleTyping(@ConnectedSocket() client: Socket) {
    const clientData = this.activeClients.get(client.id);
    if (clientData && clientData.zoneId) {
      // Envoyer à tous sauf à l'expéditeur
      client.to(clientData.zoneId).emit('userTyping', {
        username: clientData.username,
      });
    }
  }

  // --- Helpers ---
  private joinZone(client: Socket, zoneId: string, zoneName: string, username: string) {
    client.join(zoneId);
    
    // MAJ de l'état
    const clientData = this.activeClients.get(client.id);
    clientData.zoneId = zoneId;
    
    let count = this.zoneUserCounts.get(zoneId) || 0;
    count += 1;
    this.zoneUserCounts.set(zoneId, count);

    // Retour au client
    client.emit('zoneAssigned', { zoneId, zoneName, userCount: count });
    
    // Broadcast notification "userJoined"
    this.server.to(zoneId).emit('userJoined', {
      username,
      userCount: count,
    });
  }

  private leaveZone(client: Socket, zoneId: string, username: string) {
    client.leave(zoneId);
    
    let count = this.zoneUserCounts.get(zoneId) || 1;
    count -= 1;
    this.zoneUserCounts.set(zoneId, count);

    // Broadcast notification "userLeft"
    this.server.to(zoneId).emit('userLeft', {
      username,
      userCount: count,
    });
  }
}
