import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class GenerateOtpDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please give correct mailed' })
  @IsString()
  readonly email: string;
}
export class ResetPassword_otp_Verification {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please give correct mailed' })
  @IsString()
  readonly email: string;
  @IsNotEmpty()
  @IsString()
  readonly otp: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'password length should be 6' })
  readonly password: string;
}
