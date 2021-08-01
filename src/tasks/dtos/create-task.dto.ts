/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {

  @IsNotEmpty({message: 'Task title can not be empty!'})
  title: string;
  
  @IsNotEmpty({message: 'Describe your task! Empty description not allowed'})
  description: string;
}
