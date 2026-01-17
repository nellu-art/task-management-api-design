import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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

  async getTaskById(id: string): Promise<Task> {
    return this.ensureTaskExists(id);
  }

  private async ensureTaskExists(id: string): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task: Task = {
      ...createTaskDto,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      assignedPeople: [],
      dueDate: createTaskDto.dueDate
        ? new Date(createTaskDto.dueDate)
        : undefined,
    };
    return this.taskRepository.create(task);
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    await this.ensureTaskExists(id);
    const { dueDate, ...rest } = updateTaskDto;
    const updateData: Partial<Task> = {
      ...rest,
      updatedAt: new Date(),
    };
    if (dueDate !== undefined) {
      updateData.dueDate = dueDate ? new Date(dueDate) : undefined;
    }
    return this.taskRepository.update(id, updateData);
  }

  async deleteTask(id: string): Promise<void> {
    await this.ensureTaskExists(id);
    await this.taskRepository.delete(id);
  }

  async assignPersonToTask(taskId: string, personId: string): Promise<Task> {
    await this.ensureTaskExists(taskId);
    return this.taskRepository.assignPerson(taskId, personId);
  }

  async unassignPersonFromTask(
    taskId: string,
    personId: string,
  ): Promise<Task> {
    await this.ensureTaskExists(taskId);
    return this.taskRepository.unassignPerson(taskId, personId);
  }
}
