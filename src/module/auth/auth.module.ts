import { Module } from '@nestjs/common';
import { AuthResolver } from './adapter/resolver/auth.resolver';
import { AuthUsecase } from './usecase/auth.usecase';
import { AUTH_USECASE } from './usecase/interface/auth.usecase.interface';
import { UserModule } from '../user/user.module';
import { FirebaseModule } from '../../framework/firebase/firebase.module';

@Module({
  imports: [
    UserModule, 
    FirebaseModule
  ],
  providers: [
    AuthResolver,
    {
      provide: AUTH_USECASE,
      useClass: AuthUsecase,
    },
  ],
  exports: [
    {
      provide: AUTH_USECASE,
      useClass: AuthUsecase,
    }
  ],
})
export class AuthModule {} 