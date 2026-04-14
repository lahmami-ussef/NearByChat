import { Module } from '@nestjs/common'; // Décorateur module
import { JwtModule } from '@nestjs/jwt'; // Module JWT pour Nest
import { PassportModule } from '@nestjs/passport'; // Module Passport pour Nest
import { ConfigModule, ConfigService } from '@nestjs/config'; // Gestion config
import { AuthService } from './auth.service'; // Service auth local
import { AuthController } from './auth.controller'; // Contrôleur auth local
import { UserModule } from '../user/user.module'; // Import du module User
import { JwtStrategy } from './jwt.strategy'; // Stratégie de validation

@Module({ // Déclaration module auth
  imports: [
    UserModule, // Nécessaire pour chercher les users
    PassportModule, // Nécessaire pour les stratégies
    JwtModule.registerAsync({ // Config asynchrone du JWT
      imports: [ConfigModule], // Import config
      inject: [ConfigService], // Injecte le service config
      useFactory: async (configService: ConfigService) => ({ // Fabrique la config
        secret: configService.get<string>('JWT_SECRET') || 'secret', // Clé secrète
        signOptions: { expiresIn: '7d' }, // Durée de validité
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy], // Services et stratégies locaux
  controllers: [AuthController], // Contrôleur local
  exports: [AuthService, JwtModule], // Partage auth avec le reste
})
export class AuthModule {} // Classe module auth
