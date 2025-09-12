import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import environment from '../nest/config/constant/environment.config';

@Injectable()
export class FirebaseConfig {
  private readonly config: admin.ServiceAccount;

  constructor() {
    const { projectId, privateKey, clientEmail } = environment.firebase;
    
    if (!projectId || !privateKey || !clientEmail) {
      throw new Error('Missing required Firebase configuration. Please check your environment variables.');
    }

    this.config = {
      projectId,
      privateKey,
      clientEmail,
    };
  }

  getConfig(): admin.ServiceAccount {
    return this.config;
  }
} 
