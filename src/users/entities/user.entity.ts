import { UserRoles } from 'src/enums';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContactInfo } from './contact_info.entity';
import { Meeting } from './meeting.entity';
import { Task } from './task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  hashRefresh: string | null;

  @Column({ default: UserRoles.USER })
  role: string;

  @ManyToOne(() => User, (user) => user.directReports, { onDelete: 'SET NULL' })
  manager: User;

  @OneToMany(() => User, (user) => user.manager)
  directReports: User[];

  @OneToOne(() => ContactInfo, (contactInfo) => contactInfo.user)
  contactInfo: ContactInfo;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @ManyToMany(() => Meeting, (meeting) => meeting.attendees)
  @JoinTable()
  meetings: Meeting[];
}
