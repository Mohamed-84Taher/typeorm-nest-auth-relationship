import { BadRequestException, Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { UserCreateDto } from './dto/userCreateDto.dto';
import { UserUpdateDto } from './dto/userUpdateDto.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { ContactInfo } from './entities/contact_info.entity';
import { Task } from './entities/task.entity';
import { Meeting } from './entities/meeting.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(ContactInfo)
    private contactInfoRepo: Repository<ContactInfo>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(Meeting) private meetingRepo: Repository<Meeting>,
  ) {}
  // get all users or filtered users by email and username
  getAllUsers(username?: string, email?: string): Promise<User[]> {
    if (username || email) {
      return this.userRepository.find({
        where: [
          {
            username: Raw((alias) => `LOWER(${alias}) Like '%${username}%'`),
          },
          {
            email: Raw((alias) => `LOWER(${alias}) Like '%${email}%'`),
          },
        ],
      });
    }
    return this.userRepository.find();
  }

  async createUser(createUserDto: UserCreateDto): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (foundUser) throw new BadRequestException('User is already exists');

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
    createUserDto.password = hash;
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async updateUser(id: number, updateUserDto: UserUpdateDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    return this.userRepository.save({ ...user, ...updateUserDto });
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    return this.userRepository.remove(user);
  }

  async getCurrentUser(id: number) {
    return this.userRepository.findBy({ id: id });
  }

  async seed() {
    const ceo = this.userRepository.create({
      username: 'ceo',
      email: 'ceo@gmail.com',
      password: '123456',
    });
    await this.userRepository.save(ceo);

    const ceoContactInfo = this.contactInfoRepo.create({ phone: 123456 });
    ceoContactInfo.user = ceo;
    await this.contactInfoRepo.save(ceoContactInfo);

    const manager = this.userRepository.create({
      username: 'Marius',
      email: 'marius@gmail.com',
      password: '123456',
      manager: ceo,
    });
    const task1 = this.taskRepo.create({ name: 'Hire people' });
    await this.taskRepo.save(task1);
    const task2 = this.taskRepo.create({ name: 'PRESENT TO CEO' });
    await this.taskRepo.save(task2);

    manager.tasks = [task1, task2];

    const meeting1 = this.meetingRepo.create({ zoomUrl: 'meeting.com' });
    meeting1.attendees = [ceo];
    await this.meetingRepo.save(meeting1);

    manager.meetings = [meeting1];

    await this.userRepository.save(manager);
  }
  getUserById(id: number) {
    /*     return this.userRepository.findOne({
      relations: [
        'manager',
        'directReports',
        'tasks',
        'meetings',
        'contactInfo',
      ],
      where: { id },
    }); */
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.directReports', 'directReports')
      .leftJoinAndSelect('user.meetings', 'meetings')
      .leftJoinAndSelect('user.tasks', 'tasks')
      .leftJoinAndSelect('user.manager', 'manager')
      .where('user.id = :userId', { userId: id })
      .getOne();
  }
  deleteEmplyee(id: number) {
    return this.userRepository.delete(id);
  }
}
