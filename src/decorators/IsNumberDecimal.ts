import { BadRequestException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsNumberDecimal(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsNumberDecimal',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'number') {
            throw new BadRequestException(
              'the expected number is not a string',
            );
          }
          const decimalPart = value.toString().split('.')[1];
          if (decimalPart && decimalPart.length > 0) {
            return true;
          } else
            throw new BadRequestException(
              'the expected number is not an integer.',
            );
        },
      },
    });
  };
}
