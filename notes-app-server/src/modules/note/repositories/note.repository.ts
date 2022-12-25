import { Injectable } from '@nestjs/common';
import { NoteEntity } from 'entities/note.entity';
import { DataSource, DeepPartial, Repository } from 'typeorm';

@Injectable()
export class NoteRepository extends Repository<NoteEntity> {
  constructor(private dataSource: DataSource) {
    super(NoteEntity, dataSource.createEntityManager());
  }

  async createOne(data: Partial<NoteEntity>) {
    const insertResult = await this.createQueryBuilder()
      .insert()
      .into(NoteEntity)
      .values(data)
      .returning('*')
      .execute();

    return insertResult.generatedMaps[0] as NoteEntity;
  }

  async updateById(
    id: string,
    data: DeepPartial<NoteEntity>,
  ): Promise<NoteEntity | undefined> {
    await this.createQueryBuilder()
      .where('id = :id', { id })
      .update(data)
      .returning('*')
      .execute();

    return this.findOneBy({ id });
  }
}
