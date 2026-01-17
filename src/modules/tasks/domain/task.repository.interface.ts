import { Task } from './task.entity';

export abstract class ITaskRepository {
  abstract findAll(): Promise<Task[]>;
  abstract findById(id: string): Promise<Task | null>;
  abstract create(task: Task): Promise<Task>;
  abstract update(id: string, task: Partial<Task>): Promise<Task>;
  abstract delete(id: string): Promise<boolean>;
  abstract assignPerson(taskId: string, personId: string): Promise<Task>;
  abstract unassignPerson(taskId: string, personId: string): Promise<Task>;
}

export const TASK_REPOSITORY = Symbol('TASK_REPOSITORY');
