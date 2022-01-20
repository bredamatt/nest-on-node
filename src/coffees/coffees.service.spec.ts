import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { COFFEE_BRANDS } from './coffees.constants';
import { Inject, NotFoundException, Scope } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
});

describe('CoffeesService', () => {
  let service: CoffeesService;
  let coffeeRepository: MockRepository;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        ConfigService,
        {
          provide: COFFEE_BRANDS,
          useFactory: () => ['buddy brew', 'nescafe'],
          scope: Scope.TRANSIENT,
        },
        { provide: Connection, useValue: {} },
        { provide: getRepositoryToken(Flavor), useValue: createMockRepository() }, // empty mockup
        { provide: getRepositoryToken(Coffee), useValue: createMockRepository() }, // empty mockup
      ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
    coffeeRepository = module.get<MockRepository>(getRepositoryToken(Coffee));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when coffee with ID exists', () => {
      it('should return the coffee object', async() => {
        const coffeeId = '1';
        const expectedCoffee = {};
        
        coffeeRepository.findOne.mockReturnValue(expectedCoffee);
        const coffee = await service.findOne(coffeeId);
        expect(coffee).toEqual(expectedCoffee);
        // expect(). ---> test assertions
      });
    });
    
    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        const coffeeId = '1';
        coffeeRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findOne(coffeeId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Coffee #${coffeeId} not found`);
        }
      });
    });
  });
});
