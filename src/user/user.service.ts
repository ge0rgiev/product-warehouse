import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRespository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userEntity = this.userRespository.create(createUserDto);
    return this.userRespository.save(userEntity);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRespository.findOneBy({ email });
  }
}
