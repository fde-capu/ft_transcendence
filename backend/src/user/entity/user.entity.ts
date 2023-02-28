
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id?: string;

  @Column({
    nullable: false,
    default: '',
    name: 'intraId'
  })
  intraId?: string;

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

  @Column()
  name?: string;

  @Column({default:'DEFAULT_IMAGE'})
  image?: string;

  @Column()
  score?: number;
}
