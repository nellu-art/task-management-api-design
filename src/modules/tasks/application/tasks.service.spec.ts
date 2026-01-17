import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  ITaskRepository,
  TASK_REPOSITORY,
} from '../domain/task.repository.interface';
import { Task, TaskStatus, Priority } from '../domain/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksService', () => {
  let service: TasksService;
  let repository: jest.Mocked<ITaskRepository>;

  const mockTask: Task = {
    id: 'task-1',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.TODO,
    priority: Priority.MEDIUM,
    assignedPeople: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockRepository: jest.Mocked<ITaskRepository> = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    assignPerson: jest.fn(),
    unassignPerson: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TASK_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<jest.Mocked<ITaskRepository>>(TASK_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTasks', () => {
    it('should return an array of tasks', async () => {
      const tasks: Task[] = [mockTask];
      repository.findAll.mockResolvedValue(tasks);

      const result = await service.getAllTasks();

      expect(result).toEqual(tasks);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no tasks exist', async () => {
      repository.findAll.mockResolvedValue([]);

      const result = await service.getAllTasks();

      expect(result).toEqual([]);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTaskById', () => {
    it('should return a task when found', async () => {
      repository.findById.mockResolvedValue(mockTask);

      const result = await service.getTaskById('task-1');

      expect(result).toEqual(mockTask);
      expect(repository.findById).toHaveBeenCalledWith('task-1');
      expect(repository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when task is not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getTaskById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getTaskById('non-existent-id')).rejects.toThrow(
        'Task with ID non-existent-id not found',
      );
      expect(repository.findById).toHaveBeenCalledWith('non-existent-id');
    });
  });

  describe('createTask', () => {
    it('should create a new task with generated id and timestamps', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'New Description',
        status: TaskStatus.TODO,
        priority: Priority.HIGH,
      };

      const { dueDate: dueDateString, ...taskData } = createTaskDto;
      const createdTask: Task = {
        ...taskData,
        id: 'generated-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        assignedPeople: [],
        dueDate: dueDateString ? new Date(dueDateString) : undefined,
      };

      repository.create.mockResolvedValue(createdTask);

      const result = await service.createTask(createTaskDto);

      expect(result).toEqual(createdTask);
      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: createTaskDto.title,
          description: createTaskDto.description,
          status: createTaskDto.status,
          priority: createTaskDto.priority,
          assignedPeople: [],
          id: expect.any(String) as string,
          createdAt: expect.any(Date) as Date,
          updatedAt: expect.any(Date) as Date,
        }),
      );
    });

    it('should create a task with optional dueDate', async () => {
      const dueDateString = '2024-12-31T00:00:00.000Z';
      const createTaskDto: CreateTaskDto = {
        title: 'Task with Due Date',
        description: 'Description',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.URGENT,
        dueDate: dueDateString,
      };

      const { dueDate: dueDateStringFromDto, ...taskData } = createTaskDto;
      const createdTask: Task = {
        ...taskData,
        id: 'generated-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        assignedPeople: [],
        dueDate: dueDateStringFromDto
          ? new Date(dueDateStringFromDto)
          : undefined,
      };

      repository.create.mockResolvedValue(createdTask);

      const result = await service.createTask(createTaskDto);

      expect(result).toEqual(createdTask);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          dueDate: createdTask.dueDate,
        }),
      );
    });
  });

  describe('updateTask', () => {
    it('should update a task with new data and updated timestamp', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Title',
        status: TaskStatus.IN_PROGRESS,
      };

      const { dueDate: dueDateString, ...updateData } = updateTaskDto;
      const updatedTask: Task = {
        ...mockTask,
        ...updateData,
        updatedAt: new Date(),
        dueDate:
          dueDateString !== undefined
            ? dueDateString
              ? new Date(dueDateString)
              : undefined
            : mockTask.dueDate,
      };

      repository.findById.mockResolvedValue(mockTask);
      repository.update.mockResolvedValue(updatedTask);

      const result = await service.updateTask('task-1', updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(repository.findById).toHaveBeenCalledWith('task-1');
      expect(repository.update).toHaveBeenCalledWith(
        'task-1',
        expect.objectContaining({
          ...updateTaskDto,
          updatedAt: expect.any(Date) as Date,
        }),
      );
      expect(repository.update).toHaveBeenCalledTimes(1);
    });

    it('should update only provided fields', async () => {
      const updateTaskDto: UpdateTaskDto = {
        priority: Priority.HIGH,
      };

      const updatedTask: Task = {
        ...mockTask,
        priority: Priority.HIGH,
        updatedAt: new Date(),
      };

      repository.findById.mockResolvedValue(mockTask);
      repository.update.mockResolvedValue(updatedTask);

      const result = await service.updateTask('task-1', updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(repository.update).toHaveBeenCalledWith(
        'task-1',
        expect.objectContaining({
          priority: Priority.HIGH,
          updatedAt: expect.any(Date) as Date,
        }),
      );
    });

    it('should throw NotFoundException when task does not exist', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Title',
      };

      repository.findById.mockResolvedValue(null);

      await expect(
        service.updateTask('non-existent-id', updateTaskDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.updateTask('non-existent-id', updateTaskDto),
      ).rejects.toThrow('Task with ID non-existent-id not found');
      expect(repository.findById).toHaveBeenCalledWith('non-existent-id');
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      repository.findById.mockResolvedValue(mockTask);
      repository.delete.mockResolvedValue(true);

      await service.deleteTask('task-1');

      expect(repository.findById).toHaveBeenCalledWith('task-1');
      expect(repository.delete).toHaveBeenCalledWith('task-1');
      expect(repository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.deleteTask('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.deleteTask('non-existent-id')).rejects.toThrow(
        'Task with ID non-existent-id not found',
      );
      expect(repository.findById).toHaveBeenCalledWith('non-existent-id');
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });

  describe('assignPersonToTask', () => {
    it('should assign a person to a task', async () => {
      const personId = 'person-1';
      const updatedTask: Task = {
        ...mockTask,
        assignedPeople: [personId],
        updatedAt: new Date(),
      };

      repository.findById.mockResolvedValue(mockTask);
      repository.assignPerson.mockResolvedValue(updatedTask);

      const result = await service.assignPersonToTask('task-1', personId);

      expect(result).toEqual(updatedTask);
      expect(repository.findById).toHaveBeenCalledWith('task-1');
      expect(repository.assignPerson).toHaveBeenCalledWith('task-1', personId);
      expect(repository.assignPerson).toHaveBeenCalledTimes(1);
    });

    it('should handle assigning multiple people', async () => {
      const personId1 = 'person-1';
      const personId2 = 'person-2';
      const updatedTask: Task = {
        ...mockTask,
        assignedPeople: [personId1, personId2],
        updatedAt: new Date(),
      };

      repository.findById.mockResolvedValue(mockTask);
      repository.assignPerson.mockResolvedValue(updatedTask);

      const result = await service.assignPersonToTask('task-1', personId2);

      expect(result).toEqual(updatedTask);
      expect(repository.assignPerson).toHaveBeenCalledWith('task-1', personId2);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      const personId = 'person-1';
      repository.findById.mockResolvedValue(null);

      await expect(
        service.assignPersonToTask('non-existent-id', personId),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.assignPersonToTask('non-existent-id', personId),
      ).rejects.toThrow('Task with ID non-existent-id not found');
      expect(repository.findById).toHaveBeenCalledWith('non-existent-id');
      expect(repository.assignPerson).not.toHaveBeenCalled();
    });
  });

  describe('unassignPersonFromTask', () => {
    it('should unassign a person from a task', async () => {
      const personId = 'person-1';
      const taskWithPerson: Task = {
        ...mockTask,
        assignedPeople: [personId],
      };

      const updatedTask: Task = {
        ...taskWithPerson,
        assignedPeople: [],
        updatedAt: new Date(),
      };

      repository.findById.mockResolvedValue(taskWithPerson);
      repository.unassignPerson.mockResolvedValue(updatedTask);

      const result = await service.unassignPersonFromTask('task-1', personId);

      expect(result).toEqual(updatedTask);
      expect(repository.findById).toHaveBeenCalledWith('task-1');
      expect(repository.unassignPerson).toHaveBeenCalledWith(
        'task-1',
        personId,
      );
      expect(repository.unassignPerson).toHaveBeenCalledTimes(1);
    });

    it('should handle unassigning when multiple people are assigned', async () => {
      const personId1 = 'person-1';
      const personId2 = 'person-2';
      const taskWithPeople: Task = {
        ...mockTask,
        assignedPeople: [personId1, personId2],
      };

      const updatedTask: Task = {
        ...taskWithPeople,
        assignedPeople: [personId2],
        updatedAt: new Date(),
      };

      repository.findById.mockResolvedValue(taskWithPeople);
      repository.unassignPerson.mockResolvedValue(updatedTask);

      const result = await service.unassignPersonFromTask('task-1', personId1);

      expect(result).toEqual(updatedTask);
      expect(repository.unassignPerson).toHaveBeenCalledWith(
        'task-1',
        personId1,
      );
    });

    it('should throw NotFoundException when task does not exist', async () => {
      const personId = 'person-1';
      repository.findById.mockResolvedValue(null);

      await expect(
        service.unassignPersonFromTask('non-existent-id', personId),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.unassignPersonFromTask('non-existent-id', personId),
      ).rejects.toThrow('Task with ID non-existent-id not found');
      expect(repository.findById).toHaveBeenCalledWith('non-existent-id');
      expect(repository.unassignPerson).not.toHaveBeenCalled();
    });
  });
});
