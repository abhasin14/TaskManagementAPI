import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dtos/update-task-status.dto';
import { Task } from './task.entity';
import { Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';

@UseGuards(AuthGuard())
@Controller('tasks')
export class TasksController {
  private logger = new Logger('Tasks Controller', { timestamp: true });
  constructor(private tasksService: TasksService) {}

  @Get(':id')
  @UsePipes(new ValidationPipe())
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    this.logger.verbose(`User ${user.username} retreiving task by Id.`);
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  createTask(
    @Body() task: CreateTaskDto,
    @GetUser() user: User
  ): Promise<Task> {
    this.logger.verbose(
      `User ${user.username} creating a task. Data- ${JSON.stringify(task)}`
    );
    return this.tasksService.createTask(task, user);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteTaskById(id, user);
  }

  @Patch(':id/status')
  @UsePipes(new ValidationPipe())
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(
      id,
      updateTaskStatusDto.status,
      user
    );
  }

  @Get()
  @UsePipes(new ValidationPipe())
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User
  ): Promise<Task[]> {
    this.logger.verbose(
      `User ${user.username} retreiving task by Id. Filters: ${JSON.stringify(
        filterDto
      )}`
    );
    return this.tasksService.getTasks(filterDto, user);
  }
  /* 
  @Get()
  @UsePipes(new ValidationPipe())
  getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
    if (Object.keys(filterDto).length) {
      return this.tasksService.getTasksByFilter(filterDto);
    } else {
      return this.tasksService.getAllTasks();
    }
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  createTask(@Body() task: CreateTaskDto): Task {
    return this.tasksService.createTask(task);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTaskById(id);
  }

  @Patch(':id/status')
  @UsePipes(new ValidationPipe())
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Task {
    return this.tasksService.updateTaskStatus(id, updateTaskStatusDto.status);
  } */
}
