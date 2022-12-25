import { Injectable, Logger } from '@nestjs/common';
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
  }: {
    id: string;
    title?: string;
    body?: string;
  }): Promise<NoteEntity> {
    const updatedNote = await this.noteRepository.updateById(id, {
      title,
      body,
    });
    this.logger.log(`Created note : ${JSON.stringify(updatedNote)}`);
    return updatedNote;
  }
}
