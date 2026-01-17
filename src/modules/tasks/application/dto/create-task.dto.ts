import { Priority, TaskStatus } from '../../domain/task.entity.js';

export class CreateTaskDto {
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: Date;
}
