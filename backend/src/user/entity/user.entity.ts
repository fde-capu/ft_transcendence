
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn({
    name: 'user_id',
  })
  id?: string;

  @Column({
    nullable: false,
    default: '',
    name: 'username'
  })
  login?: string;

  @Column({
    nullable: false,
    default: '',
  })
  email?: string;

  @Column({
    
    default: true,
  })
  mfa_enable?: boolean;
  @Column({
    default: false,
  })
  mfa_verified?: boolean;

}