import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Priority, TaskStatus } from '../../domain/task.entity.js';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Title of the task',
    example: 'Implement user authentication',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Title must be at least 1 character long' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title: string;

  @ApiProperty({
    description: 'Detailed description of the task',
    example: 'Add JWT-based authentication to the API',
    minLength: 1,
    maxLength: 5000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Description must be at least 1 character long' })
  @MaxLength(5000, { message: 'Description must not exceed 5000 characters' })
  description: string;

  @ApiProperty({
    description: 'Current status of the task',
    enum: TaskStatus,
    example: TaskStatus.TODO,
  })
  @IsEnum(TaskStatus, {
    message: 'Status must be one of: TODO, IN_PROGRESS, DONE, BLOCKED',
  })
  status: TaskStatus;

  @ApiProperty({
    description: 'Priority level of the task',
    enum: Priority,
    example: Priority.HIGH,
  })
  @IsEnum(Priority, {
    message: 'Priority must be one of: LOW, MEDIUM, HIGH, URGENT',
  })
  priority: Priority;

  @ApiPropertyOptional({
    description: 'Due date for the task in ISO 8601 format',
    example: '2024-12-31T23:59:59Z',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Due date must be a valid ISO date string' })
  dueDate?: string;
}
