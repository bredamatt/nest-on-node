import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Flavor } from "./flavor.entity";

@Entity() // sql table == 'coffee' (lowercase), can also define in decorator @Entity('coffees') f. ex
export class Coffee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    brand: string;

    @Column({ nullable: true })
    description: string;

    @Column({default : 0 })
    recommendations: number;

    // Specifies ownerside of relationship, which is the Coffee entity
    @JoinTable()
    @ManyToMany(
        type => Flavor, 
        (flavor) => flavor.coffees,
        {
            cascade: true, // ['insert']
        }
    )
    flavors: Flavor[];
}