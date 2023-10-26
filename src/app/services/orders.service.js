//import { BookingType } from '../types/types';
import httpService from './http.service';

const orderEndPoint = 'operator/orders';

const bookingService = {
  getAll: async () => {
    const { data } = await httpService.get(orderEndPoint);
    return data;
  },
  create: async (payload) => {
    const { data } = await httpService.post(orderEndPoint, payload);
    return data;
  },
  remove: async (id) => {
    await httpService.delete(orderEndPoint + '/' + id);
    return id;
  },
  getById: async (id) => {

    console.error('id', id);
    const { data } = await httpService.get(orderEndPoint + '/' + id);
    return data;
  },
  getUserOrders: async (userId) => {
    const { data } = await httpService.get(orderEndPoint, {
      params: {
        orderBy: 'userId',
        equalTo: `${userId}`,
      },
    });
    return data;
  },
  update: async (payload) => {
    const { data } = await httpService.post(orderEndPoint + '/' + payload.id , payload);
    return data;
  },
  orderToCourier: async (payload) => {
    console.log('orderToCourier_service', payload)
    const { data } = await httpService.get(orderEndPoint + '/' + payload.order_id + '/to_courier/' + payload.courier_id, payload);
    return data;
  },
  // getRoomBookings: async (roomId) => {
  //   const { data } = await httpService.get(orderEndPoint, {
  //     params: {
  //       orderBy: 'roomId',
  //       equalTo: `${roomId}`,
  //     },
  //   });
  //   return data;
  // },
};

export default bookingService;
