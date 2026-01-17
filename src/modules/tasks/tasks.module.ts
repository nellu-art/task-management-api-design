import { Module } from '@nestjs/common';
import { TasksController } from './presentation/tasks.controller.js';
import { TasksService } from './application/tasks.service.js';
import { TASK_REPOSITORY } from './domain/task.repository.interface.js';
import { TaskRepositoryInMemory } from './infrastructure/in-memory-task.repository.js';

@Module({
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: TASK_REPOSITORY,
      useClass: TaskRepositoryInMemory,
    },
  ],
})
export class TasksModule {}
