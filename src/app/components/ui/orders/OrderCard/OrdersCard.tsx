import AcUnitIcon from '@mui/icons-material/AcUnit';
import ComputerIcon from '@mui/icons-material/Computer';
import WifiIcon from '@mui/icons-material/Wifi';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
//import { getReviewsByOrderId } from '../../../../store/reviews';
import declOfNum from '../../../../utils/declOfNum';
//import Badge from '../../../common/Badge';
import Divider from '../../../common/Divider';
import {DotsIcon, LocationIcon, TimeIcon, PriceIcon} from '../../../../components/common/Icon/Icon'
//import ImageSlider from '../../../common/ImageSlider';
//import Rating from '../../../common/Rating';
import { OrderType } from '../../../../types/types';

import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';

// import ListSubheader from '@mui/material/ListSubheader';

const comfortIconsMap: { [x: string]: JSX.Element } = {
  hasWifi: <WifiIcon />,
  hasConditioner: <AcUnitIcon />,
  hasWorkSpace: <ComputerIcon />,
};



const OrderCard: React.FC<OrderType> = ({ _id, number, price, delivery_price, address_to, order_delivery_start_at, order_close_at, order_close_time, deliveryTimer, client, products, productsTotal, courier }) => {
 // const reviews = useSelector(getReviewsByOrderId(_id));
 // const countReviews = reviews ? reviews.length : 0;
 // const rating = countReviews > 0 ? reviews.reduce((acc, cur) => acc + cur.rating, 0) : 0;
 const [open, setOpen] = React.useState(true);
 const handleClick = () => {
   setOpen(!open);
 };
 const setState_addCourier = () => {
    
 };


  return (
    <div className='order-card'>

      <div className='order-card__top'>
        <div className="order-card__order-number">№{number}</div> 
        <div className="order-card__context-menu">
          <DotsIcon></DotsIcon>
        </div>
      </div>
      <div className='order-card__body'>
        <div className='order-card__body-top'>
          <ul className="order-card__info-list">
            <li><TimeIcon></TimeIcon>{ deliveryTimer }</li>
            <li><LocationIcon></LocationIcon>...</li>
            <li><PriceIcon></PriceIcon>{delivery_price}₽</li>
          </ul>
        </div>
        <div className='order-card__body-middle-inner'>
          <div className='order-card__body-middle'>
            <div className="order-card__body-middle__address">{address_to.streetAddress}</div>
            <div className="order-card__body-middle__client-name">{client.name}</div>
            <div className="order-card__body-middle__address-data">
              <ul className="">
                <li><span>Подъезд:</span><div>{address_to.entrance}</div></li>
                <li><span>Этаж:</span><div>{address_to.floor}</div></li>
                <li><span>Кв:</span><div>{address_to.flat}</div></li>
              </ul>  
              <div className="order-card__body-middle__products">
                <List
                  sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                >
                <ListItemButton onClick={handleClick}>
                  <ListItemText classes={{ primary: "list-header"}}><div>{products.length} товар(а)</div><div>{productsTotal}₽</div></ListItemText>
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={!open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {
                      products.map(product => (
                        <ListItemButton key={product.id} sx={{ pl: 4 }} >
                              <div className='product-name'>{product.name}</div>
                              <div className='product-quiantity'>{product.quiantity} шт</div>
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

            <div>
              {/* <button className='add-courier-button' onClick={setState_addCourier}>Назначить курьера</button> */}
              
              <Button className='add-courier-button' onClick={setState_addCourier}> Назначить курьера </Button>
            </div>
      </div>
      {/* {comforts && (
        <Badge className='badge'>
          {comforts.map(comfort => (
            <div key={comfort}>{comfortIconsMap[comfort]}</div>
          ))}
        </Badge>
      )} */}
      {/* 
        <ImageSlider className='order-card__gallery'>
          {images &&
            images.map(img => (
              <div className='order-card__gallery-item' key={img}>
                <img className='order-card__gallery-item--img' src={img} alt='ordersPhoto' />
              </div>
          ))}
        </ImageSlider> */
      }
      <Link to={`/orders/${_id}`} className='order-card__description'>
        {/* <div className='order-card__description-row'>
          <h3 className='order-card__title'>
            № <span className='order-card__title--big'>{number}</span>
          {type === 'Люкс' && <span className='order-card__type'>{type}</span>} 
          </h3>
          <div className='order-card__rentPerDay'>
            <span>{price}&#8381;</span> в сутки
          </div>
        </div> */}
        <Divider />
        <div className='order-card__description-row'>
          {/* <div className='order-card__rating'>
            <Rating name='read-only' value={rating} totalCount={countReviews} readOnly />
          </div> */}
          {/* <div className='order-card__reviews'>
            <span className='order-card__reviews-count'>{`${countReviews} ${declOfNum(countReviews, [
              'Отзыв',
              'Отзыва',
              'Отзывов',
            ])}`}</span>
          </div> */}
        </div>
      </Link>
    </div>
  );
};

export default OrderCard;
