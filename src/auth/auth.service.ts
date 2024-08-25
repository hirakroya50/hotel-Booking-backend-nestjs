import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  GenerateOtpDto,
  ResetPassword_otp_Verification,
} from './dto/generateOtp.dto';
import { SingUpDto } from './dto/signup.dto';
import { UserSingupOtp } from './schemas/userSingupOtp.schema';
import { varifyOtpDto } from './dto/verifyOtp.dto';
import * as bcrypt from 'bcryptjs';
import { JsonWebTokenError } from 'jsonwebtoken';
import {
  ForgetPasswordDto,
  ForgetPasswordDto_tokenGeneration,
  loginDto,
} from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { GoogleLoginDto } from './dto/GoogleLogin.dto';
import { forgetPasswordEmail } from './emailText/email';
const nodemailer = require('nodemailer');
const crypto = require('crypto');
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(UserSingupOtp.name)
    private userSingUPOtpModel: Model<UserSingupOtp>,
    private jwtService: JwtService,
  ) {}

  async getAlluser() {
    // let email:"royhirakp@gmmail.com"
    // const JwtToken = await this.jwtService.signAsync({
    //   email,
    // });

    // console.log(JwtToken)

    // jwt to get the email
    const all_user = await this.userModel.find();
    return all_user;
  }

  async genRateOTPforSignup(generateOtpDto: GenerateOtpDto) {
    try {
      let { email } = generateOtpDto;
      //check the email is exist in the database or not

      let user_exist = await this.userModel.findOne({ email });
      // console.log(user_exist, 'userrr');
      if (user_exist) {
        throw new ConflictException('email exist');
      }
      let alreadyGeneratedOTP = await this.userSingUPOtpModel.findOne({
        email,
      });

      if (alreadyGeneratedOTP) {
        throw new ConflictException(
          'otp already generated exist. please check your mail',
        );
      }

      let otp = Math.floor(100000 + Math.random() * 900000);

      // send the otp to the user mail
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_EMAIL_KEY,
        },
      });
      await transporter.sendMail(
        {
          from: 'royhiark@gmail.com', // sender address
          to: email, // list of receivers
          subject: 'Hotel Booking page , OTP MAIL',
          text: ` OTP MAIL mail`, // plain text body
          html: ` <body style="font-family: system-ui, math, sans-serif">
              <div>
                Hotel Booking page , OTP MAIL
                <br />
                  <h1>YOUR OTP IS : ${otp}</h1>
           
              </div>
            </body>`, // html body
        },

        (error, info) => {
          if (error) {
            console.log(error);
            return {
              status: false,
              error,
            };
          } else {
            return {
              status: true,
              msg: 'eamil send susecfull',
            };
          }
        },
      );

      //save the otp and the mail in the database
      let userSingUPOtp = await this.userSingUPOtpModel.create({
        email,
        otp,
      });

      // console.log(userSingUPOtp._id);

      // delete the otp and the emil data if not used within 10m
      // setTimeout(async () => {
      //   await this.userSingUPOtpModel.findByIdAndDelete(
      //     {
      //       _id: userSingUPOtp._id,
      //     },
      //     { new: true },
      //   );
      // }, 20000);

      return { status: 1 };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while processing the signup otp request',
      );
    }
  }

  async verifySignupOtp(verifyOtpDto: varifyOtpDto) {
    try {
      let { email, otp } = verifyOtpDto;

      let userOtpData = await this.userSingUPOtpModel.findOne({ email });

      if (userOtpData?.otp === otp) {
        return { status: true };
      } else {
        throw new NotFoundException('Invalid OTP');
      }
      //get the otp fom the data base and then varify that both are same or not
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async singUp(signupDto: SingUpDto): Promise<any> {
    try {
      let { email, password } = signupDto;
      let Exist_user = await this.userModel.findOne({ email });

      if (Exist_user) {
        throw new ConflictException('email exist');
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.userModel.create({
        name: signupDto.name,
        email: signupDto.email,
        password: hashedPassword,
      });
      const token = await this.jwtService.signAsync({
        id: user._id,
      });

      return { token };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while processing the signup otp request',
      );
    }
  }

  async googleLogin(GoogleLoginDto: GoogleLoginDto): Promise<any> {
    try {
      // console.log(GoogleLoginDto);
      const { email, name, sub, picture } = GoogleLoginDto;
      let Exist_user = await this.userModel.findOne({ email });
      if (Exist_user) {
        // verify the user by the unic id "sub"(that generate by the google )
        let sub_existing = Exist_user?.sub;
        if (sub !== sub_existing) {
          // user is not varified
          throw new UnauthorizedException(
            'Invalid user , sub is not same in google login response // or login by your email and password ',
          );
        }
        // success full login
        const token = await this.jwtService.signAsync({
          id: Exist_user._id,
        });

        return { success: 1, token, userId: Exist_user._id };
      } else {
        // if user login by googl for the first time
        const new_User = await this.userModel.create({
          name,
          email,
          picture,
          sub,
        });
        const token = await this.jwtService.signAsync({
          id: new_User._id,
        });
        return { success: 2, token, userId: new_User._id };
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while processing the request',
      );
    }
  }

  async login(loginDto: loginDto): Promise<any> {
    try {
      const { email, password } = loginDto;
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new UnauthorizedException('Invalid email, user not exist');
      }
      const passwordMatched = await bcrypt.compare(password, user.password);

      if (!passwordMatched) {
        throw new UnauthorizedException('wrong password');
      }

      const token = await this.jwtService.signAsync({
        id: user._id,
      });
      return { success: 1, token, userId: user._id };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while processing login',
      );
    }
  }

  // forget password route
  async forgetPasswordTokenLinkSend(
    ForgetPasswordDto_tokenGeneration: ForgetPasswordDto_tokenGeneration,
  ): Promise<any> {
    try {
      const { email } = ForgetPasswordDto_tokenGeneration;
      const user_exist = await this.userModel.findOne({ email });
      if (!user_exist) {
        throw new UnauthorizedException('user not exist');
      }

      // generate token by jwt
      const jwtToken = await this.jwtService.signAsync({ email });

      let emailText = forgetPasswordEmail(jwtToken);
      // Extract the email from the payload
      // const decodedToken = await this.jwtService.verifyAsync(jwtToken);
      // Extract the email from the payload

      // save the token in to data user data
      const user = await this.userModel.updateOne(
        { email },
        {
          $set: {
            token_for_forget_Password: jwtToken,
          },
        },
      );
      // send a link to the user so that user can use it for change the password

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_EMAIL_KEY,
        },
      });

      await transporter.sendMail(
        {
          from: 'royhiark@gmail.com', // sender address
          to: email, // list of receivers
          subject: 'Hotel Booking page , Fo!!!!!    forget password',
          text: ` Forget password MAIL`, // plain text body
          html: emailText, // html body
        },

        (error, info) => {
          if (error) {
            console.log(error);
            return {
              status: false,
              error,
            };
          } else {
            return {
              status: true,
              msg: 'eamil send susecfull',
            };
          }
        },
      );

      return {
        user,
        email,
        status: 'email send',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token format');
      }

      throw new InternalServerErrorException(
        'An error occurred while processing ',
      );
    }
  }

  async forgetPassword_tokenVerification(
    token: string,
    forgetPasswordDto: ForgetPasswordDto,
  ): Promise<any> {
    try {
      const { password } = forgetPasswordDto;
      const decodedToken = await this.jwtService.verifyAsync(token);
      const email = decodedToken['email'];
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      if (user?.token_for_forget_Password === token) {
        //change the password
        const hashedPassword = await bcrypt.hash(password, 10);
        //update the new password
        const user = await this.userModel.updateOne(
          { email },
          {
            $set: {
              password: hashedPassword,
              token_for_forget_Password: '',
            },
          },
        );
        return {
          status: 1,
          data: 'password changed suscefully',
        };

        // delete the token from the password
      } else {
        // if user notvarify the token
        const user = await this.userModel.updateOne(
          { email },
          {
            $set: {
              token_for_forget_Password: '',
            },
          },
        );
        throw new UnauthorizedException('invalid link');
        //delete the token form the user data
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token format');
      }

      throw new InternalServerErrorException(
        'An error occurred while processing ',
      );
    }
  }

  async resetPassword_otp_generation(genegenerateOtpDto: GenerateOtpDto) {
    try {
      const { email } = genegenerateOtpDto;
      //check the user is present ot not
      let user_exist = await this.userModel.findOne({ email });

      if (!user_exist) {
        throw new UnauthorizedException('email not exist');
      }

      //create otp
      let otp = Math.floor(100000 + Math.random() * 900000);
      // save the otp
      const user = await this.userModel.updateOne(
        { email },
        {
          $set: {
            otp_For_reset_password: otp,
          },
        },
      );

      // send the otp to the user mail
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_EMAIL_KEY,
        },
      });
      await transporter.sendMail(
        {
          from: 'royhiark@gmail.com', // sender address
          to: email, // list of receivers
          subject: 'Hotel Booking page , OTP MAIL',
          text: ` OTP MAIL mail`, // plain text body
          html: ` <body style="font-family: system-ui, math, sans-serif">
              <div>
                Hotel Booking page , reset password OTP mail
                <br />
                  <h1>YOUR RESET OTP IS : ${otp}</h1>
              </div>
            </body>`, // html body
        },

        (error, info) => {
          if (error) {
            console.log(error);
            return {
              status: false,
              error,
            };
          } else {
            return {
              status: true,
              msg: 'eamil send susecfull',
            };
          }
        },
      );

      return {
        status: 1,
        data: 'OTP mail for reset password has sent ',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while processing ',
      );
    }
  }

  async resetPassword_Verification(
    resetPassword_otp_Verification: ResetPassword_otp_Verification,
  ) {
    try {
      const { otp, email, password } = resetPassword_otp_Verification;
      // user exist or not
      let user_exist = await this.userModel.findOne({ email });
      if (!user_exist) {
        throw new UnauthorizedException('email not exist');
      }

      //otpvarifiction
      if (otp !== user_exist.otp_For_reset_password) {
        throw new UnauthorizedException('invalid otp');
      }
      // change the password
      //change the password
      const hashedPassword = await bcrypt.hash(password, 10);
      //update the new password
      const user = await this.userModel.updateOne(
        { email },
        {
          $set: {
            password: hashedPassword,
            otp_For_reset_password: '',
          },
        },
      );
      return { status: 1, message: 'password changed successfully' };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while processing ',
      );
    }
  }
  async deleteUser() {}
}
