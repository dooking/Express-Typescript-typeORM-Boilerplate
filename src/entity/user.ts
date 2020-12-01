import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
} from 'typeorm'
import { Favorites } from './favorites'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('varchar', { length: 45 })
  userId!: string

  @Column('varchar', { length: 45 })
  nickName!: string

  @Column()
  profileUrl!: string

  @OneToMany(() => Favorites, (favorites: any) => favorites.user, {
    onDelete: 'CASCADE',
  })
  favorites!: Favorites[]
}
