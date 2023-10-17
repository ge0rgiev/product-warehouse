import { User } from '../user/entities/user.entity';

export type UserContext = {
  req: {
    user: User;
  };
};
