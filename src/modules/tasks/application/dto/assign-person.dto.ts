import { IsString, IsNotEmpty } from 'class-validator';

export class AssignPersonDto {
  @IsString()
  @IsNotEmpty()
  // @IsUUID() - TODO: use uuid in production, commented out to test on local
  personId: string;
}
