import React, { useState, useCallback, useEffect } from 'react'
import { YMaps, Map, Placemark } from 'react-yandex-maps'
// import { getCouriers } from '../../../store/couriers';
// import { useSelector } from 'react-redux';

const MapComponent = (props) => {
 // const dataHandler = useAppSelector((state) => state.consultationPage.data)
//if(DEBUG) console.warn(props);
  const {orders, couriers, routes, updateRoute} = props;
  const DEBUG = false;
  const [ymaps, setYmaps] = useState();
  const [map, setMap] = useState(null);
  const [routesObjs, setRoutesObjs] = React.useState([]);


  // const loadMap = (ymaps) => {
  //   if(DEBUG) console.log(ymaps.map)
  //   setYmaps(ymaps)
  // }
  const createMark = (ymaps, address) => {
    if (!ymaps) {
      return
    }
    const template = ymaps.templateLayoutFactory.createClass(
      `<div class="aaa">` +
        `<span class="aaa" />` +
        `<p class="ccc">dddd</p>` +
        '</div>',
    )

    return template
  }

  const makeMapRoute = (data, ymaps) => {
    if(DEBUG) console.log('makeMapRoute', data);

      const transport_routMode = {walker: 'pedestrian', car: 'auto', bicycle: 'bicycle' }
      const routingMode = !!transport_routMode[data.transport] ? transport_routMode[data.transport] : 'pedestrian';
      // console.log(
      //   'makeMapRoute_params',
      //   {
      //     referencePoints: data.points,
      //     params: {
      //       results: 1,
      //       routingMode: routingMode,//"pedestrian",
      //         //boundsAutoApply: true,
      //     }
      // }
      // )
      const multiRoute = new ymaps.multiRouter.MultiRoute( 
          {
              referencePoints: data.points,
              params: {
                results: 1,
                routingMode: routingMode,//"pedestrian",
                  //boundsAutoApply: true,
              }
          },
          {
              wayPointStartVisible:false,
              routeStrokeWidth: 2,
              routeStrokeColor: "#000088",
              routeActiveStrokeWidth: 6,
              routeActiveStrokeColor: "#32343d",
              routeActivePedestrianSegmentStrokeStyle: "solid",
          }
      );

      return multiRoute;
  };

  const addRouteToMap = (route, map) => {
      //if(DEBUG) console.warn('_____', map)
      map.geoObjects.add(route);
  }

  const deleteRouteFromMap = (route, map) => {
      //if(DEBUG) console.warn('_____', map)
      map.geoObjects.remove(route);
  }
  const routesToMap = (routes, routesObjs, map) => {

    routes.map( route => {
      
      if(!route.route ) return false;
      
      const courierIndex = routesObjs.findIndex(r_obj => route.courier_id === r_obj.courier_id);
      const route_obj = routesObjs[courierIndex].route_obj;
      
      //if(DEBUG) console.log('__route', route)
      if(route.status) {
        //@ts-ignore
          addRouteToMap( route_obj, map );
      } else{
        if(typeof route.route !== 'undefined')
          deleteRouteFromMap( route_obj, map );
      }
      return route 
    })
  }
  const check_courier_on_routes = (courier_id, routes) => { 
    if(!courier_id || typeof routes == 'undefined') return false;
    //console.warn('check_courier_on_routes', courier_id, routes);
    const courierIndex = routes.findIndex(route => route.courier_id === courier_id);
    return (courierIndex !== -1 && routes[courierIndex].status === true);
  };

  /* точки для построения маршрута */
  const makeRoutePoints = (_routes, couriers) => {

    // couriers.map( courier => {
    //       let points = [ courier.coordinates ];
    //       if(typeof courier.orders !== 'undefined' && courier.orders.length > 0){
    //         points = [...points, courier.orders.map( order => order.coordinates_to )];
    //       }
    //       // const routeIndex = _routes.findIndex( route => courier.id === route.courier_id );
    //       // console.warn(_routes[routeIndex]);
    //       // _routes[routeIndex].points = [12, 34]; 
    //   })
     
      // updateRoute(
      //   1, 
      //   _routes[1].courier_id, 
      //   _routes[1].status, 
      //   _routes[1].route, 
      //   [1,2,3,4] 
      // )
     // _routes.map( _route => { _route.points = [1,2,3]; return _route; } );
    return _routes;
  }
  
    useEffect(() => {
      if(DEBUG) console.log('___useEffect___', routesObjs)
      if (map && ymaps) {
          //if(DEBUG) console.warn("ymaps", ymaps, "map", map);
          //let _routes = [...routes];
          // if(DEBUG) console.log('____routes___', _routes);

          // _routes = makeRoutePoints(_routes, couriers);
          
          // if(DEBUG) console.log('____routes 222___', _routes);

          routes.map( (route, index) => {
            if(route.status === true){
              if(!route.route){
                let route_obj = makeMapRoute(route, ymaps);
                //@ts-ignore
                routesObjs.push({courier_id: route.courier_id, route_obj})
                updateRoute(
                  index, 
                  route.courier_id, 
                  route.status, 
                  true, 
                  route.points 
                )
              }
            }

          });
          
        routesToMap(routes, routesObjs, map)

          // const _routes = routes;

          //   couriers.map( courier => {
          //     if(DEBUG) console.log('test' , (courier.show_route ? 'on' : 'off'));
          //     if(courier.show_route){
          //         let points = [ courier.coordinates ];
          //         if(typeof courier.orders !== 'undefined' && courier.orders.length > 0){
          //             courier.orders.map( order => { if(order.coordinates_to) points.push(order.coordinates_to); return order});
          //         }
          //         //@ts-ignore
          //         if(typeof _routes[courier.id] == 'undefined'){
          //           //@ts-ignore
          //           _routes[courier.id] = {transport: courier.transport, status: courier.show_route, route: makeMapRoute({points: points, tranport: courier.tranport},ymaps)};

          //             if(DEBUG) console.log('ADD route',courier.id);
          //         }else{
          //           //@ts-ignore
          //           _routes[courier.id].status = courier.show_route;
          //         }
          //         if(DEBUG) console.log('Routes',_routes)

          //     }else{
          //         //@ts-ignore
          //         if(typeof _routes[courier.id] !== 'undefined'){
          //             if(DEBUG) console.log('Delete route',courier.id);
          //             //@ts-ignore
          //             _routes[courier.id].status = courier.show_route;
          //            // removeRouteFromMap(_routes[courier.id])
          //         }
          //     }
          // });
          //@ts-ignore
         // setRoutes(_routes);
          //@ts-ignore
        //  routesToMap(_routes, map)


          //@ts-ignore
          // const multiRoute1 = new ymaps.multiRouter.MultiRoute({
          //     referencePoints: [
          //         "Москва, Колодезный переулок д.2а",
          //         "метро Сокольники",
          //     ],
          //     params: {
          //         results: 2,
          //         routingMode: 'pedestrian'
          //     }
          // }, {
          //     wayPointStartVisible:false,
          //     routeStrokeWidth: 2,
          //     routeStrokeColor: "#000088",
          //     routeActiveStrokeWidth: 6,
          //     routeActiveStrokeColor: "#32343d",
          //     routeActivePedestrianSegmentStrokeStyle: "solid",
          // });
          // //@ts-ignore
          // const multiRoute2 = new ymaps.multiRouter.MultiRoute({
          //     referencePoints: [
          //         "Москва, Колодезный переулок д.2а",
          //         "Преображенская площадь",
          //     ],
          //     wayPointStart: {
          //         opacity: 0
          //     },
          //     params: {
          //         results: 2,
          //         routingMode: 'pedestrian'
          //     }
          // }, {});
          // //@ts-ignore
          // map.geoObjects.add(multiRoute1);
          // //@ts-ignore
          // map.geoObjects.add(multiRoute2);
      }
  }, [map, ymaps, couriers, routes]);//


  const loadMap = useCallback((ymaps: any) => {
    setYmaps(ymaps);
    //@ts-ignore
    //setRoutes([]);
  }, [setYmaps]);


  return (
    <YMaps
      query={{ apikey: '9ae79ec7-cf60-4393-b5bb-a132baf09666' }} 
    >
      <Map
        onLoad={loadMap}
        className={`map-contener`}
        defaultState={{
          center: [55.739625, 37.5412],
          zoom: 12,
          multiRouter: ['MultiRoute']
        }}
        height="100%"
        width="800px"
        modules={[
          "multiRouter.MultiRoute", 
          "layout.ImageWithContent", 
          'geoObject.addon.balloon', 
          'geoObject.addon.hint',
          'templateLayoutFactory'
        ]}
        instanceRef={(ref: any) => setMap(ref)}
      > 
      {
        /* Выводим непринятые заказы и заказы курьеров с активным маршрутом */
        orders.map(order => {
          //if()
          let placemark_color = 'islands#darkGreenStretchyIcon';
          const show_courier_route = check_courier_on_routes(order.courier_id, routes) ; 
          const order_has_courier = order.courier_id !== null ;
          if( show_courier_route ) placemark_color = 'islands#blueStretchyIcon';
          /* Если заказ взят, но роут курьера не активен, скрываем его на карте */
          if(order_has_courier && !show_courier_route) return false;

          let coord = order.coordinates_to ? order.coordinates_to : ''; //.replace(' ,', ',').split(',')
          let properties ={
              balloonContentHeader : ( typeof order.client.name !== 'undefined' ) ? order.client.name : '???',
              balloonContentBody: order.address_to.streetAddress,
              iconContent: `№${order.number}`,
              balloonContentFooter : `осталось ${order.deliveryTimer}`
          };
          let options = {
              preset: placemark_color,
              // iconColor: ( order.current ? 'red' : '#3b5998' ) 
              // iconColor: '#3b5998'
          };
          // if(DEBUG) console.log('coord', coord);
          if(coord)
              return (
                  <Placemark key={'map_order_'+order._id} geometry={coord} properties={properties} options={options}/>
              )
      })
      }


        {
            couriers.map( courier => {
                //if(DEBUG) console.log('_couriersIcons', couriersIcons);
                //if(DEBUG) console.log('_couriersCoordinates', courier.coordinates);

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
  )
}

export default MapComponent;
