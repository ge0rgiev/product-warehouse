import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpInput, SignInInput, AuthResponse } from './dto';

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'SignUp' })
  async signUp(
    @Args('signUpInput') signUpInput: SignUpInput,
  ): Promise<AuthResponse> {
    return this.authService.signUp(signUpInput);
  }

  @Mutation(() => AuthResponse, { name: 'SignIn' })
  async signIn(
    @Args('signInInput') { email, password }: SignInInput,
  ): Promise<AuthResponse> {
    return this.authService.signIn(email, password);
  }
}
