import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryColumn()
  intraId?: string;

  @Column({
    nullable: false,
    default: '',
  })
  email?: string;

  @Column({
    default: false,
  })
  mfa_enabled?: boolean;

  @Column({
    default: false,
  })
  mfa_verified?: boolean;

  @Column()
  name?: string;

  @Column()
  image?: string;

  @Column()
  score?: number;

  @Column('simple-array')
  friends?: string[];

  @Column('simple-array')
  blocks?: string[];
}
// Don't forget to update backend/src/user/service/user.service.tx:registerUserOk42
// Don't forget to `make re` after editing this file!
