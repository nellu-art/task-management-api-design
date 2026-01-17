import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TasksService } from '../application/tasks.service.js';
import { Task } from '../domain/task.entity.js';
import { CreateTaskDto } from '../application/dto/create-task.dto.js';
import { UpdateTaskDto } from '../application/dto/update-task.dto.js';
import { AssignPersonDto } from '../application/dto/assign-person.dto.js';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllTasks(): Promise<Task[]> {
    return this.tasksService.getAllTasks();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(@Param('id') id: string): Promise<void> {
    await this.tasksService.deleteTask(id);
  }

  @Post(':id/assign')
  @HttpCode(HttpStatus.OK)
  async assignPersonToTask(
    @Param('id') id: string,
    @Body() assignPersonDto: AssignPersonDto,
  ): Promise<Task> {
    return this.tasksService.assignPersonToTask(id, assignPersonDto.personId);
  }

  @Post(':id/unassign')
  @HttpCode(HttpStatus.OK)
  async unassignPerson(
    @Param('id') id: string,
    @Body() assignPersonDto: AssignPersonDto,
  ): Promise<Task> {
    return this.tasksService.unassignPersonFromTask(
      id,
      assignPersonDto.personId,
    );
  }
}
