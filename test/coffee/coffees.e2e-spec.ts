import { INestApplication, INestMicroservice } from "@nestjs/common";
import { TestingModule, Test } from '@nestjs/testing';
import { CoffeesModule } from '../../src/coffees/coffees.module';

describe('[Feature] Coffees - /coffes', ()  => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                CoffeesModule
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it.todo('Create [POST /]');
    it.todo('Get all [GET /]');
    it.todo('Get one [GET /:id]');
    it.todo('Update one [PATCH /:id]');
    it.todo('Delete [DELETE /:id]');

    afterAll(async () => {
        await app.close();
    });
});