import { DataSourceSingleton } from 'db/data-source-singleton';
import { NoteEntity } from 'entities/note.entity';
import * as request from 'supertest';
import { v4 as uuid } from 'uuid';
import { TestHelper } from '../../../../test/test-helper';
import { NoteService } from '../services/note.service';

// eslint-disable-next-line max-lines-per-function
describe('@note/controllers/note.controller.ts (e2e)', () => {
  const testHelper = new TestHelper();
  beforeAll(async () => {
    await testHelper.beforeAll();
  });
  afterAll(async () => {
    await testHelper.afterAll();
  });
  beforeEach(async () => {
    await testHelper.cleanUpDb();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('#POST /v1/notes', () => {
    const userId = uuid();
    const title = 'title';
    const body = 'body';

    describe('When request to create a note for user', () => {
      it('Should create a note belongs to user', async () => {
        const res = await request(testHelper.app.getHttpServer())
          .post(`/notes`)
          .send({
            userId,
            title,
            body,
          })
          .expect(201);

        const notes = await DataSourceSingleton.getDataSource()
          .getRepository(NoteEntity)
          .find({ where: {} });
        expect(notes.length).toEqual(1);
        const note = notes[0];
        expect(JSON.parse(JSON.stringify(note))).toEqual(
          JSON.parse(JSON.stringify(res.body)),
        );
        expect(note.title).toEqual(title);
        expect(note.body).toEqual(body);
        expect(note.userId).toEqual(userId);
        expect(note.createdAt).toBeDefined();
        expect(note.updatedAt).toBeDefined();
      });
    });
  });

  describe('#PUT /v1/notes/:id', () => {
    const userId = uuid();
    const title = 'title';
    const body = 'body';
    const noteId = uuid();

    describe('When note does not exist', () => {
      it('Should throw Not Found error', async () => {
        await request(testHelper.app.getHttpServer())
          .put(`/notes/${noteId}`)
          .set('user-id', userId)
          .send({
            title,
            body,
          })
          .expect(404);
      });
    });

    describe('When note does not belongs to you', () => {
      it('Should throw Not found error', async () => {
        await DataSourceSingleton.getDataSource()
          .createQueryBuilder()
          .insert()
          .into(NoteEntity)
          .values({
            id: noteId,
            userId: uuid(), // belongs to another user
            title,
            body,
          })
          .returning('*')
          .execute();
        await request(testHelper.app.getHttpServer())
          .put(`/notes/${noteId}`)
          .set('user-id', userId)
          .send({
            title: 'New title',
            body: 'New body',
          })
          .expect(404);
      });
    });

    describe('When note belongs to you', () => {
      it('Should Update note', async () => {
        await DataSourceSingleton.getDataSource()
          .createQueryBuilder()
          .insert()
          .into(NoteEntity)
          .values({
            id: noteId,
            userId, // belongs to you
            title,
            body,
          })
          .returning('*')
          .execute();
        const res = await request(testHelper.app.getHttpServer())
          .put(`/notes/${noteId}`)
          .set('user-id', userId)
          .send({
            title: 'New title',
            body: 'New body',
          })
          .expect(200);

        expect(res.body.title).toEqual('New title');
        expect(res.body.body).toEqual('New body');

        const note = await DataSourceSingleton.getDataSource()
          .getRepository(NoteEntity)
          .findOne({ where: { id: noteId } });
        expect(JSON.parse(JSON.stringify(note))).toEqual(
          JSON.parse(JSON.stringify(res.body)),
        );
        expect(note.userId).toEqual(userId);
        expect(note.createdAt).toBeDefined();
        expect(note.updatedAt).toBeDefined();
      });
    });
  });

  describe('#GET /v1/notes', () => {
    const userId = uuid();
    const title = 'title';
    const body = 'body';
    const noteId = uuid();

    describe('When user-id is not given in header', () => {
      it('Should return empty array', async () => {
        const noteService = testHelper.app.get(NoteService);
        const noteServiceSpy = jest.spyOn(noteService, 'getNotesBelongToUser');
        const res = await request(testHelper.app.getHttpServer())
          .get(`/notes`)
          .send({
            title,
            body,
          })
          .expect(200);
        expect(res.body).toEqual([]);

        expect(noteServiceSpy).toBeCalledTimes(0);
      });
    });
    describe('When user has no any notes before', () => {
      it('Should return empty array', async () => {
        const res = await request(testHelper.app.getHttpServer())
          .get(`/notes`)
          .set('user-id', userId)
          .send({
            title,
            body,
          })
          .expect(200);

        expect(res.body).toEqual([]);
      });
    });

    describe('When user has no any notes before', () => {
      it('Should return empty array', async () => {
        const res = await request(testHelper.app.getHttpServer())
          .get(`/notes`)
          .set('user-id', userId)
          .send({
            title,
            body,
          })
          .expect(200);

        expect(res.body).toEqual([]);
      });
    });

    describe('When user has created notes before', () => {
      it('Should return empty array', async () => {
        await DataSourceSingleton.getDataSource()
          .createQueryBuilder()
          .insert()
          .into(NoteEntity)
          .values([
            {
              id: noteId,
              userId,
              title,
              body,
            },
            {
              id: uuid(),
              userId: uuid(), // belongs to another user
              title,
              body,
            },
          ])
          .returning('*')
          .execute();
        const res = await request(testHelper.app.getHttpServer())
          .get(`/notes`)
          .set('user-id', userId)
          .send({
            title,
            body,
          })
          .expect(200);

        expect(res.body.length).toEqual(1);
        expect(res.body[0].id).toEqual(noteId);
        expect(res.body[0].title).toEqual(title);
        expect(res.body[0].body).toEqual(body);
        expect(typeof res.body[0].createdAt).toEqual('number');
        expect(typeof res.body[0].updatedAt).toEqual('number');
      });
    });
  });

  describe('#DELETE /v1/notes/:id', () => {
    const userId = uuid();
    const title = 'title';
    const body = 'body';
    const noteId = uuid();

    describe('When note does not exist', () => {
      it('Should return success and delete no records', async () => {
        const anotherNoteId = uuid();
        await DataSourceSingleton.getDataSource()
          .createQueryBuilder()
          .insert()
          .into(NoteEntity)
          .values({
            id: anotherNoteId, // note does not exist
            userId,
            title,
            body,
          })
          .returning('*')
          .execute();
        await request(testHelper.app.getHttpServer())
          .delete(`/notes/${noteId}`)
          .set('user-id', userId)
          .expect(200);
        const afterDeleteNotes = await DataSourceSingleton.getDataSource()
          .getRepository(NoteEntity)
          .find({ where: {} });
        expect(afterDeleteNotes.length).toEqual(1);
        expect(afterDeleteNotes[0].id).toEqual(anotherNoteId);
      });
    });

    describe('When note does not belongs to you', () => {
      it('Should return success and delete no records', async () => {
        await DataSourceSingleton.getDataSource()
          .createQueryBuilder()
          .insert()
          .into(NoteEntity)
          .values({
            id: noteId,
            userId: uuid(), // belongs to another user
            title,
            body,
          })
          .returning('*')
          .execute();
        await request(testHelper.app.getHttpServer())
          .delete(`/notes/${noteId}`)
          .set('user-id', userId)
          .expect(200);
        const afterDeleteNotes = await DataSourceSingleton.getDataSource()
          .getRepository(NoteEntity)
          .find({ where: {} });
        expect(afterDeleteNotes.length).toEqual(1);
        expect(afterDeleteNotes[0].id).toEqual(noteId);
      });
    });

    describe('When note belongs to you', () => {
      it('Should delete note', async () => {
        await DataSourceSingleton.getDataSource()
          .createQueryBuilder()
          .insert()
          .into(NoteEntity)
          .values({
            id: noteId,
            userId, // belongs to you
            title,
            body,
          })
          .returning('*')
          .execute();
        await request(testHelper.app.getHttpServer())
          .delete(`/notes/${noteId}`)
          .set('user-id', userId)
          .expect(200);

        const afterDeleteNotes = await DataSourceSingleton.getDataSource()
          .getRepository(NoteEntity)
          .find({ where: {} });
        expect(afterDeleteNotes.length).toEqual(0);
      });
    });
  });
});
