import React from 'react';
import CourierCardSkeleton from '../CourierCardTest/CouriersCardSkeletonTest';

const CouriersListSkeleton = ({ pageSize }: { pageSize: number }) => {
  const roomsSkeletonArray = Array(pageSize).fill('');
  return (
    <ul className='rooms__list'>
      {roomsSkeletonArray.map((_, idx) => (
        <li key={idx} className='rooms__list-item'>
          <CourierCardSkeleton />
        </li>
      ))}
    </ul>
  );
};

export default CouriersListSkeleton;
