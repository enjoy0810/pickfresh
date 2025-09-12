import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USER_REPOSITORY } from 'src/module/user/usecase/interface/user.repository.interface';
import { DatabaseConfigService } from './database-config.service';
import { UserRepository } from 'src/module/user/adapter/repository/user.repository';
import { UserEntity } from 'src/module/user/domain/model/user.entity.typeorm';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({})
export class DatabaseModule {
  private static readonly ENTITIES = [
    UserEntity,
  ];

  static register(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useClass: DatabaseConfigService,
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature(this.ENTITIES),
      ],
      providers: [
        DatabaseConfigService,
        {
          provide: USER_REPOSITORY,
          useClass: UserRepository,
        },
      ],
      exports: [
        TypeOrmModule,
        USER_REPOSITORY,
      ],
    };
  }
}
