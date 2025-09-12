import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Product } from '../../domain/model/product.entity';
import { ProductUsecase } from '../../usecase/product.usecase';
import { CreateProductInput } from '../input/create-product.input';
import { UpdateProductInput } from '../input/update-product.input';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productUsecase: ProductUsecase) {}

  @Query(() => [Product])
  products(): Promise<Product[]> {
    return this.productUsecase.findAll();
  }

  @Query(() => Product, { nullable: true })
  product(@Args('id') id: string): Promise<Product | null> {
    return this.productUsecase.findById(id);
  }

  @Mutation(() => Product)
  createProduct(@Args('input') input: CreateProductInput): Promise<Product> {
    return this.productUsecase.create(input);
  }

  @Mutation(() => Product)
  updateProduct(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateProductInput,
  ): Promise<Product | null> {
    return this.productUsecase.update(id, input);
  }

  @Mutation(() => Boolean)
  deleteProduct(@Args('id') id: string): Promise<boolean> {
    return this.productUsecase.delete(id);
  }
}
