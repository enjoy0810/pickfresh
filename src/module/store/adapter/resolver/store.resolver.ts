import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UnauthorizedException } from '@nestjs/common';
import { Store } from '../../domain/model/store.entity';
import { StoreUsecase } from '../../usecase/store.usecase';
import { CreateStoreInput } from '../input/create-store.input';
import { UpdateStoreInput } from '../input/update-store.input';

@Resolver(() => Store)
export class StoreResolver {
  constructor(private readonly storeUsecase: StoreUsecase) {}

  // Minimal helper that mirrors how your other modules “see” auth.
  // 1) Prefer req.user.id if some global guard/middleware set it
  // 2) Else read Authorization header and treat its value as the user id
  private getUserId(ctx: any): string {
    const idFromReq = ctx?.req?.user?.id ?? ctx?.user?.id;
    if (idFromReq) return idFromReq;

    const raw = ctx?.req?.headers?.authorization || ctx?.headers?.authorization || '';
    if (!raw) throw new UnauthorizedException('Missing user auth context');

    // Accept both "Bearer <id>" and "<id>" (matching how your other modules behave)
    const val = raw.startsWith('Bearer ') ? raw.slice(7) : raw;
    if (!val) throw new UnauthorizedException('Missing user auth context');
    return val; // treat as userId, no extra deps
  }

  @Query(() => [Store])
  stores(): Promise<Store[]> {
    return this.storeUsecase.findAll();
  }

  @Query(() => Store, { nullable: true })
  store(@Args('id') id: string): Promise<Store | null> {
    return this.storeUsecase.findById(id);
  }

  @Query(() => Store, { nullable: true, name: 'myStore' })
  myStore(@Context() ctx: any): Promise<Store | null> {
    const userId = this.getUserId(ctx);
    return this.storeUsecase.findByOwnerId(userId);
  }

  @Mutation(() => Store)
  createStore(@Args('input') input: CreateStoreInput, @Context() ctx: any): Promise<Store> {
    const userId = this.getUserId(ctx);
    return this.storeUsecase.createWithOwner(userId, input);
  }

  @Mutation(() => Store, { nullable: true })
  updateStore(@Args('input') input: UpdateStoreInput): Promise<Store | null> {
    return this.storeUsecase.update(input.id, input);
  }

  @Mutation(() => Boolean)
  deleteStore(@Args('id') id: string): Promise<boolean> {
    return this.storeUsecase.delete(id);
  }
}
