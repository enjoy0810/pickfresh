import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Product } from '../domain/model/product.entity';
import { Address } from '../../../framework/shared/domain/address.model';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from './interface/product.repository.interface';
import { IProductUsecase } from './interface/product.usecase.interface';
import { CreateProductInput } from '../adapter/input/create-product.input';
import { UpdateProductInput } from '../adapter/input/update-product.input';
import * as fs from 'fs';
import * as path from 'path';
import { FileUpload } from 'graphql-upload';

@Injectable()
export class ProductUsecase implements IProductUsecase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async findById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async create(input: CreateProductInput): Promise<Product> {
    const { photos, address, pickupSchedule, ...productData } = input;

    // Validate photos
    if (!photos || photos.length === 0) {
      throw new BadRequestException('At least one image is required.');
    }
    if (photos.length > 3) {
      throw new BadRequestException('Maximum 3 images allowed.');
    }

    // Upload photos
    const uploadedImagePaths: string[] = [];
    for (const filePromise of photos) {
      const file: FileUpload = await filePromise;
      const { createReadStream, filename } = file;

      const uploadDir = path.resolve('./uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, `${Date.now()}-${filename}`);

      await new Promise((resolve, reject) =>
        createReadStream()
          .pipe(fs.createWriteStream(filePath))
          .on('finish', resolve)
          .on('error', reject),
      );

      uploadedImagePaths.push(filePath);
    }

    // Prepare product entity
    const productToCreate: Partial<Product> = {
      ...productData,
      photos: uploadedImagePaths,
      pickupSchedule,
      address: address ? new Address(address) : undefined,
      createdAt: new Date(),
    };

    return this.productRepository.create(productToCreate);
  }

  async update(id: string, input: UpdateProductInput): Promise<Product | null> {
    const { photos, address, pickupSchedule, ...updateData } = input;

    const updates: Partial<Product> = {
      ...updateData,
      updatedAt: new Date(),
    };

    // Handle photo updates
    if (photos && photos.length > 0) {
      if (photos.length > 3) {
        throw new BadRequestException('Maximum 3 images allowed.');
      }

      const uploadedImagePaths: string[] = [];

      for (const filePromise of photos) {
        const file: FileUpload = await filePromise;
        const { createReadStream, filename } = file;

        const uploadDir = path.resolve('./uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, `${Date.now()}-${filename}`);

        await new Promise((resolve, reject) =>
          createReadStream()
            .pipe(fs.createWriteStream(filePath))
            .on('finish', resolve)
            .on('error', reject),
        );

        uploadedImagePaths.push(filePath);
      }

      updates.photos = uploadedImagePaths;
    }

    // Handle address update
    if (address) {
      updates.address = new Address(address); // FIXED: no .map
    }

    if (pickupSchedule) {
      updates.pickupSchedule = pickupSchedule;
    }

    return this.productRepository.update(id, updates);
  }

  async delete(id: string): Promise<boolean> {
    return this.productRepository.delete(id);
  }
}
