import {
  IsUUID,
  IsNotEmpty,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  
  @ApiProperty({
    type:"UUID",
    description:"Esta es la propiedad userId",
    example: "9c75f62f-99da-4f50-b8a6-69b61d2cf256",
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    type:"UUID[]",
    description:"Estos son los id de los productos",
    example: [
      { id: '03e071fa-9ac1-44c3-935d-ec91a0a95fb7' },
      { id: 'e59b2758-8f99-4dcf-a2bf-9e62c41594c1' },
    ],
  })
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductPartialDto)
  products: ProductPartialDto[];
}

export class ProductPartialDto {
  @IsUUID()
  id: string;
}
