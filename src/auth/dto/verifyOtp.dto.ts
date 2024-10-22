import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please give correct mailed' })
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly otp: string;
}
