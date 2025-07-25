import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('User role:', user.role, 'Required roles:', roles);
    return this.matchRoles(roles, user.role);
  }

  matchRoles(roles: string[], userRole: string): boolean {
    return roles.some((role) => role === userRole?.toLowerCase());
  }
}
