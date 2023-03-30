import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GameHistory {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id?: string;

  @Column()
  mode: string;

  @Column()
  date: string;

  @Column()
  duration: number;

  @Column() p1_intraId: string;
  @Column() p1_nameInGame: string;
  @Column() p1_scoreMade: number;
  @Column() p1_goalsMade: number;
  @Column() p1_goalsTaken: number;

  @Column() p2_intraId: string;
  @Column() p2_nameInGame: string;
  @Column() p2_scoreMade: number;
  @Column() p2_goalsMade: number;
  @Column() p2_goalsTaken: number;

  @Column() p3_intraId?: string;
  @Column() p3_nameInGame?: string;
  @Column() p3_scoreMade?: number;
  @Column() p3_goalsMade?: number;
  @Column() p3_goalsTaken?: number;

  @Column() p4_intraId?: string;
  @Column() p4_nameInGame?: string;
  @Column() p4_scoreMade?: number;
  @Column() p4_goalsMade?: number;
  @Column() p4_goalsTaken?: number;
}
