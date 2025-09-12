import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await this.firebaseService.verifyToken(token);

      // Add decoded user info to request for @CurrentUser decorator
      req.user = {
        id: decodedToken.uid,
        email: decodedToken.email,
        type: decodedToken.claims?.type || 'user',
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

