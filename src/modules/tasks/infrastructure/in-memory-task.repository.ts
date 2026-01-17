import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '../domain/task.entity';
import { ITaskRepository } from '../domain/task.repository.interface';

@Injectable()
export class TaskRepositoryInMemory implements ITaskRepository {
  private tasks: Map<string, Task> = new Map();

  async findAll(): Promise<Task[]> {
    return Promise.resolve(Array.from(this.tasks.values()));
  }

  async findById(id: string): Promise<Task | null> {
    return Promise.resolve(this.tasks.get(id) || null);
  }

  async create(task: Task): Promise<Task> {
    this.tasks.set(task.id, task);
    return Promise.resolve(task);
  }

  async update(id: string, taskUpdate: Partial<Task>): Promise<Task> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) {
      throw new NotFoundException();
    }
    const updatedTask = {
      ...existingTask,
      ...taskUpdate,
      updatedAt: new Date(),
    };
    this.tasks.set(id, updatedTask);
    return Promise.resolve(updatedTask);
  }

  async delete(id: string): Promise<boolean> {
    return Promise.resolve(this.tasks.delete(id));
  }

  async assignPerson(taskId: string, personId: string): Promise<Task> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new NotFoundException();
    }
    if (!task.assignedPeople.includes(personId)) {
      task.assignedPeople.push(personId);
      task.updatedAt = new Date();
    }
    this.tasks.set(taskId, task);
    return Promise.resolve(task);
  }

  async unassignPerson(taskId: string, personId: string): Promise<Task> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new NotFoundException();
    }
    task.assignedPeople = task.assignedPeople.filter((id) => id !== personId);
    task.updatedAt = new Date();
    this.tasks.set(taskId, task);
    return Promise.resolve(task);
  }
}
