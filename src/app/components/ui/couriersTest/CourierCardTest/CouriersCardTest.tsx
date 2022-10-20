// import AcUnitIcon from '@mui/icons-material/AcUnit';
// import ComputerIcon from '@mui/icons-material/Computer';
// import WifiIcon from '@mui/icons-material/Wifi';
import React from 'react';
//import { getReviewsByCourierId } from '../../../../store/reviews';
//import { getReviewsByCourierId } from '../../../../store/couriers';
import declOfNum from '../../../../utils/declOfNum';
//import Badge from '../../../common/Badge';
import {DotsIcon, WalkerIcon, CarIcon, BicycleIcon, TargetIcon, TimeIcon } from '../../../../components/common/Icon/Icon'
//import ImageSlider from '../../../common/ImageSlider';
//import Rating from '../../../common/Rating';
import { CourierType } from '../../../../types/types';
import { Select, MenuItem, InputLabel, SelectChangeEvent, Button } from '@mui/material';


// import ListSubheader from '@mui/material/ListSubheader';

type CourierListProps = {
  courier: CourierType;
  scm: boolean,
  scm_order_id: number,
  courier_action_mode: {courier_action_mode: string, action_courier_id: number},
  targerCourier: (courier_id: number, status: boolean) => void;
  actionModeUpdate: (courier_id: number, status: string) => void;
  courierFieldUpdate: ($courier_id: number, $field: string, $value: string) => void;
};
type targerCourierHandle = (courier_id: number, status: boolean) => (e: React.MouseEvent) => void;
type declOfNumProps = (n: number,   titles: String[]) => String;

// const comfortIconsMap: { [x: string]: JSX.Element } = {
//   hasWifi: <WifiIcon />,
//   hasConditioner: <AcUnitIcon />,
//   hasWorkSpace: <ComputerIcon />,
// };


const CourierCardTest: React.FC<CourierListProps> = ({ courier, scm, scm_order_id, courier_action_mode, targerCourier, actionModeUpdate, courierFieldUpdate } ) => {
  
  const isOnline = (courier.status === 'online') ? true : false;

  const transportIcon = () => {
    let color = ( ( courier.orders.length <=2 ) ? 'white' : 'default');
    if(!isOnline) color = 'grey';
    switch (courier.transport) {
      case 'bicycle':
        return <BicycleIcon color={color}/>
      break;
      case 'car':
        return <CarIcon color={color}/>
      break;    
      case 'walker':
        return <WalkerIcon color={color}/>
      break;   
      default:
        return <TimeIcon color={color}/>
      break;
    }
  };

  const targerCourierHandle = (courier_id: number, show_route: boolean) => (event: React.MouseEvent<unknown>) => {
    setElActive(!elActive);
    targerCourier(courier_id, show_route);
  };

  const transportHandleChange =  (event: SelectChangeEvent<string>) => {
    const value = event.target.value ;
    courierFieldUpdate(courier.id, 'transport', value)
    // setElActive(!elActive);
    // targerCourier(courier_id, show_route);
  };
  const statusHandleChange =  (event: SelectChangeEvent<string>) => {
    const value = event.target.value ;
    courierFieldUpdate(courier.id, 'status', value)
  };
  const current_orderHandleChange =  (event: SelectChangeEvent<string>) => {
    const value = event.target.value ;
    courierFieldUpdate(courier.id, 'current_order', value)
  };
  const courierHandle = ( type: string) => (event: React.MouseEvent<unknown>) => {
    actionModeUpdate(courier.id, type);
    //alert(courier.id);
    // setElActive(!elActive);
    // targerCourier(courier_id, show_route);
  };




  const get_bg_color = () => {
    if(!isOnline) return 'bg-black';
    if( courier.orders.length <=1 ) return 'bg-green';
    if( courier.orders.length === 2 ) return 'bg-yellow'; 
    if( courier.orders.length > 2 ) return 'bg-red';
    
    return 'bg-grey';
  }

  const declOfNum:declOfNumProps = (n, titles) => {
    return titles[
      n % 10 === 1 && n % 100 !== 11
        ? 0
        : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
        ? 1
        : 2
    ];
  }
  
  const get_status_text = () => {
    if(!isOnline) return 'Офлайн';
    if( courier.orders.length === 0 ) return 'Свободен';
    
    return  courier.orders.length + ' достав' + ( declOfNum(courier.orders.length, ['ка', 'ки', 'ок']) ) ;
  }

  const get_time_text = () => {
    return '14 мин';
  }

  const get_dots_color = () => {
    return ( (!isOnline) ? 'grey': 'white' );
  }

  const [elActive, setElActive] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const handleClick = () => {
    setOpen(!open);
  };

  const current_order:string = String(courier.current_order || '') ;

  return (
    <div className={'courier-card '+ (elActive === true ? "active " : "") + get_bg_color()} onClick={ targerCourierHandle(courier.id, !courier.show_route) }>

      <div className='courier-card__top'>
        <div className="courier-card__courier-info">
          <div className='courier-card__courier-info__f'>
            <div>{transportIcon()}</div>
            <div>{get_status_text()}</div>
          </div>
          <div className='courier-card__courier-info__l'>{get_time_text()}</div> 
        </div> 
        <div className="courier-card__context-menu">
          <DotsIcon color={get_dots_color()}></DotsIcon>
        </div>
      </div>
      <div className='courier-card__body'>
        <div className='courier-card__body-top'>
          <ul className="courier-card__info-list">
            <li><img src={courier.avatar} /> </li>           
            <li>{ courier.last_name } {courier.first_name}</li>
            {/* <li><div className='courier_targer' ><TargetIcon/></div></li>  */}
            {/* <li> {courier.show_route ? 'on' : ''} </li>            */}
          </ul>
        </div>
        <div className='courier-card__body-bottom'>
          <ul className="courier-card__actions-list">
            <li>
              <InputLabel id="status-select-label" className="courier-action-input-label">Cтатус</InputLabel>
              <Select
                labelId="status-select-label"
                id="status-select"
                value={courier.status}
                label="status"
                onChange={statusHandleChange}
                className="courier-action-select"
              >
                <MenuItem value='offline'>Офлайн</MenuItem>
                <MenuItem value='online'>Онлайн</MenuItem>
              </Select>
            </li>
            
            <li>
              <InputLabel id="transport-select-label" className="courier-action-input-label">Транспорт</InputLabel>
              <Select
                labelId="transport-select-label"
                id="transport-select"
                value={courier.transport}
                label="transport"
                onChange={transportHandleChange}
                className="courier-action-select"
              >
                <MenuItem value='car'>Машина</MenuItem>
                <MenuItem value='bicycle'>Велосипед</MenuItem>
                <MenuItem value='walker'>Пешки</MenuItem>
              </Select>

            </li>

            <li>
              <InputLabel id="current_order-select-label" className="courier-action-input-label">Текущий заказ</InputLabel>
              <Select
                labelId="current_order-select-label"
                id="current_order-select"
                key={'kkk'+courier.id}
                value={current_order}
                label="current_order"
                onChange={current_orderHandleChange}
                className="courier-action-select"
              >
                <MenuItem value=''>Не выбран</MenuItem>
                {
                  courier.orders.map(order => <MenuItem key={(order.id+'_'+courier.id)} value={order.id} >№{order.number} {order.address_to.streetAddress}</MenuItem>)
                }
                
               
              </Select>

            </li>

            <li><Button variant="contained" className="action-btn" onClick={courierHandle('take')} >Взять заказ</Button></li>
            <li><Button variant="contained" color="secondary" className="action-btn" onClick={courierHandle('takeOff')} >Получить заказ на руки</Button></li>
            <li><Button variant="contained" color="success" className="action-btn" onClick={courierHandle('orderDelivered')} >Заказ доставлен</Button></li>
            <li><Button variant="contained" color="error" className="action-btn" onClick={courierHandle('cansel')} >Отменить заказ</Button></li>

            
            {/* 
              <li>{ courier.last_name } {courier.first_name}</li>
              <li><div className='courier_targer' ><TargetIcon/></div></li> 
              <li> {courier.show_route ? 'on' : ''} </li>
            */}
          </ul>
        </div>

        <div className='courier-card__body-middle-inner'>
          {/* <div className='courier-card__body-middle'></div> */}
        </div>
      </div>
      <div className='courier-card__bottom'>
          {/* тут будет назначенный курьер */}

            <div>
              {/* <button className='add-courier-button' onClick={setState_addCourier}>Назначить курьера</button> */}
             
            </div>
      </div>

    </div>
  );
};

export default CourierCardTest;
