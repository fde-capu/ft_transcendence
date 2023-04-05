import { IsNotEmpty } from 'class-validator';

export class RequestHistory {
  mode?: string;

  @IsNotEmpty()
  user: string;
}