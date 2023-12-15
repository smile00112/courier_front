import React from 'react';
import OrderCard from '../OrderCard';
import OrderCardTaked from '../OrderCard/OrdersCardTaked';
import { OrderType } from '../../../../types/types';
import { getCourierById } from '../../../../store/couriers';
import {useSelector} from "react-redux";

type OrderListProps = {
  type: string,
  orders: OrderType[],
  scm: boolean,
  scm_order_id: number,
  activeCourier: number,  
  courier_action_mode: {courier_action_mode: string, action_courier_id: number}, 
  scmUpdate: (status: boolean, order_id: number) => void;//React.MouseEvent<HTMLElement>,  
  selectOrderForAction: (order_id: number) => void;
  targerActiveOrder: (status: boolean, order_id: number)=> void;

};

const OrdersList: React.FC<OrderListProps> = ({
      type,
      orders,
      scm,
      scm_order_id,
      courier_action_mode,
      activeCourier,
      scmUpdate,
      selectOrderForAction,
      targerActiveOrder,
    }) => {

  const free = (type === 'free') ? true : false;
  const [location, setLocation] = React.useState(0);


    const [ordersFilter, setCouriersFilter] = React.useState(3);
  const ordersFilterHandle = (new_filter: number) => (event: React.MouseEvent<unknown>) => {
    setCouriersFilter(new_filter);
  };

  const filter_orders = (orders, ordersFilter, free) => orders.filter(order => {
    if(free) 
      return (order.status === 1 );

    // if( ordersFilter === 3 )
    //   return ( order.status === 3 || order.status === 2 )

    return ( order.status === ordersFilter )      
  });

  const clickOrderHandle = (order_id: number) => (event: React.MouseEvent<unknown>) => {
      selectOrderForAction(order_id);
  };

    const contenerClass = 'orders__list' + ( activeCourier && !free ? ' courier_active_mode' : '' );

    const activeCourierData = useSelector(getCourierById( activeCourier ));
   // console.error('____activeCourierData', activeCourierData)

  return (
    <ul className={contenerClass}>
      { 
      (!free) ? (
        <li className="orders-sorting">
            <div className="orders-sorting__warapper">  
                <div className={'delivery' + (ordersFilter ===  2  ? " active" : "")} onClick={ordersFilterHandle(2)}>В доставке</div>
                <div className={'delivery' + (ordersFilter ===  3 ? " active" : "")} onClick={ordersFilterHandle(3)}>Взяты</div>
                <div className={'closed' + (ordersFilter ===  4 ? " active" : "")} onClick={ordersFilterHandle(4)}>Завершены</div>
            </div>
        </li>
      ) : (
             <li className="orders-sorting">
                <div className="orders-sorting__warapper free">
                    <div className="title-text">
                        Не распределены
                        ({ orders.reduce((sum, order) => sum + (order.status === 1 ? 1 : 0), 0) })
                    </div>
                </div>
              </li>
       )
      }

      {
        filter_orders(orders, ordersFilter, free).map(order => {
          
          var 
            itemClass = 'orders__list-item';
            itemClass+= ( scm && (order.id !== scm_order_id) ) ? ' disabled' : '' ;
            itemClass+= free ? ' free_orders' : ' taked_orders';

          if(free){
            itemClass+= ( courier_action_mode.courier_action_mode && courier_action_mode.courier_action_mode !== 'take' ) ? ' disabled' : '' ;
            return (
              <li key={'order_not_taked_' + order._id} className={itemClass} onClick={clickOrderHandle(order.id)}>
                <OrderCard
                    free={free}
                    order={order}
                    scm={scm}
                    scm_order_id={scm_order_id}
                    scmUpdate={scmUpdate}
                    activeCourierData={activeCourierData}
                    targerActiveOrder={targerActiveOrder}
                    location={location}
                    setLocation={setLocation}

                />
              </li>
            )
          }

          if(!free){
            itemClass+= ( courier_action_mode.courier_action_mode && ( courier_action_mode.courier_action_mode === 'take' ||  courier_action_mode.action_courier_id !== order.courier_id ) ) ? ' disabled' : '' ;
            itemClass+= ( activeCourier && ( order.courier_id === activeCourier ) ? ' courier_active'+( (order.id === order.courier.current_order) ? ' current_order' : '') : '' );
            return (
              <li key={'order_taked_' + order._id} className={itemClass} onClick={clickOrderHandle(order.id)}>
                <OrderCardTaked
                    free={free}
                    order={order}
                    scm={scm}
                    scm_order_id={scm_order_id}
                    scmUpdate={scmUpdate}
                    targerActiveOrder={targerActiveOrder}
                    location={location}
                    setLocation={setLocation}
                />
              </li>
            )
          }
        })
      }
    </ul>
  );
};

export default React.memo(OrdersList);
