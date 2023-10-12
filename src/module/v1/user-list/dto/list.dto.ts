import { IsNotEmpty, IsString } from 'class-validator';

export class ListDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}
