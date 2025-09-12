import { AuthResponse } from '../../domain/model/auth.entity';
import { RegisterUserInput } from '../../adapter/input/register-user.input';
import { User } from '../../../user/domain/model/user.entity';

export const AUTH_USECASE = 'AUTH_USECASE';

export interface IAuthUsecase {
  signInByEmailAndPassword(email: string, password: string): Promise<AuthResponse>;
  registerUser(input: RegisterUserInput): Promise<AuthResponse>;
  signInWithFirebase(idToken: string): Promise<AuthResponse>;
  validateToken(token: string): Promise<User>;
  resetPassword(email: string): Promise<boolean>;
}