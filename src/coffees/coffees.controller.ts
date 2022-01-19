import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

// @UsePipes(ValidationPipe) --> Used for all route handler methods
@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeesService: CoffeesService, 
        @Inject(REQUEST) private readonly request: Request // this comes from Express, and may add performance overhead
        ) 
    {
        console.log('CoffeesController initialized');
    }

    // @UsePipes(ValidationPipe) --> Route specific pipe
    @Get()
    findAll(@Query() paginationQuery: PaginationQueryDto) {
        // const { limit, offset } = paginationQuery;
        return this.coffeesService.findAll(paginationQuery); 
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
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
