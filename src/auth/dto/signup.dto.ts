import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SingUpDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'PLEASE GIVE CORRECT MAILID' })
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'password length should be 6' })
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  age: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  gender: string;
}
