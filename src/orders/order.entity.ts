import { OrderDetails } from 'src/entities/OrderDetails.entity';
import { User } from 'src/users/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'orders',
})
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: string;

  @OneToOne(() => OrderDetails, (orderDetails) => orderDetails.order, { cascade: true, onDelete: 'CASCADE' })
  orderDetail: OrderDetails;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn()
  user: User;
}
