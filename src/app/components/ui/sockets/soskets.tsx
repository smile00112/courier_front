import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sosketNewOrder, sosketUpdateOrder, reLoadOrder } from '../../../store/orders';
import {reLoadCourier, updateCourier} from '../../../store/couriers';
import { toast } from 'react-toastify';

const DEBUG = false;
declare global {
  interface window {
  Echo:any;
}
}

type ToastOptions = {}//чтобы typescript не ругался на seetings

const Soskets = () => {
  const dispatch = useDispatch();
  
  const show_toast = (message: string, type = '') => {
    const seetings = {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    } as ToastOptions;

    type ? toast[type]( message, seetings) : toast( message, seetings);
  }
  //https://fkhadra.github.io/react-toastify/introduction/  демки
  //https://unicode-table.com/ru/emoji/  юникоды ээмодзей 
  //toast.error('Something was wrong. Try it later');


  /**Сокеты канал курьеров**/
  window['Echo'].channel('operator_couriers')  
  .listen('UpdateCourierEvent', (e) => {
    // show_toast('Новый заказ №'+e.order.number);
     if(DEBUG) console.log('UpdateCourierEvent__');
     if(DEBUG) console.error(e);
     switch (e.event_type){
      case 'new_transport':
        show_toast(`${e.courier.fio} сменил транспорт на ${e.courier.transport}`, 'info');
        dispatch(reLoadCourier( e.courier.id ));

      break;
      case 'new_status':
        show_toast(`${e.courier.fio} сменил статус на ${e.courier.status}`, 'info');
      break;      
     }
   })

  /**Сокеты канал заказов**/
  window['Echo'].channel('operator_orders')
  .listen('NewOrderEvent', (e) => {
    //dispatch(sosketNewOrder(e));
    dispatch(reLoadOrder(e.order.id ));
    show_toast(`❗ Получен новый заказ №'${e.order.number} ❗`);
    if(DEBUG) console.log('NewOrderEvent');
    if(DEBUG) console.error(e);
  })

  .listen('UpdateOrderEvent', (e) => {
      //this.updateOrderEvent(e);
      if(DEBUG) console.log('UpdateOrderEvent__' + e.event_type);
      if(DEBUG) console.error(e);

      //dispatch(sosketUpdateOrder({data: e.order}));
      dispatch(reLoadOrder( e.order.id ));
      //dispatch(updateCourier(e.courier));
      dispatch(reLoadCourier( e.courier.id ));

      switch (e.event_type){
        case 'takeOrder':
          show_toast(`Заказ №${e.order.number} принят ${e.courier.fio}`, 'info');
        break;
        case 'pickupOrder':
          show_toast(`${e.courier.fio} забрал заказ №${e.order.number}`, 'info');
        break;        
        case 'setOrder':
          show_toast(`Заказ №${e.order.number} назначен ${e.courier.fio}`, 'info');
        break;        
        case 'canselOrder':
          show_toast(`${e.courier.fio} отказался от заказа №${e.order.number}`, 'error');
        break;
        case 'finishOrder':
          show_toast(`${e.courier.fio} доставил заказ №${e.order.number}`, 'success');
        break;    
        default:
          console.log('Uncnow_sosket_event', e)
          //show_toast(`Статус заказа №${e.order.number} поменялся на ${e.order.status}`);
        break;   

      }

  })
  .listen('DeleteOrderEvent', (e) => {
      //this.deleteOrderEvent(e);
      if(DEBUG) console.log('DeleteOrderEvent');
      if(DEBUG) console.error(e);
  })
  .listen('OrderTaked', (e) => {
      dispatch(updateCourier(e.courier));
      dispatch(sosketUpdateOrder(e.order));

      show_toast(`Заказ №${e.order.number} взят ${e.courier.fio}`, 'warn');
      if(DEBUG) console.log('OrderTakedEvent');
      if(DEBUG) console.error(e);
  });


    return (
      <></>
    );

  }


export default Soskets;