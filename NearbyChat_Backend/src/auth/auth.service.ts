import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'; // Décorateurs et exceptions
import { JwtService } from '@nestjs/jwt'; // Gestion des tokens JWT
import * as bcrypt from 'bcrypt'; // Hachage des mots de passe
import { UserService } from '../user/user.service'; // Service pour gérer les utilisateurs

@Injectable() // Classe injectable
export class AuthService { // Logique d'authentification
  constructor(
    private readonly userService: UserService, // Accès aux utilisateurs
    private readonly jwtService: JwtService, // Création de tokens
  ) {}

  async register(username: string, pass: string) { // Inscription utilisateur
    const userExists = await this.userService.findByUsername(username); // Vérification existence
    if (userExists) { // Si existe déjà
      throw new ConflictException('Username already exists'); // Erreur 409
    }

    const hashedPassword = await bcrypt.hash(pass, 10); // Hachage sécurité
    
    const user = await this.userService.create({ // Création en base
      username,
      password: hashedPassword,
    });

    return this.generateToken(user); // Retourne token session
  }

  async login(username: string, pass: string) { // Connexion utilisateur
    const user = await this.userService.findByUsername(username); // Cherche l'utilisateur
    
    if (!user || !user.password || !(await bcrypt.compare(pass, user.password))) { // Vérification mdp
      throw new UnauthorizedException('Invalid credentials'); // Erreur 401
    }

    return this.generateToken(user); // Retourne token session
  }

  private generateToken(user: any) { // Création du jeton JWT
    const payload = { username: user.username, sub: user.id }; // Données du token
    
    return {
      access_token: this.jwtService.sign(payload), // Signature sécurisée
      user: { // Retourne les infos utilisateur
        id: user.id,
        username: user.username,
      }
    };
  }
}
