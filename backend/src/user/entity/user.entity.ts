
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    name: 'user_id',
  })
  id: string;

  @Column({
    nullable: false,
    default: '',
    name: 'username'
  })
  login: string;

  @Column({
    nullable: false,
    default: '',
  })
  email: string;

}