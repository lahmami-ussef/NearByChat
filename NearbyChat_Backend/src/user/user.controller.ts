import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Route protégée pour récupérer le profil de l'utilisateur connecté
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: any) {
    const user = await this.userService.findById(req.user.id);
    // Exclure le mot de passe de la réponse
    const { password, ...result } = user;
    return result;
  }
}
