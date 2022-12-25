import { DataSource } from 'typeorm';

export class DataSourceSingleton {
  private static dataSource: DataSource;
  static getDataSource() {
    if (!this.dataSource) {
      throw new Error('DataSource has not been initialized');
    }

    return this.dataSource;
  }

  static setDataSource(dataSource: DataSource) {
    this.dataSource = dataSource;
  }
}
