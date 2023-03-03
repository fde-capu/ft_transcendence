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
  mfa_enabled?: boolean;

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

  @Column({default:false})
  isLogged?: boolean;

  @Column("simple-array")
  friends?: string[];
}
// Don't forget to update backend/src/user/service/user.service.tx:registerUserOk42
// Don't forget to `make re` after editing this file!
