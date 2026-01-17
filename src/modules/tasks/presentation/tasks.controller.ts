import {
  Body,
  Controller,
  Delete,
  Get,
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
  async getAllTasks(): Promise<Task[]> {
    return this.tasksService.getAllTasks();
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<Task | null> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<boolean> {
    return this.tasksService.deleteTask(id);
  }

  @Post(':id/assign')
  async assignPersonToTask(
    @Param('id') id: string,
    @Body() assignPersonDto: AssignPersonDto,
  ): Promise<Task> {
    return this.tasksService.assignPersonToTask(id, assignPersonDto.personId);
  }

  @Post(':id/unassign')
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
