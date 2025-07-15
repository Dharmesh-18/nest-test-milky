import { Controller, Request, Post, UseGuards, Body, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiBody({ schema: { example: { username: 'testuser', password: 'password123' } } })
  @ApiResponse({ status: 200, description: 'User logged in successfully', schema: { example: { access_token: 'jwt_token' } } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Req() req) {
    console.log('User logged in:', req.user);
    return this.authService.login(req.user);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Username already exists' })
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }
}

