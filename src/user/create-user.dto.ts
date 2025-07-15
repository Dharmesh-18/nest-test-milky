import { IsString, MinLength, IsEnum, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Role } from '../auth/roles.enum';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;

  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  collectedToday?: boolean;

  @IsNumber()
  @IsOptional()
  monthlyAmount?: number;

  @IsBoolean()
  @IsOptional()
  paid?: boolean;
}
