import React from 'react';
import CourierCardTest from '../CourierCardTest';
import { CourierType } from '../../../../types/types';
import {WalkerIcon, CarIcon, BicycleIcon } from '../../../../components/common/Icon/Icon'

type CourierListProps = {
  couriers: CourierType[];
  scm: boolean,
  scm_order_id: number,
  courier_action_mode: {courier_action_mode: string, action_courier_id: number},
  activeCourier: number,  
  setCourierToOrder: (scourier_id: number) => React.MouseEventHandler<HTMLLIElement>;//React.MouseEvent<HTMLElement>,  
  targerCourier: (courier_id: number, status: boolean) => void;
  actionModeUpdate: (courier_id: number, status: string) => void;  
  courierFieldUpdate: ($courier_id: number, $field: string, $value: string) => void;
  
};



const CouriersList: React.FC<CourierListProps> = ({ couriers, scm, scm_order_id, courier_action_mode, activeCourier, setCourierToOrder, targerCourier, actionModeUpdate, courierFieldUpdate }) => {

  const [couriersFilter, setCouriersFilter] = React.useState('');
  const couriersFilterHandle = (new_filter: string) => (event: React.MouseEvent<unknown>) => {
    if(couriersFilter === new_filter) new_filter = ''; 
    setCouriersFilter(new_filter);
  };

  const filter_couriers = (couriers, couriersFilter) => couriers.filter(courier => (courier.transport === couriersFilter || !couriersFilter));
  

  return (
    <ul className='couriers__list'>
      <li className="couriers-sorting">
          <div className="couriers-sorting__warapper">  
            <div className="title-text">Доставщики</div>
            <div className="elements">
              <div className={'car' + (couriersFilter ===  'car' ? " active" : "")} onClick={couriersFilterHandle('car')}><CarIcon/></div>
              <div className={'bicycle' + (couriersFilter ===  'bicycle' ? " active" : "")} onClick={couriersFilterHandle('bicycle')}><BicycleIcon/></div>
              <div className={'walker' + (couriersFilter ===  'walker' ? " active" : "")} onClick={couriersFilterHandle('walker')}><WalkerIcon/></div>
            </div>
          </div>
      </li>
      {filter_couriers(couriers, couriersFilter).map(courier => {
       var itemClass = 'couriers__list-item '+ ( ( courier.id === activeCourier ) ? ' active' : '' );// + ( ( scm && (courier.id !== scm_order_id) ) ? ' disabled' : '' ) 
       return (
        <li key={'cour_'+courier.id} className={itemClass} onClick={setCourierToOrder(courier.id)}>
          <CourierCardTest 
              courier={courier} 
              scm={scm} 
              scm_order_id={scm_order_id} 
              courier_action_mode={courier_action_mode}
              targerCourier={targerCourier}
              actionModeUpdate={actionModeUpdate}
              courierFieldUpdate={courierFieldUpdate}

          />
        </li>
      )})}
    </ul>
  );
};

export default React.memo(CouriersList);
