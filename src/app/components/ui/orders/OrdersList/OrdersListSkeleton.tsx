import React from 'react';
import OrderCardSkeleton from '../OrderCard/OrdersCardSkeleton';

const OrdersListSkeleton = ({ pageSize }: { pageSize: number }) => {
  const roomsSkeletonArray = Array(pageSize).fill('');
  return (
    <ul className='rooms__list'>
      {roomsSkeletonArray.map((_, idx) => (
        <li key={idx} className='rooms__list-item'>
          <OrderCardSkeleton />
        </li>
      ))}
    </ul>
  );
};

export default OrdersListSkeleton;
