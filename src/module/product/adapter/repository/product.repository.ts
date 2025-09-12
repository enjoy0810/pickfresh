import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../domain/model/product.entity';
import { IProductRepository } from '../../usecase/interface/product.repository.interface';
import { In } from 'typeorm';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepo.find();
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    return this.productRepo.findBy({ id: In(ids) });
  }

  async findById(id: string): Promise<Product | null> {
    return this.productRepo.findOneBy({ id });
  }

  async create(product: Partial<Product>): Promise<Product> {
    const newProduct = this.productRepo.create(product);
    return this.productRepo.save(newProduct);
  }

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    console.log("update rep")
    await this.productRepo.update(id, updates);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.productRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }

}
