import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecEvent } from 'src/events/entities/event.entity';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

// Value based provider
class MockCoffeeService {}

@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, RecEvent])],
    controllers: [CoffeesController], 
    providers: [
        CoffeesService, 
        {
            provide: 'COFFEE_BRANDS',
            useValue: ['buddy brew', 'nescafe'] 
        },
        {
            provide: 'MOCKUP',
            useValue: new MockCoffeeService(),
        }
    ],
    exports: [CoffeesService],
})
export class CoffeesModule {}
