import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateNoteRequestDto } from './dtos/CreateNoteRequest.dto';
import { UpdateNoteRequestDto } from './dtos/UpdateNoteRequest.dto';
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
    @Headers('user-id') userId: string,
  ): Promise<any> {
    return this.noteService.updateNote({
      id,
      title: body.title,
      body: body.body,
      userId,
    });
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getNotes(
    // TODO: remove this one, extract userId from jwt token after implementing auth
    @Headers('user-id') userId: string,
  ): Promise<any> {
    if (!userId) {
      return [];
    }

    const res = await this.noteService.getNotesBelongToUser(userId);
    return res.map((e) => ({
      id: e.id,
      title: e.title,
      body: e.body,
      createdAt: e.createdAt.getTime(),
      updatedAt: e.updatedAt.getTime(),
    }));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteNote(
    @Param('id') id: string,
    @Headers('user-id') userId: string,
  ): Promise<any> {
    return this.noteService.deleteNote({
      id,
      userId,
    });
  }
}
