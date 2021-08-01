import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository
  ) {}

  async getTaskById(id: string, user: User): Promise<Task> {
    //const task = await this.tasksRepository.findOne(id);
    const task = await this.tasksRepository.findOne({ where: { id, user } });
    if (!task) {
      throw new NotFoundException('Task does not exist');
    }
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });
    //console.log(result);
    if (result.affected === 0) {
      throw new NotFoundException('Task not found!');
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    this.tasksRepository.save(task);

    return task;
    //Mutatin directly for fun!
  }

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  /*  private tasks: Task[] = [];

  //If we have any filters defined we are going to use them and give the tasks, otherwise all tasks

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    //try to get task
    const found = this.tasks.find((task) => task.id === id);
    if (!found) {
      throw new NotFoundException('Task does not exist');
    }
    return found;
  }

  getTasksByFilter(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    //Copy of current tasks:
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }
    return tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  deleteTaskById(id: string) {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    if (!task) {
      throw new NotFoundException('Task does not exist');
    }
    task.status = status;
    return task;
    //Mutatin directly for fun!
  } */
}
