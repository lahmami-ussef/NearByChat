import { ExtractJwt, Strategy } from 'passport-jwt'; // Outils d'extraction et stratégie JWT
import { PassportStrategy } from '@nestjs/passport'; // Intégration Passport avec NestJS
import { Injectable } from '@nestjs/common'; // Décorateur injectable
import { ConfigService } from '@nestjs/config'; // Accès à la configuration (.env)

@Injectable() // Classe injectable
export class JwtStrategy extends PassportStrategy(Strategy) { // Logique de validation JWT
  constructor(private configService: ConfigService) { // Injecte ConfigService
    super({ // Appelle PassportStrategy avec les options
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrait le token du header
      ignoreExpiration: false, // Rejette le token s'il a expiré
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secret', // Clé de décodage
    });
  }

  async validate(payload: any) { // Valide le contenu du token
    return { id: payload.sub, username: payload.username }; // Infos mises dans req.user
  }
}
