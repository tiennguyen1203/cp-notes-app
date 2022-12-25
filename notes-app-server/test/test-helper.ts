import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { TypeOrmConfigService } from 'db/config.service';
import { DataSourceSingleton } from 'db/data-source-singleton';
import { DatabaseHelper } from './database-helper';

export class TestHelper {
  app: INestApplication;
  private databaseHelper = new DatabaseHelper();
  async beforeAll() {
    await this.databaseHelper.createDatabase();
    await this.initializeApp();
    await this.app.init();
  }

  async afterAll() {
    await this.databaseHelper.dropTables();
    await this.databaseHelper.dropDatabase();
    await this.app.close();
  }

  async cleanUpDb() {
    const entities = DataSourceSingleton.getDataSource().entityMetadatas;
    for (const entity of entities) {
      await DataSourceSingleton.getDataSource().query(
        `TRUNCATE ${entity.tableName} RESTART IDENTITY CASCADE;`,
      );
    }
  }

  private async initializeApp() {
    const moduleBuilder = Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TypeOrmConfigService)
      .useValue({
        createTypeOrmOptions: () => this.databaseHelper.ormConfig,
      });

    const module = await moduleBuilder.compile();

    this.app = module.createNestApplication({
      logger: ['error'],
    });
  }
}
