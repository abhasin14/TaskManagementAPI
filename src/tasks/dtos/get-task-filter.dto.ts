/* eslint-disable prettier/prettier */
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class GetTasksFilterDto {
  
  @IsOptional()
  @IsEnum(TaskStatus, {message:'Status Invalid'})
  status?: TaskStatus;

  @IsOptional()
  @IsNotEmpty({message:'Search field is empty'})
  search?: string;
}
