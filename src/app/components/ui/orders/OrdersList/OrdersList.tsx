import React from 'react';
import OrderCard from '../OrderCard';
import { OrderType } from '../../../../types/types';

type OrderListProps = {
  orders: OrderType[];
};


const OrdersList: React.FC<OrderListProps> = ({ orders }) => {
  return (
    <ul className='orders__list'>
      {orders.map(order => (
        <li key={order._id} className='orders__list-item'>
          <OrderCard {...order} />
        </li>
      ))}
    </ul>
  );
};

export default React.memo(OrdersList);
