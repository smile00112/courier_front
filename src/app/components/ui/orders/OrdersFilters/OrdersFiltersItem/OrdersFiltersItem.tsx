import React from 'react';

type OrdersFiltersItemProps = {
  title?: string;
  children: React.ReactNode;
};

const OrdersFiltersItem: React.FC<OrdersFiltersItemProps> = ({ title, children }) => {
  return (
    <div className='filters__item'>
      <fieldset className='filters__group'>
        {title && <legend className='filters__group-title'>{title}</legend>}
        {children}
      </fieldset>
    </div>
  );
};

export default React.memo(OrdersFiltersItem);
