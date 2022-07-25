import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

export interface UserRepository extends Repository<User> {
  this: Repository<User>;

  getUserWithPassword(userId: number): Promise<any>;
}

export const customUserRepositoryMethods: Pick<
  UserRepository,
  'getUserWithPassword'
> = {
  // Get access token from Kakao Auth Server
  async getUserWithPassword(userId: number): Promise<any> {
    try {
      const user = await this.users.findOne({
        where: { id: userId },
        select: { id: true, email: true, name: true, password: true },
      });

      return { ok: true, user };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  },
};
