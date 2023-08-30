import { IsInt, IsPositive, IsString, MinLength } from 'class-validator';

export class CreatePokemonDto {
  @IsString()
  @MinLength(3)
  name: string;
  @IsInt()
  @IsPositive()
  no: number;
}
