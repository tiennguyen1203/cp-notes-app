import { DataSourceSingleton } from 'db/data-source-singleton';
import { NoteEntity } from 'entities/note.entity';
import * as request from 'supertest';
import { v4 as uuid } from 'uuid';
import { TestHelper } from '../../../../test/test-helper';

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
        await request(testHelper.app.getHttpServer())
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
        expect(note.title).toEqual(title);
        expect(note.body).toEqual(body);
        expect(note.userId).toEqual(userId);
        expect(note.createdAt).toBeDefined();
        expect(note.updatedAt).toBeDefined();
      });
    });
  });
});
