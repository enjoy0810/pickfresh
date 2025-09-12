# TypeORM Migrations

This directory contains database migrations for the project. Migrations are a way to incrementally update your database schema and keep track of the changes.

## Creating a Migration

To create a new migration, run:

```bash
npm run typeorm -- migration:create src/framework/typeorm-migration/migrations/YourMigrationName
```

## Running Migrations

To run all pending migrations:

```bash
npm run typeorm:run
```

## Reverting Migrations

To revert the last migration:

```bash
npm run typeorm:revert
```

## Writing Migrations

Each migration should implement both `up()` and `down()` methods:

```typescript
import { MigrationInterface, QueryRunner } from "typeorm";

export class YourMigrationName1234567890123 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Perform updates to the database schema
        await queryRunner.query(`CREATE TABLE ...`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert changes made in the up method
        await queryRunner.query(`DROP TABLE ...`);
    }
}
```

## Migration Naming Conventions

Use descriptive names for migrations, such as:
- `CreateUserTable`
- `AddUserEmailColumn`
- `UpdateProductPriceType`

## Best Practices

1. Always implement both `up()` and `down()` methods
2. Make `down()` reverse everything done in `up()`
3. Keep migrations small and focused
4. One migration should handle one logical change
5. Never modify an existing migration, create a new one instead
6. Test migrations on a development database before applying to production

## Configuration

The TypeORM migration configuration is located in the `ormconfig.js` file in the project root. 