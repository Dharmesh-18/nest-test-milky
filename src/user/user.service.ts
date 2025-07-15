import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { Role } from '../auth/roles.enum';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException(`User with username "${username}" not found`);
    }
    return user;
  }

  async create(user: Partial<User>): Promise<User> {
    try {
      const createdUser = new this.userModel(user);
      return await createdUser.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Username already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
  }

  // Methods for role-specific user operations
  async findAllUsersByRole(role: Role): Promise<User[]> {
    return this.userModel.find({ role }).exec();
  }

  async findOneUserByIdAndRole(id: string, role: Role): Promise<User> {
    const user = await this.userModel.findOne({ _id: id, role }).exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" and role "${role}" not found`);
    }
    return user;
  }

  async createUserWithRole(userData: Partial<User>, role: Role): Promise<User> {
    const newUser = new this.userModel({ ...userData, role });
    try {
      return await newUser.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Username already exists');
      }
      throw error;
    }
  }

  async updateUserByIdAndRole(id: string, userData: Partial<User>, role: Role): Promise<User> {
    const updatedUser = await this.userModel
      .findOneAndUpdate({ _id: id, role }, userData, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${id}" and role "${role}" not found`);
    }
    return updatedUser;
  }

  async removeUserByIdAndRole(id: string, role: Role): Promise<void> {
    const result = await this.userModel.findOneAndDelete({ _id: id, role }).exec();
    if (!result) {
      throw new NotFoundException(`User with ID "${id}" and role "${role}" not found`);
    }
  }
}
