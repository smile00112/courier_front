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
import {getPrettyTime, getPrettyDistance} from '../../../../utils/mapValuesFormat';


// import ListSubheader from '@mui/material/ListSubheader';

type CourierListProps = {
  courier: CourierType;
  scm: boolean,
  scm_order_id: number,
  targerCourier: (courier_id: number, status: boolean) => void;
};
type targerCourierHandle = (courier_id: number, status: boolean) => (e: React.MouseEvent) => void;
type declOfNumProps = (n: number,   titles: String[]) => String;

// const comfortIconsMap: { [x: string]: JSX.Element } = {
//   hasWifi: <WifiIcon />,
//   hasConditioner: <AcUnitIcon />,
//   hasWorkSpace: <ComputerIcon />,
// };


const CourierCard: React.FC<CourierListProps> = ({ courier, scm, scm_order_id, targerCourier } ) => {
  
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
    return getPrettyTime( courier.routeTime );
  }

  const get_dots_color = () => {
    return ( (!isOnline) ? 'grey': 'white' );
  }

  const [elActive, setElActive] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const handleClick = () => {
    setOpen(!open);
  };


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
            <li>{ courier.fio }</li>
            <li><div className='courier_targer' ><TargetIcon/></div></li> 
            {/* <li> {courier.show_route ? 'on' : ''} </li>            */}
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

export default CourierCard;
