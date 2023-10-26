const getCourierRouteObj = (courier, active_courier = false) => {
    let points = [courier.coordinates];
    let orders_points = [];
    if(typeof courier.orders !== 'undefined' && courier.orders.length > 0){
        //courier.orders = courier.orders.sort((a, b) => a.created_at - b.created_at);
        //список координат заказов
        points= [...points, ...courier.orders.map( order => order.coordinates_to )];
        //список заказов с координатами
        orders_points = [...orders_points, ...courier.orders.map( order => ({ coordinates: order.coordinates_to, order: order.id }) ) ]
    }

    //приводим средство передвижения курьера в нужный для маршрута вид
    const transport_routMode = {walker: 'pedestrian', car: 'auto', bicycle: 'bicycle' }
    const transport = !!transport_routMode[courier.transport] ? transport_routMode[courier.transport] : 'pedestrian';

    return {courier_id: courier.id, transport: transport, status: active_courier, route: false, points: points, orders_points: orders_points}
}


export default getCourierRouteObj;