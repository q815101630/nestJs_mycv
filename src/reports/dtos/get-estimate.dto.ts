import { Transform } from 'class-transformer';
import {
  IsString,
  Min,
  Max,
  IsNumber,
  IsLongitude,
  IsLatitude,
} from 'class-validator';

export class GetEstimateDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1900)
  @Max(2050)
  year: number;

  @Transform(({ value }) => parseInt(value))
  @Min(0)
  mileage: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  lng: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  lat: number;
}
