import { Injectable, Module, Scope } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecEvent } from 'src/events/entities/event.entity';
import { Connection } from 'typeorm';
import { COFFEE_BRANDS } from './coffees.constants';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import coffeesConfig from './config/coffees.config';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

// Value based provider
class MockCoffeeService {}

// Class providers
class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService  {}

// Factory providers can be injected in providers section to deal with custom logic
// @Injectable()
// export class CoffeeBrandsFactory {
//     create() {
//         /* do something here */
//         return ['buddy brew', 'nescafe']; 
//     }
// }

@Module({
    imports: [
        TypeOrmModule.forFeature([Coffee, Flavor, RecEvent]), 
        ConfigModule.forFeature(coffeesConfig), // Configuration namespace in coffees module
    ],
    controllers: [CoffeesController], 
    providers: [
        CoffeesService,
        ConfigService,
        {
            provide: COFFEE_BRANDS,
            useFactory: () => ['buddy brew', 'nescafe'],
            scope: Scope.TRANSIENT,
        },

        // Config Provider - Useful for different environments
        // {
        //     provide: ConfigService,
        //     useClass: process.env.NODE_ENV == 'development' ? DevelopmentConfigService : ProductionConfigService
        // },
        
        // Async Provider - Use when you need to delay start up until after connections have been made f. ex
        // {
        //     provide: COFFEE_BRANDS,
        //     useFactory: async (connection: Connection): Promise<string[]> => {
        //         // const coffeeBrands = await connection.query('SELECT * ...');
        //         const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe']);
        //         return coffeeBrands;
        //     },
        //     inject: [Connection],
        // },

        // Mock Provider example
        // {
        //     provide: 'MOCKUP',
        //     useValue: new MockCoffeeService(),
        // }
    ],
    exports: [CoffeesService],
})
export class CoffeesModule {}
