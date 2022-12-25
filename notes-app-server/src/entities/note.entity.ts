import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('note')
export class NoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // TODO: This one should be linked to user entity after we implement the login feat
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', name: 'title' })
  title: string;

  @Column({ type: 'text', name: 'body' })
  body: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
