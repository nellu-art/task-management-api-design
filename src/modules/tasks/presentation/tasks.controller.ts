import { Body, Controller, Get, Post } from '@nestjs/common';
import { TasksService } from '../application/tasks.service.js';
import { Task } from '../domain/task.entity.js';
import { CreateTaskDto } from '../application/dto/create-task.dto.js';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAllTasks(): Promise<Task[]> {
    return this.tasksService.getAllTasks();
  }

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }
}
