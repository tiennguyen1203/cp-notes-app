import { Client } from 'pg';
import { getTypeOrmConfig } from '../src/configs/database.config';
import { DataSourceSingleton } from '../src/db/data-source-singleton';

export class DatabaseHelper {
  private client: Client;
  ormConfig = getTypeOrmConfig();

  async createDatabase() {
    this.client = new Client({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      port: +process.env.DB_PORT!,
      database: 'postgres',
    });
    await this.client.connect();

    await this.client.query(`CREATE DATABASE ${this.ormConfig.database}`);
  }

  async dropDatabase() {
    await DataSourceSingleton.getDataSource().destroy();
    await this.client.query(`DROP DATABASE ${this.ormConfig.database}`);
    await this.client.end();
  }

  async dropTables() {
    const entities = DataSourceSingleton.getDataSource().entityMetadatas;
    for (const entity of entities) {
      await DataSourceSingleton.getDataSource().query(`
        DROP TABLE IF EXISTS ${entity.tableName} CASCADE;
      `);
    }
  }
}
