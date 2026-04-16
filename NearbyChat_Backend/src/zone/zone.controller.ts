import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common'; // Décorateurs NestJS
import { ZoneService } from './zone.service'; // Import du service Zone
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Protection des routes
import { IsNumber } from 'class-validator'; // Outil de validation de type

export class ResolveZoneDto { // Modèle de données envoyées par le client
  @IsNumber() // Vérifie que c'est un nombre
  latitude: number; // Coordonnée Latitude

  @IsNumber() // Vérifie que c'est un nombre
  longitude: number; // Coordonnée Longitude
}

@UseGuards(JwtAuthGuard) // Applique la sécurité sur tout le contrôleur
@Controller('zone') // Chemin de base : /zone
export class ZoneController { // Gère les requêtes HTTP zones
  constructor(private readonly zoneService: ZoneService) {} // Injecte le service Zone

  @Post('resolve') // Route POST /zone/resolve
  async resolve(@Body() dto: ResolveZoneDto, @Request() req: any) { // Trouve la zone d'un point
    const zone = await this.zoneService.resolveZone(dto.latitude, dto.longitude, req.user.id); 
    // Appel service
    return zone || { message: 'No zone found for these coordinates' }; // Renvoie la zone ou un message
  }

  @Get('all') // Route GET /zone/all
  async getAllZones() { // Liste toutes les zones existantes
    return this.zoneService.getAllZonesWithUserCount(); // Appel service
  }
}
