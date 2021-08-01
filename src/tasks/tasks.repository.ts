/* eslint-disable prettier/prettier */
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { filter } from 'rxjs';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-task-filter.dto';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  logger = new Logger('TasksRepository', { timestamp: true });

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({ title, description, user });
    await this.save(task);
    return task;
  }

  //Too Much DB - Keep it here - Query Builder

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const query = this.createQueryBuilder('task');
    query.where({ user });
    const { status, search } = filterDto;

    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` }
      );
    }
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (err) {
      this.logger.error(`Failed to get tasks for user ${user.username}. Filters: ${JSON.stringify(filterDto)}`)
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
