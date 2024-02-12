import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TasksService } from '../services/task.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Task } from '../entities/task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAllTasks(): Promise<Task[]> {
    const tasks = await this.tasksService.getAll();
    return tasks;
  }

  @Get(':id')
  async taskDetails(@Param('id') id: string): Promise<Task> {
    return await this.tasksService.getById(+id);
  }

  @Post()
  async addTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.tasksService.create(createTaskDto);
  }

  @Put(':id')
  async editTask(
    @Param('id') id: string,
    @Body() updateTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return await this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: number): Promise<void> {
    return await this.tasksService.delete(id);
  }
}
