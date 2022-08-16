import React, { PropsWithChildren, ReactElement } from 'react';
import OrdersFilterItem from '../OrdersFiltersItem';

type OrdersFiltersListProps = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  data: { [key: string]: any };
  children: React.ReactNode;
};

type FilterItemProps = {
  name: string;
  title?: string;
  data?: {
    [key: string]: any;
  };
  value?: string;
  error?: string;
  type?: string;
  props?: {
    [key: string]: any;
  };
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const OrdersFiltersList: React.FC<OrdersFiltersListProps> = ({ handleChange, data, children }) => {
  const clonedElements = React.Children.map(children, child => {
    const item = child as ReactElement<PropsWithChildren<FilterItemProps>>;
    const childType = typeof item;
    let config = {};
    if (
      childType === 'object' ||
      (childType === 'function' && item.props.type !== 'submit' && item.props.type !== 'button')
    ) {
      config = {
        ...item.props,
        data,
        onChange: handleChange,
        value: data[item.props.name],
      };
    }

    return <OrdersFilterItem title={item.props.title}>{React.cloneElement(item, config)}</OrdersFilterItem>;
  });

  return <form className='filters__form'>{clonedElements}</form>;
};

export default React.memo(OrdersFiltersList);
