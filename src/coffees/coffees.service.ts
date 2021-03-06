import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { RecEvent } from 'src/events/entities/event.entity';
import { Connection, Repository } from 'typeorm';
import { COFFEE_BRANDS } from './coffees.constants';
import coffeesConfig from './config/coffees.config';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity'
import { Flavor } from './entities/flavor.entity';

// Scope defines when the service is instantiated, Default = singleton, Transient = per dependent module, Request = per request
@Injectable({ scope: Scope.DEFAULT })
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,
        private readonly connection: Connection,
        private readonly configService: ConfigService,
        @Inject(COFFEE_BRANDS) coffeeBrands: string[],
        
        // Preferred approach for partial configuration - leads to strong typing
        //@Inject(coffeesConfig.KEY)
        //private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>,
    ) {
        // const coffeesConfig = this.configService.get('coffees.foo'); // partial registration, can quickly become messy
        // console.log('CoffeesService instantiated');
        // console.log(coffeesConfiguration.foo);
    }

    findAll(paginationQuery: PaginationQueryDto) {
        const { limit, offset } = paginationQuery;
        return this.coffeeRepository.find({
            relations: ['flavors'],
            skip: offset,
            take: limit
        });
      }
    
    async findOne(id: string) {
        const coffee = await this.coffeeRepository.findOne(id, {
            relations: ['flavors'],
        });
        if (!coffee) {
            throw new NotFoundException(`Coffee #${id} not found`);
        }
        return coffee;
    }
    
    async create(createCoffeeDto: CreateCoffeeDto) {
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)),
        );

        const coffee = this.coffeeRepository.create({
            ...createCoffeeDto,
            flavors,
        });
        return this.coffeeRepository.save(coffee);
    }
    
    async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
        const flavors =
            updateCoffeeDto.flavors &&
            (await Promise.all(
                updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)),
            ));

        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavors,
        });
        if (!coffee) {
          throw new NotFoundException(`Coffee #${id} not found`);
        }
        return this.coffeeRepository.save(coffee);
    }
    
    async remove(id: string) {
        const coffee = await this.findOne(id);
        return this.coffeeRepository.remove(coffee);
    }

    // async recommendCoffe(coffee: Coffee) {
    //     const queryRunner = this.connection.createQueryRunner();
    //     await queryRunner.connect();
    //     await queryRunner.startTransaction();
    //     try {
    //         coffee.recommendations++;

    //         const recommendEvent = new RecEvent();
    //         recommendEvent.name = 'recommend_coffee';
    //         recommendEvent.type = 'coffee';
    //         recommendEvent.payload = { coffeeId: coffee.id };

    //         await queryRunner.manager.save(coffee);
    //         await queryRunner.manager.save(recommendEvent);
    //         await queryRunner.commitTransaction();
    //     } catch (err) {
    //         await queryRunner.rollbackTransaction();
    //     } finally {
    //         await queryRunner.release();
    //     } 
    // }

    // Used for cascading inserts for flavors
    private async preloadFlavorByName(name: string): Promise<Flavor> {
        const existingFlavor = await this.flavorRepository.findOne({ name });
        if (existingFlavor) {
            return existingFlavor;
        }
        return this.flavorRepository.create( { name });
    }
}
