import React from 'react';
import { SelectField } from '../../../common/Fields';

const roomsSortArray = [
  { name: 'По убыванию', value: { path: 'roomNumber', order: 'desc' } },
  { name: 'По возрастанию', value: { path: 'roomNumber', order: 'asc' } },
  { name: 'Популярное', value: { path: 'countReviews', order: 'desc' } },
  { name: 'Высокий рейтинг', value: { path: 'rate', order: 'desc' } },
  { name: 'Сначала дешёвые', value: { path: 'price', order: 'asc' } },
  { name: 'Сначала дорогие', value: { path: 'price', order: 'desc' } },
];

type OrdersSortProps = {
  sortBy: { path: string; order: 'asc' | 'desc' };
  onSort: (event: any) => void;
};

const OrdersSort: React.FC<OrdersSortProps> = ({ sortBy, onSort }) => {
  return (
    <SelectField
      name='roomSort'
      style={{ minWidth: '200px' }}
      label='Сортировать'
      value={JSON.stringify(sortBy)}
      onChange={onSort}
      options={roomsSortArray}
    />
  );
};

export default OrdersSort;
