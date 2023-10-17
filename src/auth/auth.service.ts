import {
  Logger,
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { SignUpInput, AuthResponse, JwtPayload, AccessToken } from './dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async createAccessToken(
    jwtPayload: JwtPayload,
  ): Promise<AccessToken> {
    const accessToken = this.jwtService.sign(jwtPayload, {
      expiresIn: this.configService.get('jwt.expiration'),
      secret: this.configService.get('jwt.secret'),
    });

    return accessToken;
  }

  async signUp(signUpInput: SignUpInput): Promise<AuthResponse> {
    const foundUser = await this.userService.findByEmail(signUpInput.email);

    if (foundUser) {
      throw new BadRequestException('Email is already in use.');
    }

    const salt = await bcrypt.genSalt(this.configService.get('bcrypt.rounds'));
    const hashedPassword = await bcrypt.hash(signUpInput.password, salt);

    const { id, email }: JwtPayload = await this.userService.create({
      ...signUpInput,
      password: hashedPassword,
    });

    return { accessToken: await this.createAccessToken({ id, email }) };
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      accessToken: await this.createAccessToken({
        id: user.id,
        email,
      }),
    };
  }
}
