import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus, Priority } from '../domain/task.entity.js';

export class TaskSchema {
  @ApiProperty({
    description: 'Unique identifier of the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Title of the task',
    example: 'Implement user authentication',
  })
  title: string;

  @ApiProperty({
    description: 'Detailed description of the task',
    example: 'Add JWT-based authentication to the API',
  })
  description: string;

  @ApiProperty({
    description: 'Current status of the task',
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
  })
  status: TaskStatus;

  @ApiProperty({
    description: 'Priority level of the task',
    enum: Priority,
    example: Priority.HIGH,
  })
  priority: Priority;

  @ApiProperty({
    description: 'List of person IDs assigned to this task',
    type: [String],
    example: ['person-123', 'person-456'],
  })
  assignedPeople: string[];

  @ApiProperty({
    description: 'Date and time when the task was created',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the task was last updated',
    example: '2024-01-15T10:30:00.000Z',
    type: Date,
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Due date for the task',
    example: '2024-12-31T23:59:59.000Z',
    type: Date,
  })
  dueDate?: Date;
}
