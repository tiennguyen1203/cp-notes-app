import { IsString } from 'class-validator';

export class CreateNoteRequestDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  // TODO: userId should be extract from Jwt token after we implement the login feat
  @IsString()
  userId: string;
}
