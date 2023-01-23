import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ContactInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  phone: number;

  @Column()
  userId: number;

  @OneToOne(() => User, (user) => user.contactInfo, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
