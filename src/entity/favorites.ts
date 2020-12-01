import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
} from 'typeorm'
import { User } from './user'
@Entity()
export class Favorites extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  latex!: string

  @Column('varchar', { length: 45 })
  title!: string

  @ManyToOne(() => User, (user: any) => user.photos, { onDelete: 'CASCADE' })
  user!: User
}
