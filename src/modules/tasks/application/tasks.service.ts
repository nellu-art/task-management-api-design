import { Inject, Injectable } from '@nestjs/common';
import {
  ITaskRepository,
  TASK_REPOSITORY,
} from '../domain/task.repository.interface';
import { Task } from '../domain/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TASK_REPOSITORY) private readonly taskRepository: ITaskRepository,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.findAll();
  }

  async getTaskById(id: string): Promise<Task | null> {
    return this.taskRepository.findById(id);
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task: Task = {
      ...createTaskDto,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      assignedPeople: [],
    };
    return this.taskRepository.create(task);
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.taskRepository.update(id, {
      ...updateTaskDto,
      updatedAt: new Date(),
    });
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.taskRepository.delete(id);
  }

  async assignPersonToTask(taskId: string, personId: string): Promise<Task> {
    return this.taskRepository.assignPerson(taskId, personId);
  }

  async unassignPersonFromTask(
    taskId: string,
    personId: string,
  ): Promise<Task> {
    return this.taskRepository.unassignPerson(taskId, personId);
  }
}
