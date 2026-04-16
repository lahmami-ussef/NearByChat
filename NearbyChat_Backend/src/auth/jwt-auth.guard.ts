import { Injectable } from '@nestjs/common'; // Décorateur injectable
import { AuthGuard } from '@nestjs/passport'; // Outil de garde Passport

@Injectable() // Classe injectable
export class JwtAuthGuard extends AuthGuard('jwt') {}
 // "Vigile" bloquant si pas de JWT valide
