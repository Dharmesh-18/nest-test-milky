import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { Role } from '../auth/roles.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('by-role/:role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'worker')
  @ApiOperation({ summary: 'Get users by role' })
  @ApiParam({ name: 'role', enum: Role, description: 'User role (owner, worker, customer)' })
  @ApiResponse({ status: 200, description: 'Returns users by specified role' })
  @ApiBearerAuth()
  findAllUsersByRole(@Param('role') role: Role) {
    return this.userService.findAllUsersByRole(role);
  }

  @Post('create-with-role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'worker')
  @ApiOperation({ summary: 'Create a user with a specific role' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 409, description: 'Username already exists' })
  @ApiBearerAuth()
  createUserWithRole(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUserWithRole(createUserDto, createUserDto.role);
  }

  @Get(':id/role/:role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'worker', 'customer')
  @ApiOperation({ summary: 'Get a single user by ID and role' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiParam({ name: 'role', enum: Role, description: 'User role' })
  @ApiResponse({ status: 200, description: 'Returns the user' })
  @ApiResponse({ status: 403, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  findOneUserByIdAndRole(@Param('id') id: string, @Param('role') role: Role, @Request() req) {
    
    if (req.user.role === Role.CUSTOMER && req.user.userId !== id) {
      throw new ForbiddenException('Unauthorized');
    }
    return this.userService.findOneUserByIdAndRole(id, role);
  }

  @Patch(':id/role/:role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'worker')
  @ApiOperation({ summary: 'Update a user by ID and role' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiParam({ name: 'role', enum: Role, description: 'User role' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  updateUserByIdAndRole(@Param('id') id: string, @Param('role') role: Role, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUserByIdAndRole(id, updateUserDto, role);
  }

  @Delete(':id/role/:role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @ApiOperation({ summary: 'Delete a user by ID and role' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiParam({ name: 'role', enum: Role, description: 'User role' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  removeUserByIdAndRole(@Param('id') id: string, @Param('role') role: Role) {
    return this.userService.removeUserByIdAndRole(id, role);
  }

  @Patch(':id/collect')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'worker')
  @ApiOperation({ summary: 'Mark milk collected for a customer user' })
  @ApiParam({ name: 'id', description: 'Customer User ID' })
  @ApiResponse({ status: 200, description: 'Customer user updated successfully' })
  @ApiResponse({ status: 404, description: 'Customer user not found' })
  @ApiBearerAuth()
  collectMilk(@Param('id') id: string) {
    return this.userService.updateUserByIdAndRole(id, { collectedToday: true }, Role.CUSTOMER);
  }

  @Patch(':id/pay')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'worker')
  @ApiOperation({ summary: 'Mark monthly amount paid for a customer user' })
  @ApiParam({ name: 'id', description: 'Customer User ID' })
  @ApiResponse({ status: 200, description: 'Customer user updated successfully' })
  @ApiResponse({ status: 404, description: 'Customer user not found' })
  @ApiBearerAuth()
  pay(@Param('id') id: string) {
    return this.userService.updateUserByIdAndRole(id, { paid: true }, Role.CUSTOMER);
  }
}


