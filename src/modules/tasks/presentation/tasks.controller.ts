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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { TasksService } from '../application/tasks.service.js';
import { Task } from '../domain/task.entity.js';
import { CreateTaskDto } from '../application/dto/create-task.dto.js';
import { UpdateTaskDto } from '../application/dto/update-task.dto.js';
import { AssignPersonDto } from '../application/dto/assign-person.dto.js';
import { TaskSchema } from './task.schema.js';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all tasks',
    description: 'Retrieves a list of all tasks in the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of tasks retrieved successfully',
    type: [TaskSchema],
  })
  async getAllTasks(): Promise<Task[]> {
    return this.tasksService.getAllTasks();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get task by ID',
    description: 'Retrieves a specific task by its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the task',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Task retrieved successfully',
    type: TaskSchema,
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
  })
  async getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new task',
    description: 'Creates a new task with the provided information.',
  })
  @ApiBody({
    type: CreateTaskDto,
    description: 'Task creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: TaskSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a task',
    description:
      'Updates an existing task with new information. Only provided fields will be updated.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the task to update',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateTaskDto,
    description: 'Task update data (all fields are optional)',
  })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: TaskSchema,
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a task',
    description: 'Permanently deletes a task from the system.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the task to delete',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Task deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
  })
  async deleteTask(@Param('id') id: string): Promise<void> {
    await this.tasksService.deleteTask(id);
  }

  @Post(':id/assign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Assign a person to a task',
    description:
      'Assigns a person to a task. If the person is already assigned, the operation is idempotent.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the task',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: AssignPersonDto,
    description: 'Person assignment data',
  })
  @ApiResponse({
    status: 200,
    description: 'Person assigned to task successfully',
    type: TaskSchema,
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async assignPersonToTask(
    @Param('id') id: string,
    @Body() assignPersonDto: AssignPersonDto,
  ): Promise<Task> {
    return this.tasksService.assignPersonToTask(id, assignPersonDto.personId);
  }

  @Post(':id/unassign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Unassign a person from a task',
    description: 'Removes a person from a task assignment.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the task',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: AssignPersonDto,
    description: 'Person unassignment data',
  })
  @ApiResponse({
    status: 200,
    description: 'Person unassigned from task successfully',
    type: TaskSchema,
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
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
