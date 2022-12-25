import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from 'configs/database.config';
import { srcOrDist } from 'constants/src-or-dist';
import { TypeOrmConfigService } from 'db/config.service';
import { DataSourceSingleton } from 'db/data-source-singleton';
import { NoteModule } from 'modules/note/note.module';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/${srcOrDist}/configs/env/${
        process.env.NODE_ENV
      }.env`,
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      name: 'default',
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: TypeOrmConfigService,
      async dataSourceFactory(options) {
        const dataSource = new DataSource(options);
        DataSourceSingleton.setDataSource(dataSource);
        return dataSource;
      },
    }),
    NoteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
