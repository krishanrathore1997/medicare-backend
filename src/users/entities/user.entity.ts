import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true, type: 'varchar' })
  password?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  image?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  provider?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  providerId?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
