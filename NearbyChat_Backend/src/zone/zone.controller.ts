import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ZoneService } from './zone.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsNumber } from 'class-validator';

export class ResolveZoneDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}

@UseGuards(JwtAuthGuard)
@Controller('zone')
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) {}

  // POST /zone/resolve - Retourne la zone correspondante ou vide
  @Post('resolve')
  async resolve(@Body() dto: ResolveZoneDto, @Request() req: any) {
    // req.user est défini par le JwtAuthGuard
    const zone = await this.zoneService.resolveZone(dto.latitude, dto.longitude, req.user.id);
    return zone || { message: 'No zone found for these coordinates' };
  }

  // GET /zone/all - Retourne toutes les zones (userCount peut nécessiter l'intégration avec le Gateway WebSocket)
  @Get('all')
  async getAllZones() {
    // Note: Pour une implémentation complète de userCount temps réel, 
    // on injecterait le ChatGateway pour récupérer l'état des rooms
    return this.zoneService.getAllZonesWithUserCount();
  }
}
