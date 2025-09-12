import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

interface TokenPayload {
  token: string;
  expiresIn: number;
}

interface TokenOptions {
  expiresIn?: number;
}
interface DecodedCustomToken {
  uid: string;
  claims: Record<string, any>;
}

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly GOOGLE_IDENTITY_TOOLKIT_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken';

  constructor(private configService: ConfigService) { }

  onModuleInit() {
    if (!admin.apps.length) {
      const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
      const privateKey = this.configService
        .get<string>('FIREBASE_PRIVATE_KEY')
        ?.replace(/\\n/g, '\n');
      const clientEmail = this.configService.get<string>(
        'FIREBASE_CLIENT_EMAIL',
      );

      if (!projectId || !privateKey || !clientEmail) {
        throw new Error(
          'Missing required Firebase configuration. Please check your environment variables.',
        );
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          privateKey,
          clientEmail,
        }),
      });
    }
  }

  async createToken(
    uid: string,
    claims: Record<string, any>,
    options?: TokenOptions,
  ): Promise<TokenPayload> {
    try {
      const authTokenExpiration =
        this.configService.get<number>('AUTH_TOKEN_EXPIRATION') ?? 3600;
      const refreshTokenExpiration =
        this.configService.get<number>('REFRESH_TOKEN_EXPIRATION') ?? 7200;

      const defaultExpiresIn =
        claims.type === 'refresh'
          ? refreshTokenExpiration
          : authTokenExpiration;
      const expiresIn = options?.expiresIn ?? defaultExpiresIn;

      const token = await admin.auth().createCustomToken(uid, claims);
      return {
        token,
        expiresIn,
      };
    } catch (error) {
      throw new Error(`Failed to create Firebase token: ${error.message}`);
    }
  }

  async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
    try {
      return await admin.auth().verifyIdToken(token);
    } catch (error) {
      throw new Error(`Failed to verify Firebase token: ${error.message}`);
    }
  }

  async revokeUserTokens(uid: string): Promise<void> {
    try {
      await admin.auth().revokeRefreshTokens(uid);
    } catch (error) {
      throw new Error(`Failed to revoke user tokens: ${error.message}`);
    }
  }

  async signInWithCustomToken(token: string): Promise<string> {
    const apiKey = this.configService.get<string>('FIREBASE_API_KEY');

    if (!apiKey) {
      throw new Error('Missing required Firebase API key. Please check your environment variables.');
    }

    const response = await fetch(`${this.GOOGLE_IDENTITY_TOOLKIT_URL}?key=${apiKey}`, {
      method: 'POST',
      body: JSON.stringify({
        token,
        returnSecureToken: true,
      }),
    });

    const data = await response.json();

    return data?.idToken ?? null;
  }

  async findById(uid: string): Promise<admin.auth.UserRecord> {
    return await admin.auth().getUser(uid);
  }
}
