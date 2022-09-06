import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sosketNewOrder, sosketUpdateOrder } from '../../../store/orders';
import { updateCourier } from '../../../store/couriers';
import { toast } from 'react-toastify';

// import { loadLikesList } from '../../../store/likes';
// import { loadReviewsList } from '../../../store/reviews';
// import { loadRoomsList } from '../../../store/rooms';
const DEBUG = true;
declare global {
  interface window {
  Echo:any;
}
}

const Soskets = () => {
  const dispatch = useDispatch();
  const usersStatusLoading = false;// useSelector(getUsersLoadingStatus());

  const show_toast = (message: string) => {
    toast.info( message, {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }
  //toast.error('Something was wrong. Try it later');


  /**Сокеты канал курьеров**/
  window['Echo'].channel('operator_couriers')  
  .listen('UpdateCourierEvent', (e) => {
    // show_toast('Новый заказ №'+e.order.id);
     if(DEBUG) console.log('UpdateCourierEvent__');
     if(DEBUG) console.error(e);
     switch (e.event_type){
      case 'new_transport':
        show_toast(`${e.courier.fio} сменил транспорт на ${e.courier.transport}`);
      break;
      case 'new_status':
        show_toast(`${e.courier.fio} сменил статус на ${e.courier.status}`);
      break;      
     }
   })

  /**Сокеты канал заказов**/
  window['Echo'].channel('operator_orders')
  .listen('NewOrderEvent', (e) => {
    dispatch(sosketNewOrder(e));
    show_toast('Новый заказ №'+e.order.id);
    if(DEBUG) console.log('NewOrderEvent');
    if(DEBUG) console.error(e);
  })

  .listen('UpdateOrderEvent', (e) => {
      //this.updateOrderEvent(e);
      if(DEBUG) console.log('UpdateOrderEvent__' + e.event_type);
      if(DEBUG) console.error(e);

      dispatch(sosketUpdateOrder({data: e.order}));
      dispatch(updateCourier(e.courier));

      switch (e.event_type){
        case 'takeOrder':
          show_toast(`Заказ №${e.order.id} принят ${e.courier.fio}`);
        break;
        case 'pickupOrder':
          show_toast(`${e.courier.fio} забрал заказ №${e.order.id}`);
        break;        
        case 'setOrder':
          show_toast(`Заказ №${e.order.id} назначен ${e.courier.fio}`);
        break;        
        case 'canselOrder':
          show_toast(`${e.courier.fio} отказался от заказа №${e.order.id}`);
        break;
        case 'finishOrder':
          show_toast(`${e.courier.fio} доставил заказ №${e.order.id}`);
        break;    
        default:
          show_toast(`Статус заказа №${e.order.id} поменялся на ${e.order.status}`);
        break;   

      }

  })
  .listen('DeleteOrderEvent', (e) => {
      //this.deleteOrderEvent(e);
      if(DEBUG) console.log('DeleteOrderEvent');
      if(DEBUG) console.error(e);
  })
  .listen('OrderTaked', (e) => {
      //this.deleteOrderEvent(e);

      dispatch(updateCourier(e.courier));
      dispatch(sosketUpdateOrder(e.order));

      show_toast(`Заказ №${e.order.id} взят ${e.courier.fio}`);
      if(DEBUG) console.log('OrderTakedEvent');
      if(DEBUG) console.error(e);
  });


    return (
      <></>
    );

  }


export default Soskets;