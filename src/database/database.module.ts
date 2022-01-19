import { DynamicModule, Module } from '@nestjs/common';
import { ConnectionOptions, createConnection } from 'typeorm';

@Module({})
export class DatabaseModule {
    // Dynamic module configuration
    static register(options: ConnectionOptions): DynamicModule {
        return {
            module: DatabaseModule,
            providers: [
                {
                    provide: 'CONNECTION',
                    useValue: createConnection(options),
                },
            ],
        };
    }
}
