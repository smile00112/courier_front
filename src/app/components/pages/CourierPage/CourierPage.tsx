import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
//import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../store/createStore';
//import { getIsLoggedIn } from '../../../store/users';
import {
    getOrders,
    getOrdersLoadingStatus,
    enableModeSelectCourier,
    disableModeSelectCourier,
    orderDeliveryTimerUpdate,
    getSelectCourierModeStatus,
    getSelectCourierModeOrderId,
    orderToCourier,
    updateCourierCurrentOrderInOrder,
    getActiveOrder,
    seOrderActive,

} from '../../../store/orders';
import { getCouriers, getCouriersLoadingStatus, showCourierRoutes, reLoadCourier, courierActions, setCourierActive, getActiveCourier, updateCourierField } from '../../../store/couriers';
import OrdersList from '../../ui/orders/OrdersList';
import OrdersListSkeleton from '../../ui/orders/OrdersList/OrdersListSkeleton';
import CouriersListTest from '../../ui/couriersTest/CouriersListTest';
import CouriersListSkeleton from '../../ui/couriersTest/CouriersListTest/CouriersListSkeleton';
//import Ymap from '../../common/Ymap'; 
//import MapComponent from '../../common/MapComponent'; 




const pageSize = 999;
const CourierPage = () => {
  //const isLoggedIn = useSelector(getIsLoggedIn());
  const orders = useSelector(getOrders());
  const couriers = useSelector(getCouriers());
  //const mapRoutes = useSelector(getMapRoutes());

  const dispatch = useAppDispatch();

  const ordersIsLoading = useSelector(getOrdersLoadingStatus());
  const couriersIsLoading = useSelector(getCouriersLoadingStatus());
  const scm_mode = useSelector(getSelectCourierModeStatus());
  const scm_order_id = useSelector(getSelectCourierModeOrderId());
  const activeCourier = useSelector(getActiveCourier());
  const activeOrder = useSelector(getActiveOrder());

  const [courier_action_mode_obj , setCourier_mode] = React.useState({courier_action_mode: '', action_courier_id: 0});

  type ClickHandler = ($order_id: number) => (e: React.MouseEvent) => void;
  type ClickTargerOrder = ( $status: boolean, $order_id: number ) => void;
  type ClickTargerCourier = ($courier_id: number, $type: boolean) => void;
  type ClickCourierActionMode = ($courier_id: number, $type: string) => void;
  type ClickSetCourierField = ($courier_id: number, $field: string, $value: string) => void;
 // type updateRouteType = (index: number, courier_id: number, status:boolean, route:any, points: any[]) => void;

  //Клик по кнопке назначить курьера
  const scm_update=(status: boolean, $order_id: number) =>{
    if(status)
        dispatch( enableModeSelectCourier( {status: status, order_id: $order_id} ) );
    else 
        dispatch( disableModeSelectCourier( {status: status, order_id: $order_id} ) );
  }

    const targerActiveOrder:ClickTargerOrder=($status, $order_id) =>{
        dispatch( seOrderActive( $order_id === activeOrder ? null : $order_id ) );
    }

  const targerCourier:ClickTargerCourier=($courier_id, $status) =>{
    dispatch( setCourierActive( $courier_id === activeCourier ? null : $courier_id ) );
    dispatch( showCourierRoutes( {courier_id: $courier_id, status: $status} ) );
  }
  
  const setCourierActionMode:ClickCourierActionMode=($courier_id, $type) =>{
    if(courier_action_mode_obj.courier_action_mode !== $type)
      setCourier_mode({courier_action_mode: $type, action_courier_id: $courier_id });
    else 
      setCourier_mode({courier_action_mode: '', action_courier_id: 0});
  }

  const setCourierField:ClickSetCourierField=($courier_id, $field, $value) =>{
    console.warn('setCourierField', $courier_id, $field, $value);
    dispatch(updateCourierField({courier_id: $courier_id, field: $field, value: $value}))
    /* Если обновляется текущий заказ то обновляем его в поле курьера заказа */
    dispatch(updateCourierCurrentOrderInOrder({courier_id: $courier_id, field: $field, value: $value}))
  }
  
  const selectOrderForAction = ($order_id:number) =>{
    //console.warn('selectOrderForAction', courier_action_mode_obj, $order_id)
    dispatch( 
      courierActions( 
        {
          action: courier_action_mode_obj.courier_action_mode, 
          courier_id: courier_action_mode_obj.action_courier_id,
          order_id: $order_id,
        }
      )
    )
    setCourier_mode({courier_action_mode: '', action_courier_id: 0});
  }

  //Назначение курьера
  const setCourierToOrder: ClickHandler = ($courier_id) => (e) =>{
     if(scm_mode){
        //dispatch( courierToOrder({ courier: $courier_id }) );
        
        const updateOrderPayload = {
          id: scm_order_id,
          courier_id: Number($courier_id),
        };
        dispatch(orderToCourier(updateOrderPayload));
        dispatch(reLoadCourier($courier_id));
     }
     else{
        //console.log('scm_mode=false')
        // dispatch( disableModeSelectCourier( {status: status, order_id: $order_id} ) );
     }
  }

  //Обратный отсчет времени заказа
  React.useEffect(()=>{
    window.setInterval(()=>{
      dispatch(orderDeliveryTimerUpdate());
   }, 14000)
  },[]);


  return (
    <div className="main-home__wrapper">
      
      <div className="couriers-orders-wrapper">

      { (couriersIsLoading) ?   
        <CouriersListSkeleton pageSize={pageSize} /> 
        : 
        <CouriersListTest 
          couriers={couriers} 
          scm={scm_mode} 
          scm_order_id={scm_order_id} 
          courier_action_mode = {courier_action_mode_obj}
          activeCourier = {activeCourier}
          setCourierToOrder={setCourierToOrder} 
          targerCourier={targerCourier}
          actionModeUpdate = {setCourierActionMode} 
          courierFieldUpdate = {setCourierField}           
        />
      }


           {couriersIsLoading && ordersIsLoading ? 
              <OrdersListSkeleton pageSize={pageSize} /> 
              : 
              <OrdersList 
                  type="free" 
                  orders={orders} 
                  scm={scm_mode} 
                  scm_order_id={scm_order_id}
                  courier_action_mode={courier_action_mode_obj}
                  activeCourier={activeCourier}

                  scmUpdate={scm_update}
                  selectOrderForAction={selectOrderForAction}
                  targerActiveOrder={targerActiveOrder}

              />
            }
          
          { 
              (ordersIsLoading || couriersIsLoading) ? 
                <OrdersListSkeleton pageSize={pageSize} /> : 
                <OrdersList 
                    type="take" 
                    orders={orders} 
                    scm={scm_mode} 
                    scm_order_id={scm_order_id} 
                    courier_action_mode={courier_action_mode_obj}
                    activeCourier={activeCourier}

                    scmUpdate={scm_update}
                    selectOrderForAction={selectOrderForAction}
                    targerActiveOrder={targerActiveOrder}
                />
          } 
       
        {/* {roomsIsLoading ? <RoomsListSkeleton pageSize={pageSize} /> : <RoomsList rooms={roomsListCrop} />}   scm_update={scmUpdate} */}
      </div>
      
    </div>
  )
}

export default CourierPage