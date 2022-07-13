import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AllowedRoles } from './role.decorator';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles>( // guard checks the 'metadata' of the req to see if there's a role.
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      // It means that i didn't set any metadata.
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    if (!user) {
      return false; // block req
    }
    return roles.includes('Any') || roles.includes(user.role); // continue req
  }
}
