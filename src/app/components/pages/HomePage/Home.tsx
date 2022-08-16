import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
//import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../store/createStore';
import { getOrders, getOrdersLoadingStatus, loadFilteredOrdersList, orderDeliveryTimerUpdate } from '../../../store/orders';
import OrdersList from '../../ui/orders/OrdersList';
import OrdersListSkeleton from '../../ui/orders/OrdersList/OrdersListSkeleton';


const pageSize = 999;
const Home = () => {

  const orders = useSelector(getOrders());
  const dispatch = useAppDispatch();

  const ordersIsLoading = useSelector(getOrdersLoadingStatus());
 // console.warn('ordersListCrop2222', orders);

 React.useEffect(()=>{
    window.setInterval(()=>{
      dispatch(orderDeliveryTimerUpdate());
   }, 14000)

  },[])


  return (
    <div>
          {ordersIsLoading ? <OrdersListSkeleton pageSize={pageSize} /> : <OrdersList orders={orders} />}
        {/* {roomsIsLoading ? <RoomsListSkeleton pageSize={pageSize} /> : <RoomsList rooms={roomsListCrop} />} */}
    </div>
  )
}

export default Home