import { Field, ObjectType } from '@nestjs/graphql';

export type AccessToken = string;

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;
}
