import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
//import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../store/createStore';
//import { getIsLoggedIn } from '../../../store/users';
import { getOrders, getOrdersLoadingStatus, enableModeSelectCourier, disableModeSelectCourier, orderDeliveryTimerUpdate, getSelectCourierModeStatus, getSelectCourierModeOrderId, orderToCourier } from '../../../store/orders';
import { getCouriers, getCouriersLoadingStatus, showCourierRoutes, reLoadCourier, setCourierActive, getActiveCourier,  updateMapRoute, getMapRoutes } from '../../../store/couriers';
import OrdersList from '../../ui/orders/OrdersList';
import OrdersListSkeleton from '../../ui/orders/OrdersList/OrdersListSkeleton';
import CouriersList from '../../ui/couriers/CouriersList';
import CouriersListSkeleton from '../../ui/couriers/CouriersList/CouriersListSkeleton';
//import Ymap from '../../common/Ymap'; 
import MapComponent from '../../common/MapComponent'; 

const pageSize = 999;
const Home = () => {
  //const isLoggedIn = useSelector(getIsLoggedIn());
  const orders = useSelector(getOrders());
  const couriers = useSelector(getCouriers());
  const mapRoutes = useSelector(getMapRoutes());
  const activeCourier = useSelector(getActiveCourier());

  const dispatch = useAppDispatch();

  const ordersIsLoading = useSelector(getOrdersLoadingStatus());
  const couriersIsLoading = useSelector(getCouriersLoadingStatus());
  const scm_mode = useSelector(getSelectCourierModeStatus());
  const scm_order_id = useSelector(getSelectCourierModeOrderId());

  const [courier_action_mode, setCourier_mode] = React.useState({courier_action_mode: '', action_courier_id: 0});


  //const scmUpdate = dispatch(getSelectCourierModeOrderId());


 // console.warn('ordersListCrop2222', orders);

//Обратный отсчет времени заказа
 React.useEffect(()=>{
    window.setInterval(()=>{
      dispatch(orderDeliveryTimerUpdate());
    }, 14000)
    },
    []
  )

  type ClickHandler = ($order_id: number) => (e: React.MouseEvent) => void;
  type ClickTargerCourier = ($courier_id: number, $status: boolean) => void;
  type updateRouteType = (index: number, courier_id: number, status:boolean, route:any, points: any[]) => void;

  //Клик по кнопке назначить курьера
  const scm_update=(status: boolean, $order_id: number) =>{
    if(status)
        dispatch( enableModeSelectCourier( {status: status, order_id: $order_id} ) );
    else 
        dispatch( disableModeSelectCourier( {status: status, order_id: $order_id} ) );
  }
  
  const targerCourier:ClickTargerCourier=($courier_id, $status) =>{
    dispatch( setCourierActive( $courier_id === activeCourier ? null : $courier_id ) );
    dispatch( showCourierRoutes( {courier_id: $courier_id, status: $status} ) );
  }

  const updateRoute:updateRouteType=(index, courier_id, status, route, points) =>{
    dispatch( updateMapRoute( {index: index, data: {courier_id, status, route, points} } ));
  }

  //Назначение курьера
  const setCourierToOrder: ClickHandler = ($courier_id) => (e) =>{
     if(scm_mode){
        //dispatch( courierToOrder({ courier: $courier_id }) );
        const updateOrderPayload = {
          order_id: scm_order_id,
          courier_id: Number($courier_id),
        };
        dispatch(orderToCourier(updateOrderPayload));
        //dispatch(reLoadCourier($courier_id)); //теперь обновляет через сокет
     }
     else{
        //console.log('scm_mode=false')
        // dispatch( disableModeSelectCourier( {status: status, order_id: $order_id} ) );
     }
  }

  const selectOrderForAction = ($order_id:number) =>{
    // alert($order_id);
    console.warn('selectOrderForActionHome', $order_id)
    setCourier_mode({courier_action_mode: '', action_courier_id: 0});
  }
   
  return (
    <div className="main-home__wrapper">
      <div className="couriers-orders-wrapper">
          {ordersIsLoading ? 
              <OrdersListSkeleton pageSize={pageSize} /> 
              : 
              <OrdersList 
                type="free"
                orders={orders} 
                scm={scm_mode} 
                scm_order_id={scm_order_id} 
                courier_action_mode={courier_action_mode}
                activeCourier={activeCourier}
                scmUpdate={scm_update}
                selectOrderForAction={selectOrderForAction}
              />}
          { (couriersIsLoading) 
            ? 
              <CouriersListSkeleton pageSize={pageSize} /> 
            : 
              <CouriersList 
                  couriers={couriers} 
                  scm={scm_mode} 
                  scm_order_id={scm_order_id} 
                  activeCourier={activeCourier}
                  setCourierToOrder={setCourierToOrder} 
                  targerCourier={targerCourier}
              />
          }
          
          { (ordersIsLoading || couriersIsLoading) ? 
            <OrdersListSkeleton pageSize={pageSize} /> 
            : 
            <OrdersList 
              type="take" 
              orders={orders} 
              scm={scm_mode} 
              scm_order_id={scm_order_id}
              activeCourier={activeCourier}
              courier_action_mode={courier_action_mode}
              scmUpdate={scm_update}
              selectOrderForAction={selectOrderForAction}
            />
          }
        {/* {roomsIsLoading ? <RoomsListSkeleton pageSize={pageSize} /> : <RoomsList rooms={roomsListCrop} />}   scm_update={scmUpdate} */}
      </div>
      
      <div className="map-wrapper">

          {ordersIsLoading ? 'загрузка' : <MapComponent couriers={couriers} orders={orders} routes={mapRoutes} updateRoute={updateRoute} dispatch={dispatch}/> }        

      </div>
    </div>
  )
}

export default Home