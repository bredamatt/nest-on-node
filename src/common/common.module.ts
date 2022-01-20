import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './guards/api-key.guard';
import { LoggingMiddleware } from './middleware/logging.middleware';

@Module({
    imports: [ConfigModule],
    providers: [ {
        provide: APP_GUARD, 
        useClass: ApiKeyGuard
    }]
})
export class CommonModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // Can also exclude, or specify more fine grained middleware configuration
        consumer.apply(LoggingMiddleware).forRoutes('*'); 
    }
}
