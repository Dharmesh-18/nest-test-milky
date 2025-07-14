import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'worker')
  create(@Body() createCustomerDto: any) {
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'worker')
  findAll() {
    return this.customerService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'worker', 'customer')
  findOne(@Param('id') id: string, @Request() req) {
    if (req.user.role === 'customer' && req.user.userId !== +id) {
      throw new Error('Unauthorized');
    }
    return this.customerService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'worker')
  update(@Param('id') id: string, @Body() updateCustomerDto: any) {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }

  @Patch(':id/collect')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'worker')
  collectMilk(@Param('id') id: string) {
    return this.customerService.update(+id, { collectedToday: true });
  }

  @Patch(':id/pay')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'worker')
  pay(@Param('id') id: string) {
    return this.customerService.update(+id, { paid: true });
  }
}
