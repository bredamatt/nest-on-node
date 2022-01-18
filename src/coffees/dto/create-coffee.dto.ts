import { IsString } from "class-validator";
export class CreateCoffeeDto {
    @IsString() // Automatically validate input is string
    readonly name: string;

    @IsString()
    readonly brand: string;
    
    @IsString({ each: true })
    readonly flavors: string[];
}
