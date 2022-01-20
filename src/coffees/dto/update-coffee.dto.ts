// To avoid redundancy, use PartialType
import {PartialType} from '@nestjs/swagger';
import {CreateCoffeeDto} from './create-coffee.dto';

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}
