import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class AssignPersonDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Person ID must be at least 1 character long' })
  @MaxLength(100, { message: 'Person ID must not exceed 100 characters' })
  // @IsUUID('4', { message: 'Person ID must be a valid UUID v4' })
  // TODO: use uuid in production, commented out to test on local
  // For now, allow alphanumeric and hyphens for local testing
  @Matches(/^[a-zA-Z0-9-]+$/, {
    message: 'Person ID must contain only alphanumeric characters and hyphens',
  })
  personId: string;
}
