import { Injectable, Inject, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { IAuthUsecase } from './interface/auth.usecase.interface';
import { AuthResponse } from '../domain/model/auth.entity';
import { IUserUsecase, USER_USECASE } from '../../user/usecase/interface/user.usecase.interface';
import { RegisterUserInput } from '../adapter/input/register-user.input';
import { FirebaseService } from '../../../framework/firebase/firebase.service';
import * as admin from 'firebase-admin';
import { User } from '../../user/domain/model/user.entity';
import axios from 'axios';

@Injectable()
export class AuthUsecase implements IAuthUsecase {
  constructor(
    @Inject(USER_USECASE)
    private readonly userUsecase: IUserUsecase,
    private readonly firebaseService: FirebaseService
  ) {}

  /**
   * Sign in using email & password
   * (Client should already handle password verification via Firebase Client SDK)
   * Backend only verifies ID token afterward
   */
  async signInByEmailAndPassword(email: string, password: string): Promise<AuthResponse> {
    try {
      // 1. Sign in via Firebase REST API
      const apiKey = process.env.FIREBASE_API_KEY; // Make sure this is set in env
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

      const response = await axios.post(url, {
        email,
        password,
        returnSecureToken: true,
      });

      const idToken = response.data.idToken; // Firebase ID Token

      // 2. Verify user exists in our database
      const user = await this.userUsecase.findByEmail(email);
      if (!user) {
        throw new NotFoundException('User account not found. Please register.');
      }

      // 3. Return token + user profile
      return {
        auth: {
          token: idToken,
          expiresIn: 3600, // Firebase ID tokens expire in 1 hour
        },
        user,
      };
    } catch (error) {
      throw new UnauthorizedException(
        error.response?.data?.error?.message || 'Invalid credentials'
      );
    }
  }

  /**
   * Register new user
   */
  async registerUser(input: RegisterUserInput): Promise<AuthResponse> {
    const existingUser = await this.userUsecase.findByEmail(input.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    try {
      // 1. Create user in Firebase
      const userRecord = await admin.auth().createUser({
        email: input.email,
        password: input.password,
        emailVerified: false,
      });

      // 2. Create user in local DB
      const newUser = await this.userUsecase.create({
        email: input.email,
        password: input.password,
        firebaseUid: userRecord.uid,
      });

      // 3. Immediately sign in via Firebase REST API to get ID token
      const apiKey = process.env.FIREBASE_API_KEY; // Must be set in env
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

      const response = await axios.post(url, {
        email: input.email,
        password: input.password,
        returnSecureToken: true,
      });

      const idToken = response.data.idToken;

      // 4. Return token and user profile
      return {
        auth: {
          token: idToken,
          expiresIn: 3600, // Firebase ID token default expiry
        },
        user: newUser,
      };
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        throw new ConflictException('Email already registered with Firebase');
      }
      throw new Error(`Failed to register user: ${error.message}`);
    }
  }


  /**
   * Sign in with Firebase ID token (Google/Apple/email-password)
   */
  async signInWithFirebase(idToken: string): Promise<AuthResponse> {
    try {
      // Verify the ID token
      const decoded = await this.firebaseService.verifyToken(idToken);

      if (!decoded.email) {
        throw new UnauthorizedException('Token does not contain email');
      }

      // Ensure user exists in DB
      let user = await this.userUsecase.findByEmail(decoded.email);
      if (!user) {
        user = await this.userUsecase.create({
          email: decoded.email,
          firebaseUid: decoded.uid,
          password: undefined,
        });
      }

      // Return ID token back to client (no custom token)
      return {
        auth: {
          token: idToken,
          expiresIn: 3600,
        },
        user,
      };
    } catch (error) {
      throw new UnauthorizedException(`Failed to verify Firebase token: ${error.message}`);
    }
  }

  /**
   * Validate Firebase ID token and return user profile
   */
  async validateToken(token: string): Promise<User> {
    const decoded = await this.firebaseService.verifyToken(token);

    if (!decoded.email && !decoded.uid) {
      throw new UnauthorizedException('Invalid token: no user identifier found');
    }

    // Find user by email (preferred)
    let user: User | null = null;
    if (decoded.email) {
      user = await this.userUsecase.findByEmail(decoded.email);
    }

    // Fallback to Firebase UID if email not found
    if (!user && decoded.uid) {
      user = await this.userUsecase.findByFirebaseUid(decoded.uid);
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async resetPassword(email: string): Promise<boolean> {
    try {
      const apiKey = process.env.FIREBASE_API_KEY;
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`;

      await axios.post(url, {
        requestType: 'PASSWORD_RESET',
        email,
      });

      return true;
    } catch (error) {
      console.error('Error sending reset email:', error.response?.data || error.message);
      return false;
    }
  }

}
