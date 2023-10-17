import { UseGuards } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CurrentUser } from '../shared/decorator/current-user.decorator';
import { JwtAuthGuard } from '../shared/guard/jwt-auth.guard';
import { User } from './entities/user.entity';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { name: 'UserProfile' })
  async userProfile(@CurrentUser() { email }: User): Promise<User> {
    return this.userService.findByEmail(email);
  }
}
