import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;
}
