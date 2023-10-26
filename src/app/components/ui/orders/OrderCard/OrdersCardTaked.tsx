// import AcUnitIcon from '@mui/icons-material/AcUnit';
// import ComputerIcon from '@mui/icons-material/Computer';
//import WifiIcon from '@mui/icons-material/Wifi';
import React from 'react';
import { useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
import declOfNum from '../../../../utils/declOfNum';
import {DotsIcon, LocationIcon, TimeIcon, PriceIcon, DownArrowIcon, WalkerIcon, CarIcon, BicycleIcon} from '../../../../components/common/Icon/Icon'

//import ImageSlider from '../../../common/ImageSlider';
//import Rating from '../../../common/Rating';
import { OrderType } from '../../../../types/types';

import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { getCourierById } from '../../../../store/couriers';
import {getPrettyTime, getPrettyDistance} from '../../../../utils/mapValuesFormat';

type OrderListProps = {
  free: boolean,
  order: OrderType,
  scm: boolean,
  scm_order_id: number,
  scmUpdate: (status: boolean, order_id: number) => void;
};

// const comfortIconsMap: { [x: string]: JSX.Element } = {
//   hasWifi: <WifiIcon />,
//   hasConditioner: <AcUnitIcon />,
//   hasWorkSpace: <ComputerIcon />,
// };



const OrdersCardTaked: React.FC<OrderListProps> = ({ order, scm, scm_order_id, scmUpdate } ) => {

  const orderCourier = useSelector(getCourierById(order.courier_id));
  // const reviews = useSelector(getReviewsByOrderId(_id));
  // const countReviews = reviews ? reviews.length : 0;
  // const rating = countReviews > 0 ? reviews.reduce((acc, cur) => acc + cur.rating, 0) : 0;

  const setCourierModeUpdate = (status: boolean, order_id: number) => (event: React.MouseEvent<unknown>) => {
      scmUpdate(status, order_id)
  };

  const [open, setOpen] = React.useState(true);
  const handleClick = () => {
    setOpen(!open);
  };
  // const setState_addCourier = () => {
  //   useSelector(getReviewsByOrderId(_id));
  // }; 
  const disableState_addCourier = () => {
      
  }; 

  const transportIcon = (courier) => {
    switch (courier.transport) {
      case 'bicycle':
        return <BicycleIcon/>

      case 'car':
        return <CarIcon/>

      case 'walker':
        return <WalkerIcon/>

      default:
        return <WalkerIcon/>
    }
    return <TimeIcon/>;
  };

  const courier_button = (scm && order.id===scm_order_id) 
    ?  
      <Button className='adding-courier-button' onClick={setCourierModeUpdate(false, order.id)}> Выберите курьера  <DownArrowIcon className='rotate90right'></DownArrowIcon></Button> 
    : 
      <Button className='add-courier-button' onClick={setCourierModeUpdate(true, order.id)}> Назначить курьера </Button>

  return (
    <div className='order-card'>

      <div className='order-card__top'>
        <div className="order-card__order-number">№{order.number}</div>
        <div className="order-card__context-menu">
          <DotsIcon color={'gay'}></DotsIcon>
        </div>
      </div>
      <div className='order-card__body'>
        <div className='order-card__body-top'>
          <ul className="order-card__info-list">
            <li className={order.deliveryTimer < 0 ? "" : "timer_out"}><TimeIcon color={'gay'}></TimeIcon>{ order.deliveryTimerPretty }</li>
            <li><LocationIcon color={'gay'}></LocationIcon>{getPrettyDistance( order.routeDistance )}</li>
            <li><PriceIcon color={'gay'}></PriceIcon>{order.delivery_price}₽</li>
          </ul>
        </div>
        <div className='order-card__body-middle-inner'>
          <div className='order-card__body-middle'>
            <div className="order-card__body-middle__address">{order.address_to.streetAddress}</div>
            <div className="order-card__body-middle__client-name">{order.client.name}</div>
            <div className="order-card__body-middle__address-data">
              <ul className="">
                <li><span>Подъезд:</span><div>{order.address_to.entrance}</div></li>
                <li><span>Этаж:</span><div>{order.address_to.floor}</div></li>
                <li><span>Кв:</span><div>{order.address_to.flat}</div></li>
              </ul>  
              <div className="order-card__body-middle__products">
                <List
                  sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                >
                <ListItemButton onClick={handleClick}>
                  <ListItemText classes={{ primary: "list-header"}}><div>{order.products.length} товар(а)</div><div>{order.productsTotal}₽</div></ListItemText>
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={!open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {
                      order.products.map(product => (
                        <ListItemButton key={product.id} sx={{ pl: 4 }} >
                              <div className='product-name'>{product.name}</div>
                              <div className='product-quantity'>{product.quantity} шт</div>
                        </ListItemButton>
                    ))}
                   
                  </List>
                </Collapse>
              </List>
              </div>
            </div>
            <div className='order-card__body-bottom'>
            </div>
          </div>
        </div>
      </div>
      <div className='order-card__bottom'>
        {/* тут будет назначенный курьер */}
        <div className='order-card__bottom__courier_info'>
            <div className='order-card__bottom__courier_info__images'>
              <div><img src={order.courier.avatar} /></div>
              <div className='transport_icon'>{transportIcon(order.courier)}</div>
            </div>
            <div className='order-card__bottom__courier_info__fio_time'>
              <div>{order.courier.fio}</div>
              <div className='time'>
                <div>{orderCourier.orders.length} достав{declOfNum(orderCourier.orders.length, ['ка', 'ки', 'ок'])}</div>
                <div>{getPrettyTime(order.routeTime)}</div>
              </div>
            </div>
            
        </div>
         
         
        {/* <div>{courier_button}</div> */}
          
        
      </div>
    </div>
  );
};

export default OrdersCardTaked;
