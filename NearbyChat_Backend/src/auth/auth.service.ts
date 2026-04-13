import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

/**
 * Le Service contient la "Logique Métier" (Business Logic).
 * @Injectable() indique que cette classe peut être injectée comme dépendance.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService, // Pour accéder aux données utilisateurs
    private readonly jwtService: JwtService,   // Pour générer des tokens de sécurité
  ) {}

  /**
   * Enregistrement d'un nouvel utilisateur dans le système.
   */
  async register(username: string, pass: string) {
    // 1. Vérifier si un utilisateur avec ce nom existe déjà
    const userExists = await this.userService.findByUsername(username);
    if (userExists) {
      // Lance une erreur 409 (Conflict) si le nom est pris
      throw new ConflictException('Username already exists');
    }

    // 2. Hasher le mot de passe pour ne pas le stocker en clair
    // bcrypt transforme "moncode123" en quelque chose d'illisible
    const hashedPassword = await bcrypt.hash(pass, 10);
    
    // 3. Créer l'utilisateur via le service UserService
    const user = await this.userService.create({
      username,
      password: hashedPassword,
    });

    // 4. Retourner un token JWT pour que l'utilisateur soit connecté immédiatement
    return this.generateToken(user);
  }

  /**
   * Vérifie les identifiants pour connecter un utilisateur existing.
   */
  async login(username: string, pass: string) {
    // 1. Récupérer l'utilisateur depuis la base de données
    const user = await this.userService.findByUsername(username);
    
    // 2. Vérifier si l'utilisateur existe et si le mot de passe correspond au hash stocké
    if (!user || !user.password || !(await bcrypt.compare(pass, user.password))) {
      // Lance une erreur 401 (Unauthorized) si les identifiants sont faux
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Si tout est OK, générer et renvoyer le token JWT
    return this.generateToken(user);
  }

  /**
   * Méthode privée pour générer le token JWT d'authentification.
   */
  private generateToken(user: any) {
    // Le payload est le contenu public transporté par le token
    const payload = { username: user.username, sub: user.id };
    
    return {
      // Signe le token avec la clé secrète configurée dans le module
      access_token: this.jwtService.sign(payload), 
      user: {
        id: user.id,
        username: user.username,
      }
    };
  }
}
