import { // Décorateurs WebSockets
  WebSocketGateway, // Classe passerelle
  WebSocketServer, // Lien vers le serveur
  SubscribeMessage, // Écoute d'un événement
  OnGatewayConnection, // Hook de connexion
  OnGatewayDisconnect, // Hook de déconnexion
  ConnectedSocket, // Récupère le socket client
  MessageBody, // Récupère les données envoyées
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'; // Types de Socket.io
import { JwtService } from '@nestjs/jwt'; // Service pour le token
import { ZoneService } from '../zone/zone.service'; // Calcul des zones GPS
import { MessageService } from '../message/message.service'; // Gestion des messages

@WebSocketGateway({ // Déclaration du serveur WebSocket
  cors: { // Configuration du partage de ressources
    origin: '*', // Autorise tout le monde (client mobile/web)
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect { // Passerelle de chat
  @WebSocketServer() // Instance du serveur
  server: Server; // Objet serveur global

  private activeClients = new Map<string, { userId: string; username: string; zoneId?: string }>(); // État des clients
  private zoneUserCounts = new Map<string, number>(); // Nombre d'users par zone

  constructor( // Injection des dépendances
    private readonly jwtService: JwtService, // Validation jeton
    private readonly zoneService: ZoneService, // GPS
    private readonly messageService: MessageService, // Historique
  ) {}

  async handleConnection(client: Socket) { // Quand un client se connecte
    try {
      const token = client.handshake.auth.token?.split(' ')[1] || client.handshake.auth.token; // Extraction token
      if (!token) throw new Error('No token provided'); // Erreur si vide
      
      const payload = this.jwtService.verify(token); // Vérification signature
      this.activeClients.set(client.id, { // Enregistrement client
        userId: payload.sub, // ID utilisateur
        username: payload.username, // Nom utilisateur
      });
      console.log(`Client connected: ${payload.username} (${client.id})`); // Log console
    } catch (e) {
      console.log('Unauthorized connection attempt:', e.message); // Log erreur
      client.disconnect(); // Déconnexion forcée
    }
  }

  handleDisconnect(client: Socket) { // Quand un client quitte
    const clientData = this.activeClients.get(client.id); // Récupère ses infos
    if (clientData) { // Si connu
      if (clientData.zoneId) { // S'il était dans une zone
        this.leaveZone(client, clientData.zoneId, clientData.username); // Quitte proprement
      }
      this.activeClients.delete(client.id); // Retire de la liste
      console.log(`Client disconnected: ${clientData.username} (${client.id})`); // Log console
    }
  }

  @SubscribeMessage('updateLocation') // Événement GPS reçu
  async handleUpdateLocation(
    @ConnectedSocket() client: Socket, // Socket client
    @MessageBody() body: { latitude: number; longitude: number }, // Coordonnées reçues
  ) {
    const clientData = this.activeClients.get(client.id); // Infos client
    if (!clientData) return; // Sécurité

    try {
      const newZone = await this.zoneService.resolveZone(body.latitude, body.longitude, clientData.userId); // Calcul zone

      const oldZoneId = clientData.zoneId; // Ancienne zone
      const newZoneId = newZone?.id; // Nouvelle zone

      if (oldZoneId !== newZoneId) { // Si changement réel
        if (oldZoneId) { // Si quitté zone
          this.leaveZone(client, oldZoneId, clientData.username); // Notification départ
        }
        
        if (newZoneId) { // Si entrée zone
          this.joinZone(client, newZoneId, newZone.name, clientData.username); // Notification arrivée
        } else { // Si zone déserte
          clientData.zoneId = undefined; // Reset
          client.emit('zoneAssigned', { zoneId: null, zoneName: 'Outside Zones' }); // Notification client
        }
      }
    } catch (e) {
      client.emit('error', { message: e.message }); // Notification erreur
    }
  }

  @SubscribeMessage('sendMessage') // Message reçu du client
  async handleSendMessage(
    @ConnectedSocket() client: Socket, // Client expéditeur
    @MessageBody() body: { text: string }, // Contenu texte
  ) {
    const clientData = this.activeClients.get(client.id); // Infos client
    if (!clientData || !clientData.zoneId) return; // Sécurité (doit être en zone)

    const msgh = await this.messageService.createMessage( // Sauvegarde SQL
      body.text, // Texte
      clientData.userId, // Auteur
      clientData.zoneId, // Zone
    );

    client.to(clientData.zoneId).emit('newMessage', { // Diffuse aux autres de la zone
      username: clientData.username, // Qui ?
      text: msgh.text, // Quoi ?
      createdAt: msgh.createdAt, // Quand ?
    });
  }

  @SubscribeMessage('typing') // Utilisateur "en train d'écrire"
  handleTyping(@ConnectedSocket() client: Socket) {
    const clientData = this.activeClients.get(client.id); // Infos client
    if (clientData && clientData.zoneId) { // Si en zone
      client.to(clientData.zoneId).emit('userTyping', { // Notifie les autres
        username: clientData.username, // Qui ?
      });
    }
  }

  private joinZone(client: Socket, zoneId: string, zoneName: string, username: string) { // Logique entrée
    client.join(zoneId); // Entre dans la salle virtuelle
    
    const clientData = this.activeClients.get(client.id); // Infos client
    clientData.zoneId = zoneId; // MAJ zone client
    
    let count = this.zoneUserCounts.get(zoneId) || 0; // Compte actuel
    count += 1; // Incrémente
    this.zoneUserCounts.set(zoneId, count); // MAJ compte

    client.emit('zoneAssigned', { zoneId, zoneName, userCount: count }); // Notifie le client entré
    
    this.server.to(zoneId).emit('userJoined', { // Notifie tout le monde
      username, // Qui ?
      userCount: count, // Combien ?
    });
  }

  private leaveZone(client: Socket, zoneId: string, username: string) { // Logique départ
    client.leave(zoneId); // Sort de la salle virtuelle
    
    let count = this.zoneUserCounts.get(zoneId) || 1; // Compte actuel
    count -= 1; // Décrémente
    this.zoneUserCounts.set(zoneId, count); // MAJ compte

    this.server.to(zoneId).emit('userLeft', { // Notifie tout le monde
      username, // Qui ?
      userCount: count, // Combien ?
    });
  }
}
