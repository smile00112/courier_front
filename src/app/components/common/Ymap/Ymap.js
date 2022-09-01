import {React, useRef, useState} from 'react';
import { YMaps, Map, Placemark } from "react-yandex-maps";
import { useSelector } from 'react-redux';

import { getOrders, getOrdersLoadingStatus, enableModeSelectCourier, disableModeSelectCourier, orderDeliveryTimerUpdate, getSelectCourierModeStatus, getSelectCourierModeOrderId } from '../../../store/orders';
import { getCouriers } from '../../../store/couriers';

const Ymap = () => {

    
    /* Временно !!! */
    var _routes = []
    //alert(this.props.test)
    const orders = useSelector(getOrders()); 
    const couriers = useSelector(getCouriers());
    var couriersIcons = [];

    var _ymaps =  useRef(null);
    const mapState = { center: [55.739625, 37.5412], zoom: 12, controls: [] };
    const map = useRef(null);

    const routeRequest = () => {
        console.log('ymaps__2' ,_ymaps);
    }

    const createTemplateLayoutFactory = ymaps => {
        _ymaps = ymaps;
        //console.log('ymaps__1' ,ymaps);
        if (ymaps) {
            couriersIcons = couriers.map( courier => {
                //console.log('ymaps__2' ,ymaps);
                return { 
                    courier_id: courier.id,
                    icon: ymaps.templateLayoutFactory.createClass('<div class="placemark_layout_container"><div class="square_layout">$</div></div>'),
                }
           });
        }
    };

    const [ymaps, setYmaps] = useState()
    const [routes, setRoutes] = useState()
    
    const loadMap = (ymaps) => {
      console.log('==========',ymaps)
      setYmaps(ymaps)
    }

    const makeMapRoute = (pointers) => {
        //const pointС = orders[2].coordinates_to ? orders[2].coordinates_to.replace(' ,', ',').split(',') : '';
        const multiRoute = new ymaps.multiRouter.MultiRoute(
            {
                referencePoints: pointers,
                params: {
                    // routingMode: "pedestrian",
                    //boundsAutoApply: true,
                }
            },
            {
               // boundsAutoApply: true
            }
        );

        //map.current.geoObjects.add(multiRoute);
        return multiRoute;
    };

    const addRouteToMap = (route) => {
        map.current.geoObjects.add(route);
    }

    const removeRouteFromMap = (route) => {
        map.geoObjects.remove(route);
    }   

    const test = (couriers) => {
        
        couriers.map( courier => {
            //console.log('test' , (courier.show_route ? 'on' : 'off'));
            if(courier.show_route){
                let points = [ courier.coordinates ];
                if(typeof courier.orders !== 'undefined' && courier.orders.length > 0){
                    courier.orders.map( order => { if(order.coordinates_to) points.push(order.coordinates_to); return order});
                }
                
                console.log('points',points)
                if(typeof _routes[courier.id] == 'undefined'){
                    _routes[courier.id] = makeMapRoute(points);
                    addRouteToMap(_routes[courier.id]);
                    console.log('ADD route',courier.id);
                }
                console.log('Routes',_routes)

            }else{
                
                if(typeof _routes[courier.id] !== 'undefined'){
                    console.log('Delete route',courier.id);

                    removeRouteFromMap(_routes[courier.id])

                }
            }

            
        });
       // setRoutes(_routes)
    }
    test(couriers);

  const addRouteTest = () => {
    // console.log('addRoute ymaps', _ymaps)
    // console.log('addRoute ymaps 2', ymaps)
    // return false;

    const courierA = [55.732268, 37.619982];
    const pointA = [55.734588, 37.619796];
    const pointB = [55.707952, 37.585857];
    //const pointС = orders[2].coordinates_to ? orders[2].coordinates_to.replace(' ,', ',').split(',') : '';

    const multiRoute = new ymaps.multiRouter.MultiRoute(
      {
        referencePoints: [courierA, pointA, pointB],
        params: {
         // routingMode: "pedestrian",
          boundsAutoApply: true,
        }
      },
      {
        boundsAutoApply: true
      }
    );

    map.current.geoObjects.add(multiRoute);
  };


    const removeRoute = (route) => {
        if (map && route) {
            map.geoObjects.remove(route);
        }
    };


    return (
        <div className='map-contener'> 
            {/* <button onClick={addRouteTest}>Add route</button> */}
            {/* <button onClick={removeRoute}>Delete route</button> */}
            <YMaps query={{ apikey: '9ae79ec7-cf60-4393-b5bb-a132baf09666' }} 
                    onApiAvaliable={ymaps => this.handleApiAvaliable(ymaps)}
                    //onLoad={createTemplateLayoutFactory}
                    >
                <Map
                    onLoad={loadMap}
                    state={mapState}
                    //  instanceRef={ref => (this.map = ref)}
                    height="100%"
                    width="800px"

                    modules={[
                        "multiRouter.MultiRoute", 
                        "layout.ImageWithContent", 
                        'geoObject.addon.balloon', 
                        'geoObject.addon.hint',
                        'templateLayoutFactory'
                    ]}


                    instanceRef={map}
                    // onLoad={ymaps_init}
                    //onLoad={createTemplateLayoutFactory}
                    
                >
                {
                    orders.map(order => {
                        let coord = order.coordinates_to ? order.coordinates_to : ''; //.replace(' ,', ',').split(',')
                        let properties ={
                            balloonContentHeader : ( typeof order.client.name !== 'undefined' ) ? order.client.name : '???',
                            balloonContentBody: order.address_to.streetAddress,
                            iconContent: `№${order.number} / ${order.id}`,
                            balloonContentFooter : `осталось ${order.deliveryTimer}`
                        };
                        let options = {
                            preset: 'islands#blueStretchyIcon',
                           // iconColor: ( order.current ? 'red' : '#3b5998' ) 
                           // iconColor: '#3b5998'
                        };
                       // console.log('coord', coord);
                        if(coord)
                            return (
                                <Placemark key={'map_order_'+order._id} geometry={coord} properties={properties} options={options}/>
                            )
                    })
                }

                {
                    couriers.map( courier => {
                        //console.log('_couriersIcons', couriersIcons);
                        //console.log('_couriersCoordinates', courier.coordinates);

                        //let coord = ( courier.coordinates || courier.coordinates !== null ) ? courier.coordinates.replace(' ,', ',').split(',') : '';
                        let coord = ( courier.coordinates || courier.coordinates !== null ) ? courier.coordinates : '';
                        let properties ={
                             balloonContentHeader : courier.first_name + ' ' + courier.last_name,
                             //balloonContentBody: courier.address_to.streetAddress,
                             iconContent: `${courier.last_name} ${courier.first_name} ${(courier.show_route ? 'on' : 'off')}`,
                             balloonContentFooter : `рейтинг ${courier.rating}`
                            //hintContent: 'Placemark with a rectangular HTML layout'
                        };
                        //var squareLayout = map.templateLayoutFactory.createClass('<div class="placemark_layout_container"><div class="square_layout">$</div></div>');
                        let options = {
                            preset: 'islands#redStretchyIcon',
                            //iconColor: '#ff0101'
                            //iconColor:  '#3b5998'
                          
                          
                            // //balloonContentLayout: couriersIcons[1],
                            // iconLayout: couriersIcons[1],
                            // iconShape: {
                            //     type: 'Rectangle',
                            //     // The rectangle is defined as two points: the upper left and lower right.
                            //     coordinates: [
                            //         [-25, -25], [25, 25]
                            //     ]
                            // }
                        };
                        if(coord)
                            return (
                                <Placemark key={'map_courier_'+courier.id} geometry={coord} properties={properties} options={options}/>
                            )
                    })
                }
                </Map>
            
            </YMaps>

         </div>
    );
};

export default Ymap;