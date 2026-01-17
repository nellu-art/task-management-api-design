import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { Task } from '../src/modules/tasks/domain/task.entity';

describe('TasksController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /tasks', () => {
    it('should create a new task', () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'This is a test task',
        status: 'TODO',
        priority: 'MEDIUM',
      };

      return request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(201)
        .expect((res) => {
          const body = res.body as Task;
          expect(body).toHaveProperty('id');
          expect(body.title).toBe(createTaskDto.title);
          expect(body.description).toBe(createTaskDto.description);
          expect(body.status).toBe(createTaskDto.status);
          expect(body.priority).toBe(createTaskDto.priority);
          expect(body).toHaveProperty('createdAt');
          expect(body).toHaveProperty('updatedAt');
          expect(body.assignedPeople).toEqual([]);
        });
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return a task by id', async () => {
      // First create a task
      const createTaskDto = {
        title: 'Get Task Test',
        description: 'Task for get test',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(201);

      const createBody = createResponse.body as Task;
      const taskId = createBody.id;

      // Then get it by id
      return request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .expect(200)
        .expect((res) => {
          const body = res.body as Task;
          expect(body.id).toBe(taskId);
          expect(body.title).toBe(createTaskDto.title);
          expect(body.description).toBe(createTaskDto.description);
          expect(body.status).toBe(createTaskDto.status);
          expect(body.priority).toBe(createTaskDto.priority);
        });
    });

    it('should return 404 when task is not found', () => {
      return request(app.getHttpServer())
        .get('/tasks/non-existent-id')
        .expect(404);
    });
  });

  describe('GET /tasks', () => {
    it('should return an array of tasks', async () => {
      // Create a couple of tasks first
      const task1 = {
        title: 'Task 1',
        description: 'First task',
        status: 'TODO',
        priority: 'LOW',
      };

      const task2 = {
        title: 'Task 2',
        description: 'Second task',
        status: 'DONE',
        priority: 'URGENT',
      };

      await request(app.getHttpServer()).post('/tasks').send(task1).expect(201);

      await request(app.getHttpServer()).post('/tasks').send(task2).expect(201);

      // Get all tasks
      return request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .expect((res) => {
          const body = res.body as Task[];
          expect(Array.isArray(body)).toBe(true);
          expect(body.length).toBeGreaterThanOrEqual(2);
          expect(body.some((t) => t.title === task1.title)).toBe(true);
          expect(body.some((t) => t.title === task2.title)).toBe(true);
        });
    });
  });
});
