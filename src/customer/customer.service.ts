import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  findAll(): Promise<Customer[]> {
    return this.customersRepository.find();
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customersRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }
    return customer;
  }

  async create(customer: Partial<Customer>): Promise<Customer> {
    const newCustomer = this.customersRepository.create(customer);
    return this.customersRepository.save(newCustomer);
  }

  async update(id: number, customerData: Partial<Customer>): Promise<Customer> {
    const customer = await this.findOne(id);
    const updatedCustomer = { ...customer, ...customerData };
    return this.customersRepository.save(updatedCustomer);
  }

  async remove(id: string): Promise<void> {
    await this.customersRepository.delete(id);
  }
}
