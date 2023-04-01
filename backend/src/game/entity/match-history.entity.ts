import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { GameMode } from './room.entity';
import { Users } from '../../user/entity/user.entity';

@Entity()
export class MatchHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: GameMode })
  mode: GameMode;

  @CreateDateColumn()
  createdDate: Date;

  @OneToMany(() => TeamMatchHistory, (team) => team.match, {
    cascade: true,
    eager: true,
  })
  teams: Array<TeamMatchHistory>;
}

export enum TeamPosition {
  LEFT = 0,
  RIGHT = 1,
  TOP = 2,
  BOTTOM = 3,
}

@Entity()
export class TeamMatchHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TeamPosition })
  position: TeamPosition;

  @Column({ type: 'int' })
  score: number;

  @ManyToOne(() => MatchHistory, (matchHistory) => matchHistory.teams)
  match: MatchHistory;

  @ManyToMany(() => Users, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  players: Array<Users>;
}
