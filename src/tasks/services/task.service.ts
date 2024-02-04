import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async getAll(): Promise<Task[]> {
    try {
      return await this.tasksRepository.find();
    } catch (error) {
      throw new NotFoundException('Failed to fetch tasks');
    }
  }

  async getById(id: number): Promise<Task> {
    try {
      return await this.tasksRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const task = this.tasksRepository.create(createTaskDto);
      return await this.tasksRepository.save(task);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  async update(id: number, updateTaskDto: CreateTaskDto): Promise<Task> {
    try {
      await this.tasksRepository.update(id, updateTaskDto);
      return await this.tasksRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Failed to update task with ID ${id}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const deleteResult = await this.tasksRepository.softDelete(id);
      if (deleteResult.affected === 0) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to delete task with ID ${id}`,
      );
    }
  }
}
