import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Patch, Post, Query, SetMetadata, UsePipes, ValidationPipe } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Protocol } from 'src/common/decorators/protocol.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

// @UsePipes(ValidationPipe) --> Used for all route handler methods
@ApiTags('coffees')
@Controller('coffees')
export class CoffeesController {
    constructor(
        private readonly coffeesService: CoffeesService, 
        @Inject(REQUEST) private readonly request: Request, // this comes from Express, and may add performance overhead
    ) {
        console.log('CoffeesController initialized upon request');
    }

    // @UsePipes(ValidationPipe) --> Route specific pipe
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @Public() // Custom decorator
    @Get()
    async findAll(
        @Protocol('https') protocol: string,
        @Query() paginationQuery: PaginationQueryDto
        ) {
        //await new Promise(resolve => setTimeout(resolve, 5000));
        // const { limit, offset } = paginationQuery;
        console.log(protocol)
        return this.coffeesService.findAll(paginationQuery); 
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        console.log(id);
        return this.coffeesService.findOne('' + id);
    }

    @Post()
    create(@Body() createCoffeeDto: CreateCoffeeDto) {
        console.log(createCoffeeDto instanceof CreateCoffeeDto);
        return this.coffeesService.create(createCoffeeDto);
    }

    // Parameter specific pipe in he @Body constructor
    @Patch(':id') 
    update(@Param('id') id: string, @Body(ValidationPipe) updateCoffeeDto: UpdateCoffeeDto) {
        return this.coffeesService.update(id, updateCoffeeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.coffeesService.remove(id);
    }
}
