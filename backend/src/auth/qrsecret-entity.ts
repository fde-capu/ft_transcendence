import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class QRSecret {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id?: string;

  @Column()
  intraId: string;

  @Column()
  secret: string;
}
