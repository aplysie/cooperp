import {
  Body,
  Post,
  Controller,
  Inject,
  BadRequestException,
  UseGuards
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiUseTags, ApiBearerAuth, ApiOperation} from '@nestjs/swagger';
import {ICommandBusAdapter} from 'src/Application/Adapter/ICommandBusAdapter';
import {CreateProjectCommand} from 'src/Application/Project/Command/CreateProjectCommand';
import {ProjectView} from 'src/Application/Project/View/ProjectView';
import {IQueryBusAdapter} from 'src/Application/Adapter/IQueryBusAdapter';
import {GetProjectByIdQuery} from 'src/Application/Project/Query/GetProjectByIdQuery';
import {ProjectDTO} from './DTO/ProjectDTO';

@Controller('projects')
@ApiUseTags('Project')
@ApiBearerAuth()
@UseGuards(AuthGuard('bearer'))
export class CreateProjectAction {
  constructor(
    @Inject('ICommandBusAdapter')
    private readonly commandBus: ICommandBusAdapter,
    @Inject('IQueryBusAdapter')
    private readonly queryBus: IQueryBusAdapter
  ) {}

  @Post()
  @ApiOperation({title: 'Create new project'})
  public async index(@Body() projectDto: ProjectDTO): Promise<ProjectView> {
    try {
      const {name, customerId} = projectDto;
      const id = await this.commandBus.execute(
        new CreateProjectCommand(name, customerId)
      );

      return await this.queryBus.execute(new GetProjectByIdQuery(id));
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
