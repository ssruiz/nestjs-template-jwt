import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { ResponseStatusDto } from '@/commons/dto';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiNoContentResponse({
    type: ResponseStatusDto,
  })
  seedDB(): Promise<ResponseStatusDto<null>> {
    return this.seedService.seedDB();
  }
}
