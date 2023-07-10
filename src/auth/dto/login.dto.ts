import { OmitType } from '@nestjs/swagger';

import { CreateAuthDto } from './create-auth.dto';

export class LoginDto extends OmitType(CreateAuthDto, ['fullname'] as const) {}
