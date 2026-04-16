import { Injectable, NotFoundException } from '@nestjs/common';
 // Importe les exceptions et le décorateur
import { InjectRepository } from '@nestjs/typeorm';
 // Outil pour injecter le dépôt DB
import { Repository } from 'typeorm'; 
// Type représentant un dépôt SQL
import { User } from './user.entity'; 
// Importe l'entité User

@Injectable() // Rend la classe injectable ailleurs
export class UserService { // Logique métier pour les utilisateurs
  constructor(
    @InjectRepository(User) // Injecte la table User
    private readonly userRepository: Repository<User>, // Accès aux méthodes SQL (find, save...)
  ) {}

  async findByUsername(username: string): Promise<User | null> { // Cherche un user par son nom
    return this.userRepository.findOne({ where: { username } }); // Requête SELECT simple
  }

  async findById(id: string): Promise<User> { // Cherche un user par son UUID
    const user = await this.userRepository.findOne({ where: { id } }); // Requête SELECT par ID
    if (!user) { // Si rien n'est trouvé
      throw new NotFoundException('User not found'); // Renvoie une erreur 404
    }
    return user; // Renvoie l'utilisateur trouvé
  }

  async create(user: Partial<User>): Promise<User> { // Crée un nouvel utilisateur
    const newUser = this.userRepository.create(user); // Prépare l'objet en mémoire
    return this.userRepository.save(newUser); // Exécute l'INSERT en base
  }
}
