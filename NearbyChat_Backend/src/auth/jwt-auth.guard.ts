import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Gardien utilisé pour protéger les routes REST
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
