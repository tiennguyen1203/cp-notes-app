import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NoteEntity } from 'entities/note.entity';
import { NoteRepository } from '../repositories/note.repository';

@Injectable()
export class NoteService {
  private logger = new Logger(NoteService.name);
  constructor(private noteRepository: NoteRepository) {}

  async createNote({
    userId,
    title,
    body,
  }: {
    userId: string;
    title: string;
    body: string;
  }): Promise<NoteEntity> {
    const createdNote = await this.noteRepository.createOne({
      userId,
      title,
      body,
    });
    this.logger.log(`Created note : ${JSON.stringify(createdNote)}`);
    return createdNote;
  }

  async updateNote({
    id,
    title,
    body,
    userId,
  }: {
    id: string;
    title?: string;
    body?: string;
    userId: string;
  }): Promise<NoteEntity> {
    const note = await this.noteRepository.findOne({ where: { id, userId } });
    this.logger.debug(`Note: ${JSON.stringify(note)}`);
    if (!note) {
      this.logger.error(`Note not found with id: ${id}`);
      throw new NotFoundException("Note doesn't exist");
    }

    const updatedNote = await this.noteRepository.updateById(id, {
      title,
      body,
    });
    this.logger.log(`Created note : ${JSON.stringify(updatedNote)}`);
    return updatedNote;
  }

  async getNotesBelongToUser(userId: string): Promise<NoteEntity[]> {
    return this.noteRepository.find({ where: { userId } });
  }

  async deleteNote({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<number> {
    const res = await this.noteRepository
      .createQueryBuilder()
      .where('id = :id AND user_id = :userId', {
        id,
        userId,
      })
      .delete()
      .from(NoteEntity)
      .execute();
    return res.affected;
  }
}
