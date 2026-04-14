import { Controller, Get, UseGuards, Request } from '@nestjs/common'; // Décorateurs pour les routes et la sécurité
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Le vigile qui vérifie le token
import { UserService } from './user.service'; // Service pour récupérer les données

@Controller('user') // Préfixe des routes (ex: /user/...)
export class UserController { // Gère les requêtes HTTP liées à l'utilisateur
  constructor(private readonly userService: UserService) {} // Injecte le service utilisateur

  @UseGuards(JwtAuthGuard) // Protège la route : token JWT valide requis
  @Get('me') // Définit la route GET /user/me
  async getProfile(@Request() req: any) { // Récupère le profil de l'utilisateur connecté
    const user = await this.userService.findById(req.user.id); // Cherche l'utilisateur via son ID (du token)
    const { password, ...result } = user; // Sépare le mot de passe du reste
    return result; // Renvoie l'utilisateur sans le mot de passe
  }
}
