import { Min, Max, IsInt } from 'class-validator';

export class PaginationDto {
  @Min(1)
  @Max(50)
  @IsInt()
  limit: number;
  @Min(0)
  @IsInt()
  offset: number;
}
