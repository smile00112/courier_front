import React from 'react';
import CourierCard from '../CourierCard';
import { CourierType } from '../../../../types/types';
import {WalkerIcon, CarIcon, BicycleIcon } from '../../../../components/common/Icon/Icon'

type CourierListProps = {
  couriers: CourierType[];
  scm: boolean,
  scm_order_id: number,
  activeCourier: number,  
  setCourierToOrder: (scourier_id: number) => React.MouseEventHandler<HTMLLIElement>;//React.MouseEvent<HTMLElement>,  
  targerCourier: (courier_id: number, status: boolean) => void;
};



const CouriersList: React.FC<CourierListProps> = ({ couriers, scm, scm_order_id, activeCourier, setCourierToOrder, targerCourier }) => {

  const [couriersFilter, setCouriersFilter] = React.useState('');
  const couriersFilterHandle = (new_filter: string) => (event: React.MouseEvent<unknown>) => {
    if(couriersFilter === new_filter) new_filter = ''; 
    setCouriersFilter(new_filter);
  };

  //фильтруем по транспорту
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
       var itemClass = 'couriers__list-item '+ ( ( courier.id === activeCourier ) ? ' active' : '' ) ;// + ( ( scm && (courier.id !== scm_order_id) ) ? ' disabled' : '' ) 
       return (
        <li key={'cour_'+courier.id} className={itemClass} onClick={setCourierToOrder(courier.id)}>
          <CourierCard courier={courier} scm={scm} scm_order_id={scm_order_id} targerCourier={targerCourier}/>
        </li>
      )})}
    </ul>
  );
};

export default React.memo(CouriersList);
