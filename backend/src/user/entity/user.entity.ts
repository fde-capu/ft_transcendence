import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface UserDTO {
  intraId: string;
  name: string;
  image: string;
  score?: number;
  mfa_enabled: boolean;
  friends?: string[];
  blocks?: string[];
  status?: string;
}

export interface StatisticsDTO {
	score: number;
	matches: number;
	wins: number;
	goalsMade: number;
	goalsTaken: number;
	scorePerMatches: number; // *
	looses: number; // *
	winsPerLooses: number; // *
	goalsMadePerTaken: number; // *
	// * No need to be on database, because its calculated.
}

@Entity()
export class Users {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id?: string;

  @Column({
    nullable: false,
    default: '',
    name: 'intraId',
  })
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

  @Column({ default: 'DEFAULT_IMAGE' })
  image?: string;

  @Column()
  score?: number;

  @Column("simple-array")
  friends?: string[];

  @Column("simple-array")
  blocks?: string[];
}
// Don't forget to update backend/src/user/service/user.service.tx:registerUserOk42
// Don't forget to `make re` after editing this file!
