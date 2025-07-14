import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  collectedToday: boolean;

  @Column({ type: 'real', default: 0.0 })
  monthlyAmount: number;

  @Column({ default: false })
  paid: boolean;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
