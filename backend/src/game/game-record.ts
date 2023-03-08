import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GameHistory {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id?: string;

	@Column()
	idA: string;

	@Column()
	idB: string;

	@Column()
	playerA: string;

	@Column()
	playerB: string;

	@Column()
	scoreA: number;

	@Column()
	scoreB: number;

	@Column()
	goalsA: number;

	@Column()
	goalsB: number;

	@Column()
	winA: boolean;

	@Column()
	winB: boolean;

	@Column()
	date: string;

	@Column()
	duration: number;
}
