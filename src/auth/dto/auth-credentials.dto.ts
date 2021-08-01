/* eslint-disable prettier/prettier */
import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsNotEmpty({ message: 'Username can not be empty!' })
  @IsString({ message: 'Username should be string' })
  @Length(4, 20)
  username?: string;

  @Length(8, 32)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Please enter a strong password',
  })
  password?: string;
}
