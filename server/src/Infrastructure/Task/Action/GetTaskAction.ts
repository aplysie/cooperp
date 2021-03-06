import {
  Controller,
  Inject,
  UseGuards,
  Get,
  Param,
  NotFoundException
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiUseTags, ApiBearerAuth, ApiOperation} from '@nestjs/swagger';
import {TaskView} from 'src/Application/Task/View/TaskView';
import {GetTaskByIdQuery} from 'src/Application/Task/Query/GetTaskByIdQuery';
import {IQueryBusAdapter} from 'src/Application/Adapter/IQueryBusAdapter';
import {TaskIdDTO} from './DTO/TaskIdDTO';

@Controller('tasks')
@ApiUseTags('Task')
@ApiBearerAuth()
@UseGuards(AuthGuard('bearer'))
export class GetTaskAction {
  constructor(
    @Inject('IQueryBusAdapter')
    private readonly queryBus: IQueryBusAdapter
  ) {}

  @Get(':id')
  @ApiOperation({title: 'Get task'})
  public async index(@Param() taskIdDTO: TaskIdDTO): Promise<TaskView> {
    try {
      return await this.queryBus.execute(new GetTaskByIdQuery(taskIdDTO.id));
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
