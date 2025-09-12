import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { AuthResponse } from '../../domain/model/auth.entity';
import { IAuthUsecase, AUTH_USECASE } from '../../usecase/interface/auth.usecase.interface';
import { SignInInput, RegisterUserInput } from '../input';
import { User } from '../../../user/domain/model/user.entity';
import { ValidateTokenInput } from '../input/validate-token.input';
import { ResetPasswordInput } from '../input/reset-password.input';

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(
    @Inject(AUTH_USECASE)
    private readonly authUsecase: IAuthUsecase
  ) {}

  // Email + password login
  @Mutation(() => AuthResponse)
  async signInByEmailAndPassword(
    @Args('input') input: SignInInput
  ): Promise<AuthResponse> {
    return this.authUsecase.signInByEmailAndPassword(input.email, input.password);
  }

  // Email + password registration
  @Mutation(() => AuthResponse)
  async registerUser(
    @Args('input') input: RegisterUserInput
  ): Promise<AuthResponse> {
    return this.authUsecase.registerUser(input);
  }

  // Google/Apple sign-in using Firebase ID token
  @Mutation(() => AuthResponse)
  async signInWithFirebase(
    @Args('idToken') idToken: string
  ): Promise<AuthResponse> {
    return this.authUsecase.signInWithFirebase(idToken);
  }

  @Mutation(() => User)
  async validateToken(@Args('input') input: ValidateTokenInput) {
    return this.authUsecase.validateToken(input.token);
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Args('input') input: ResetPasswordInput
  ): Promise<boolean> {
    return this.authUsecase.resetPassword(input.email);
  }
}
