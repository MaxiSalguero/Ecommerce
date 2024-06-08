import {
  IsString,
  IsEmail,
  Matches,
  IsNotEmpty,
  Length,
  Validate,
  IsInt,
} from 'class-validator';
import { ApiHideProperty, PickType } from '@nestjs/swagger';
import { MatchPassword } from '../../decorators/matchPassword.decorator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
  /**
  Esta es la propiedad name
  @example UserExample
  */
  @IsNotEmpty()
  @IsString()
  @Length(3, 80)
  name: string;

  /**
  Esta es la propiedad email
  @example user@example.com
  */
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
  Esta es la propiedad password
  @example Example123!
  */
  @IsNotEmpty()
  @Length(8, 15)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/,
    {
      message:
        'La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un caracter especial de !@#$%^&*',
    },
  )
  password: string;

  /**
  Esta es la propiedad confirm password
  @example Example123!
  */
  @IsNotEmpty()
  @Validate(MatchPassword, ['password'])
  confirmPassword: string;

  /**
  Esta es la propiedad address
  @example AddressExample
  */
  @IsNotEmpty()
  @IsString()
  @Length(3, 80)
  address: string;

  /**
  Esta es la propiedad phone
  @example 3875443221
  */
  @IsNotEmpty()
  @IsInt()
  phone: number;

  /**
  Esta es la propiedad country
  @example CountryExample
  */
  @IsNotEmpty()
  @IsString()
  @Length(4, 20)
  country: string;

  /**
  Esta es la propiedad city
  @example CityExample
  */
  @IsNotEmpty()
  @IsString()
  @Length(5, 20)
  city: string;

  @ApiHideProperty()
  isAdmin?: boolean;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class LoginUserDto extends PickType(CreateUserDto, [
  'email',
  'password',
]) {}
