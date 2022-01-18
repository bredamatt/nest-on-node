import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecEvent } from 'src/events/entities/event.entity';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

// Value based provider
class MocCoffeeService {}

@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, RecEvent])],
    controllers: [CoffeesController], 
    providers: [{
        provide: CoffeesService,
        useValue: new MocCoffeeService()
    }],
    exports: [CoffeesService],
})
export class CoffeesModule {}
