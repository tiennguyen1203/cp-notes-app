import { Module } from '@nestjs/common';
import { NoteController } from './controllers/note.controller';
import { NoteRepository } from './repositories/note.repository';
import { NoteService } from './services/note.service';

@Module({
  providers: [NoteService, NoteRepository],
  controllers: [NoteController],
  imports: [],
  exports: [NoteService],
})
export class NoteModule {}
