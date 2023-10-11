import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @Length(2, 30)
  @IsString()
  firstName: string;

  @Length(2, 30)
  @IsString()
  lastName: string;

  @IsString()
  @Length(10, 11)
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsString()
  gender: string;
}

export class AuthDto {
  @IsString()
  wallet_type: string;

  @IsNumber()
  balance: string;

  @IsString()
  wallet_id: string;
}

export class UserByEmailDto {
  @IsString()
  email: string;
}

export class TokenDto {
  @IsString()
  token: string;

  @IsString()
  @IsOptional()
  user: string;
}
