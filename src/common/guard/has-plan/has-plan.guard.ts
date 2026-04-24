import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserRepository } from '../../repository/user/user.repository';

@Injectable()
export class HasPlanGuard implements CanActivate {
  constructor(private readonly userRepository: UserRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const user_id = req.user.userId;
      const userDetails = await this.userRepository.getUserDetails(user_id);
      return true;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
