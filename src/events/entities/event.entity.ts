import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

// Index useful for performance
@Index(['name', 'type'])
@Entity()
export class RecEvent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Index()
    @Column()
    name: string;

    @Column('json')
    payload: Record<string, any>;
}
