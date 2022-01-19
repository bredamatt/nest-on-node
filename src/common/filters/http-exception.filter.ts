import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import e, { Response } from 'express';

// Use this ExceptionFilter to manage HttpExceptions 
@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const error = typeof response == 'string'
      ? { message: exceptionResponse }
      : (exceptionResponse as object);
    
      response.status(status).json({
        ...error,
        timestamp: new Date().toISOString(),
      });
  }    
}
