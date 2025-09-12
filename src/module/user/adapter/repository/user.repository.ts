import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { IUserRepository } from '../../usecase/interface/user.repository.interface';
import { User } from '../../domain/model/user.entity';
import { UserEntity } from '../../domain/model/user.entity.typeorm';
import { Address } from '../../../../framework/shared/domain/address.model';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({
      where: { deletedAt: IsNull() }
    });
    return users.map(user => this.mapEntityToModel(user));
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id, deletedAt: IsNull() }
    });
    return user ? this.mapEntityToModel(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email, deletedAt: IsNull() }
    });
    return user ? this.mapEntityToModel(user) : null;
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { firebaseUid, deletedAt: IsNull() }
    });
    return user ? this.mapEntityToModel(user) : null;
  }

  async create(userData: Partial<User>): Promise<User> {
    const userEntity = this.mapModelToEntity(userData);
    const savedUser = await this.userRepository.save(userEntity);
    return this.mapEntityToModel(savedUser);
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const existingUser = await this.userRepository.findOne({
      where: { id, deletedAt: IsNull() }
    });

    if (!existingUser) {
      return null;
    }
    // Map the update data to entity format
    const updateData = this.mapPartialModelToEntity(userData);

    // Update and save
    const updatedEntity = await this.userRepository.save({
      ...existingUser,
      ...updateData,
    });

    return this.mapEntityToModel(updatedEntity);
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.userRepository.softDelete(id);
    return result.affected ? result.affected > 0 : false;
  }

  // Helper methods to map between domain model and database entity
  private mapEntityToModel(entity: UserEntity): User {
    const address = entity.address?.street || entity.address?.city
      ? new Address({
          street: entity.address?.street,
          city: entity.address?.city,
          state: entity.address?.state,
          country: entity.address?.country,
          zipcode: entity.address?.zipcode,
        })
      : undefined;

    const storeAddress = entity.storeAddress?.street || entity.storeAddress?.city
      ? new Address({
          street: entity.storeAddress?.street,
          city: entity.storeAddress?.city,
          state: entity.storeAddress?.state,
          country: entity.storeAddress?.country,
          zipcode: entity.storeAddress?.zipcode,
        })
      : undefined;

    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      password: entity.password,
      dateOfBirth: entity.dateOfBirth,
      gender: entity.gender,
      email: entity.email,
      phoneNumber: entity.phoneNumber,
      address,
      userType: entity.userType,
      storeName: entity.storeName,
      storeOwnerFullName: entity.storeOwnerFullName,
      storeAddress,
      storeDescription: entity.storeDescription,
      firebaseUid: entity.firebaseUid,
      stripeAccountId: entity.stripeAccountId,
      transactionCount: entity.transactionCount,
      balance: parseFloat(entity.balance),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }


  private mapModelToEntity(model: Partial<User>): Partial<UserEntity> {
    const entity: Partial<UserEntity> = {};

    entity.firstName = model.firstName;
    entity.lastName = model.lastName;
    entity.password = model.password;
    entity.dateOfBirth = model.dateOfBirth;
    entity.gender = model.gender;
    entity.email = model.email;
    entity.phoneNumber = model.phoneNumber;
    entity.userType = model.userType;
    entity.storeName = model.storeName;
    entity.storeOwnerFullName = model.storeOwnerFullName;
    entity.storeDescription = model.storeDescription;
    entity.firebaseUid = model.firebaseUid;
    entity.stripeAccountId = model.stripeAccountId;
    entity.transactionCount = model.transactionCount ?? 0;
    entity.balance = model.balance?.toFixed(2) ?? '0.00';

    if (model.address) {
      entity.address = {
        street: model.address.street,
        city: model.address.city,
        state: model.address.state,
        country: model.address.country,
        zipcode: model.address.zipcode,
      };
    }

    if (model.storeAddress) {
      entity.storeAddress = {
        street: model.storeAddress.street,
        city: model.storeAddress.city,
        state: model.storeAddress.state,
        country: model.storeAddress.country,
        zipcode: model.storeAddress.zipcode,
      };
    }

    return entity;
  }

  private mapPartialModelToEntity(model: Partial<User>): Partial<UserEntity> {
    const entity: Partial<UserEntity> = {};

    if (model.firstName !== undefined) entity.firstName = model.firstName;
    if (model.lastName !== undefined) entity.lastName = model.lastName;
    if (model.password !== undefined) entity.password = model.password;
    if (model.dateOfBirth !== undefined) entity.dateOfBirth = model.dateOfBirth;
    if (model.gender !== undefined) entity.gender = model.gender;
    if (model.email !== undefined) entity.email = model.email;
    if (model.phoneNumber !== undefined) entity.phoneNumber = model.phoneNumber;
    if (model.userType !== undefined) entity.userType = model.userType;
    if (model.storeName !== undefined) entity.storeName = model.storeName;
    if (model.storeOwnerFullName !== undefined) entity.storeOwnerFullName = model.storeOwnerFullName;
    if (model.storeDescription !== undefined) entity.storeDescription = model.storeDescription;
    if (model.firebaseUid !== undefined) entity.firebaseUid = model.firebaseUid;
    if (model.stripeAccountId !== undefined) entity.stripeAccountId = model.stripeAccountId;
    if (model.transactionCount !== undefined) entity.transactionCount = model.transactionCount;
    if (model.balance !== undefined) entity.balance = model.balance.toFixed(2);

    if (model.address) {
      entity.address = {
        street: model.address.street,
        city: model.address.city,
        state: model.address.state,
        country: model.address.country,
        zipcode: model.address.zipcode,
      };
    }

    if (model.storeAddress) {
      entity.storeAddress = {
        street: model.storeAddress.street,
        city: model.storeAddress.city,
        state: model.storeAddress.state,
        country: model.storeAddress.country,
        zipcode: model.storeAddress.zipcode,
      };
    }

    return entity;
  }

} 