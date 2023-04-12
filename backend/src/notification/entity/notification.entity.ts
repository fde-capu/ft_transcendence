import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Users as User } from '../../user/entity/user.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  fromSocketId?: string;

  @ManyToOne(() => User, { nullable: true, eager: true })
  from?: User;

  @ManyToOne(() => User, { eager: true })
  to: User;

  @Column({ nullable: true })
  toSocketId?: string;

  @Column()
  template: string;

  @Column({ nullable: true })
  answer?: string;

  @Column({ nullable: true })
  expiresAt?: Date;

  @Column({ default: true })
  answerable: boolean;

  @Column({ type: 'json', default: {}, nullable: true })
  extra: Record<string, string>;
}
