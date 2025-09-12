import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private config: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isSSL = this.config.get<string>('DATABASE_SSL') === 'true';

    return {
      type: 'postgres',
      host: this.config.get('DATABASE_HOST'),
      port: Number(this.config.get('DATABASE_PORT')),
      username: this.config.get('DATABASE_USERNAME'),
      password: this.config.get('DATABASE_PASSWORD'),
      database: this.config.get('DATABASE_NAME'),
      entities: ['dist/**/*.entity.typeorm{.ts,.js}'],
      migrations: ['dist/framework/typeorm-migration/migrations/*{.ts,.js}'],
      migrationsRun: false,
      synchronize: true,
      logging: false,
      ssl: isSSL ? { rejectUnauthorized: false } : false,
      autoLoadEntities: true,
      connectTimeoutMS: 0,
      retryAttempts: 0,
      retryDelay: 0,
    };
  }
}
