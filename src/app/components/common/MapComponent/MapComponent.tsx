import React, {useState, useCallback, useEffect} from 'react'
import {YMaps, Map, Placemark} from 'react-yandex-maps'
import {findIndex} from "lodash";
// import { getCouriers } from '../../../store/couriers';
// import { useSelector } from 'react-redux';

const MapComponent = (props) => {
    // const dataHandler = useAppSelector((state) => state.consultationPage.data)
    //if(DEBUG) console.warn(props);
    const {
        orders,
        couriers,
        activeCourier,
        activeOrder,
        routes,
        updateRoute,
        orderRouteTimeUpdate,
        orderRouteDistanceUpdate,
        courierDeliveryDistanceUpdate,
        courierDeliveryTimeUpdate
    } = props;

    const DEBUG = false;
    const [ymaps, setYmaps] = useState();
    const [map, setMap] = useState(null);
    const [routesObjs, setRoutesObjs] = React.useState([]);
    const [zoom, setZoom] = useState(9);
    const [mapCenter, setCenter] = useState([55.751574, 37.573856]);

    if (DEBUG) console.log('init map activeCourier', activeCourier);

    const makeMapRoute = (data, ymaps) => {

        let route_coordinates = [data.points[0], ...data.orders_points.map(function (obj) {
            return obj.coordinates;
        })];

        if (DEBUG) console.log('makeMapRoute', data);

        const multiRoute = new ymaps.multiRouter.MultiRoute(
            {
                referencePoints: route_coordinates,
                params: {
                    results: 1,
                    routingMode: data.transport,//"pedestrian",
                    reverseGeocoding: true,
                    // Автоматически устанавливать границы карты так,
                    // чтобы маршрут был виден целиком.
                    //boundsAutoApply: true,

                }
            },
            {
                wayPointStartVisible: false,
                //скрыть начальные и конечные точки маршрута
                wayPointVisible: false,
                routeStrokeWidth: 2,
                routeStrokeColor: "#000088",
                routeActiveStrokeWidth: 6,
                routeActiveStrokeColor: "#32343d",
                routeActivePedestrianSegmentStrokeStyle: "solid",
                // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
                boundsAutoApply: true
            }
        );

        return multiRoute;
    };

    const addRouteToMap = (route_data, multiRouteObj, map) => {

        multiRouteObj.model.events.add('requestsuccess', function () {
            // Получение ссылки на активный маршрут.
            // В примере используется автомобильный маршрут,
            // поэтому метод getActiveRoute() вернет объект <u>multiRouter.driving.Route</u>.
            var activeRoute = multiRouteObj.getActiveRoute();
            // Вывод информации о маршруте.
            if (DEBUG) console.warn("route_data: ", route_data);
            if (DEBUG) console.log("Длина: " + activeRoute.properties.get("distance").text);
            if (DEBUG) console.log("Время прохождения: " + activeRoute.properties.get("duration").text);

            //курьеру отсылаем общие данные по времени и дистанции
            if (!!route_data.courier_id) {
                courierDeliveryDistanceUpdate(route_data.courier_id, activeRoute.properties.get("distance").value);
                courierDeliveryTimeUpdate(route_data.courier_id, activeRoute.properties.get("duration").value);
            }

            //console.log("getPaths: ", activeRoute.getPaths());
            //var wayPoints = multiRouteObj.getWayPoints();
            // wayPoints.get(wayPoints.getLength() - 1).options.set({
            //     iconLayout: 'default#image',
            //     iconImageHref: 'ogo.png'
            // });

            multiRouteObj.getRoutes().each(function (route) {
                if (DEBUG) console.log('route data:', route.properties.getAll());

                /**
                 * Возвращает массив путей маршрута.
                 * @see https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.masstransit.Route-docpage/
                 */
                var distance = 0;
                var time = 0;

                route.getPaths().each(function (path) {
                    let index = path.properties.get('index');

                    if (DEBUG) console.log('order_id:', index, route_data.orders_points[index].order);

                    //берём id заказов и рассылаем им данные по сегментам маршрута
                    let segment_order_id = route_data.orders_points[index].order;
                    if (!!segment_order_id) {
                        distance += path.properties.getAll().distance.value;
                        time += path.properties.getAll().duration.value;

                        // orderRouteTimeUpdate(  segment_order_id, Math.round( time / 60 ) + ' мин');
                        // orderRouteDistanceUpdate( segment_order_id,  ( Math.round( (distance / 1000) * 100) / 100 ) + ' км');

                        orderRouteTimeUpdate(segment_order_id, time);
                        orderRouteDistanceUpdate(segment_order_id, distance);
                    }


                    if (DEBUG) console.log('path data:', path.properties.getAll());
                    /**
                     * Возвращает массив сегментов пути.
                     * @see https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.masstransit.Path-docpage/
                     */
                    /*
                    path.getSegments().each(function (segment) {
                        console.log('segment data:', segment.properties.getAll());
                    });
                    */


                    //красим сегменты маршрута

                    path.getSegments().each(function (segment) {
                        switch (index) {
                            case 0:
                                segment.options.set({strokeColor: '#00FF00'});

                                break;
                            case 1:
                                segment.options.set({strokeColor: '#0000FF'});

                                break;
                            default:
                                segment.options.set({strokeColor: '#FF0000'});
                        }
                    });
                });


            });
            // Для автомобильных маршрутов можно вывести
            // информацию о перекрытых участках.
            if (activeRoute.properties.get("blocked")) {
                if (DEBUG) console.log("На маршруте имеются участки с перекрытыми дорогами.");
            }
        });

        // multiRouteObj.events.add("boundschange", function() {
        //     map.setBounds(multiRouteObj.getBounds(), {
        //         checkZoomRange: true
        //     });
        // });

        map.geoObjects.add(multiRouteObj);
        //
        // if(DEBUG)  console.log('111 __ active_route_obj', multiRouteObj );
        // if(DEBUG)  console.log('222 __ active_route_obj', multiRouteObj.getActiveRoute().properties.get("distance")  );

    }

    const deleteRouteFromMap = (route, map) => {
        //if(DEBUG) console.warn('_____', map)
        map.geoObjects.remove(route);
    }

    const routesToMap = (routes, routesObjs, map) => {

        routes.map(_route => {

            if (!_route.route) return false;

            const courierIndex = routesObjs.findIndex(r_obj => _route.courier_id === r_obj.courier_id);
            const route_ymap_obj = routesObjs[courierIndex].route_obj;

            //if(DEBUG) console.log('__route', route)
            if (/*route.status &&*/ (_route.courier_id === activeCourier)) {
                //@ts-ignore
                addRouteToMap(_route, route_ymap_obj, map);
            } else {
                if (typeof _route.route !== 'undefined')
                    deleteRouteFromMap(route_ymap_obj, map);
            }
            return _route
        })
    }

    const check_courier_on_routes = (courier_id, routes) => {
        if (!courier_id || typeof routes == 'undefined') return false;
        //console.warn('check_courier_on_routes', courier_id, routes);
        const courierIndex = routes.findIndex(route => route.courier_id === courier_id);
        return (courierIndex !== -1 && routes[courierIndex].status === true);
    };

    /* точки для построения маршрута */
    useEffect(() => {

        if (DEBUG) console.log('___useEffect MAP r___', routes)
        if (DEBUG) console.log('___useEffect MAP ro___', routesObjs)
        if (map && ymaps) {

            routes.map((route, index) => {
                if (route.status === true) {
                    if (!route.route) {
                        if (DEBUG) console.warn('makeMapRoute', route);
                        let route_obj = makeMapRoute(route, ymaps);
                        if (DEBUG) console.warn('makeMapRoute __ route_obj', route_obj);

                        //if(DEBUG)  console.warn('Длина __ route_obj', route_obj.getActiveRoute().properties.get("distance").text );
                        //if(DEBUG)  console.warn('Время прохождения __ route_obj', route_obj.getActiveRoute().properties.get("duration").text );

                        //проверяем на наличие имеющихся маршрутов курьера и чистим их
                        //@ts-ignore
                        let search_index = routesObjs.findIndex(routeObj => routeObj.courier_id === route.courier_id);
                        if (search_index != -1) {
                            //@ts-ignore
                            deleteRouteFromMap(routesObjs[search_index].route_obj, map);
                            //@ts-ignore
                            routesObjs[search_index] = {courier_id: route.courier_id, route_obj};
                            //setRoutesObjs(routesObjs);
                        } else {
                            //@ts-ignore
                            routesObjs.push({courier_id: route.courier_id, route_obj})
                        }
                        if (DEBUG) console.warn('routesObjs LIST after clear', routesObjs);

                        //сохраняем маршрут


                        if (DEBUG) console.warn('routesObjs LIST', routesObjs);

                        updateRoute(
                            index,
                            route.courier_id,
                            route.status,
                            true,
                            route.points,
                            route.orders_points
                        )
                    }
                }

            });


            routesToMap(routes, routesObjs, map)


            if (DEBUG) console.log('activeOrder=' + activeOrder);

            setCenter(
                couriers.find(courier => courier.id === activeCourier)
                    ? couriers.find(courier => courier.id === activeCourier).coordinates :

                    (
                        activeOrder ? orders.find(order => order.id === activeOrder).coordinates_to : couriers[0].coordinates
                    )
            )
        }
    }, [map, ymaps, couriers, routes]);//


    const loadMap = useCallback((ymaps: any) => {
        setYmaps(ymaps);
    }, [setYmaps]);
    const clickOnMap = (event) => {
        console.log('pointCoordinates:', event.get('coords'));
    }

    return (
        <div>
            <YMaps
                query={{apikey: '9ae79ec7-cf60-4393-b5bb-a132baf09666'}}
            >
                <Map
                    onLoad={loadMap}
                    onClick={clickOnMap}
                    // instanceRef={ (inst: any) => inst.events.add('click', function(){
                    //     alert();
                    // })}
                    className={`map-contener`}
                    state={{center: mapCenter, zoom}}
                    defaultState={{
                        center: mapCenter,
                        zoom: 16,
                        multiRouter: ['MultiRoute']
                    }}
                    height="100%"
                    width="800px"
                    modules={
                        [
                            "multiRouter.MultiRoute",
                            "layout.ImageWithContent",
                            'geoObject.addon.balloon',
                            'geoObject.addon.hint',
                            'templateLayoutFactory'
                        ]
                    }
                    instanceRef={(ref: any) => setMap(ref)}
                >
                    {
                        /* Выводим непринятые заказы и заказы курьеров с активным маршрутом */
                        orders.map(order => {

                            let placemark_color = 'islands#darkGreenStretchyIcon';
                            const show_courier_route = check_courier_on_routes(order.courier_id, routes);
                            const order_has_courier = order.courier_id > 0;
                            const is_active = order.id == activeOrder;

                            if (show_courier_route) placemark_color = 'islands#blueStretchyIcon';

                            /* Если заказ взят, но роут курьера не активен, скрываем его на карте */
                            if (order_has_courier && !show_courier_route && !is_active) {
                                return false;
                            }

                            /* Если заказ не принадлежит активному курьеру */
                            if (activeCourier && activeCourier !== order.courier_id) return false;

                            let coord = order.coordinates_to ? order.coordinates_to : ''; //.replace(' ,', ',').split(',')
                            let properties = {
                                balloonContentHeader: (typeof order.client.name !== 'undefined') ? order.client.name : '???',
                                balloonContentBody: order.address_to.streetAddress,
                                iconContent: `№${order.number}  `, //(${order.id}) (${order.courier_id})
                                balloonContentFooter: `⌚ ${order.deliveryTimerPretty}`
                            };
                            let options = {
                                preset: placemark_color,
                                // iconColor: ( order.current ? 'red' : '#3b5998' )
                                // iconColor: '#3b5998'
                            };

                            if (coord && order.status !== 4)
                                return (
                                    <Placemark key={'map_order_' + order._id} geometry={coord} properties={properties}
                                               options={options}/>
                                )
                        })
                    }
                    {
                        couriers.map(courier => {
                            //let coord = ( courier.coordinates || courier.coordinates !== null ) ? courier.coordinates.replace(' ,', ',').split(',') : '';
                            let coord = (courier.coordinates || courier.coordinates !== null) ? courier.coordinates : '';
                            let properties = {
                                balloonContentHeader: courier.first_name + ' ' + courier.last_name,
                                //balloonContentBody: courier.address_to.streetAddress,
                                iconContent: `${courier.last_name} ${courier.first_name} ${(courier.show_route ? 'on' : 'off')}`,
                                balloonContentFooter: `рейтинг ${courier.rating}`
                                //hintContent: 'Placemark with a rectangular HTML layout'
                            };
                            //var squareLayout = map.templateLayoutFactory.createClass('<div class="placemark_layout_container"><div class="square_layout">$</div></div>');
                            let options = {
                                iconLayout: 'default#image',
                                iconImageHref: courier.avatar,
                                iconImageSize: [42, 42],
                                iconImageOffset: [0, 0]
                                //preset: 'islands#redStretchyIcon',
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
                            if (coord && (activeCourier === courier.id || activeCourier === null))
                                return (
                                    <Placemark key={'map_courier_' + courier.id} geometry={coord}
                                               properties={properties} options={options}/>
                                )
                        })
                    }
                </Map>
            </YMaps>
            <button>Click</button>
        </div>
    )
}

export default MapComponent;
