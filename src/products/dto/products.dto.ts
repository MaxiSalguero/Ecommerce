import {
  IsString,
  IsInt,
  IsNotEmpty,
  Length,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { IsNumberDecimal } from '../../decorators/IsNumberDecimal';
import { Categories } from 'src/categories/categories.entity';

export class CreateProductDto {
  /**
  Esta es la propiedad name
  @example ProductExample
  */
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  /**
  Esta es la propiedad description
  @example DescriptionExample
  */
  @IsNotEmpty()
  @IsString()
  @Length(5, 255)
  description: string;

  /**
  Esta es la propiedad price
  @example 11.99
  */
  @IsNotEmpty()
  @IsNumberDecimal()
  price: number;

  /**
  Esta es la propiedad stock
  @example 12
  */
  @IsNotEmpty()
  @IsInt()
  stock: number;

  /**
  Esta es la propiedad url image
  @example https://example.com/product.jpg
  */
  @IsOptional()
  @IsString()
  @Length(5, 255)
  imgUrl: string;

  /**
  Esta es la propiedad categoryId
  @example c65b87d4-32a1-4a61-b4f8-1c45a5d3e6f5
  */
  @IsNotEmpty()
  @IsUUID()
  categoryId: string
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
