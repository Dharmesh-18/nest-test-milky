import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Customer } from '../customer/customer.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password_hash: string;

  @Column()
  role: string;

  @OneToMany(() => Customer, (customer) => customer.user)
  customers: Customer[];
}
