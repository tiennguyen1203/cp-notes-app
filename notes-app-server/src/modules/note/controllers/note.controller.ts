import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateNoteRequestDto } from '../dtos/CreateNoteRequest.dto';
import { UpdateNoteRequestDto } from '../dtos/UpdateNoteRequest.dto';
import { NoteService } from '../services/note.service';

@Controller({
  version: ['1'],
  path: 'notes',
})
export class NoteController {
  constructor(private noteService: NoteService) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async createNote(@Body() body: CreateNoteRequestDto): Promise<any> {
    return this.noteService.createNote({
      title: body.title,
      body: body.body,
      userId: body.userId,
    });
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateNote(
    @Param('id') id: string,
    @Body() body: UpdateNoteRequestDto,
  ): Promise<any> {
    return this.noteService.updateNote({
      id,
      title: body.title,
      body: body.body,
    });
  }
}
