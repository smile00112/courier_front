//import { BookingType } from '../types/types';
import httpService from './http.service';

const couriersEndPoint = 'operator/couriers';

const bookingService = {
  getAll: async () => {
    const { data } = await httpService.get(couriersEndPoint);
    return data;
  },
  create: async (payload) => {
    const { data } = await httpService.post(couriersEndPoint, payload);
    return data;
  },
  
  remove: async (id) => {
    await httpService.delete(couriersEndPoint + '/' + id);
    return id;
  },
  getById: async (id) => {
    const { data } = await httpService.get(couriersEndPoint + '/' + id);
    return data;
  },
  getUserCouriers: async (userId) => {
    const { data } = await httpService.get(couriersEndPoint, {
      params: {
        orderBy: 'userId',
        equalTo: `${userId}`,
      },
    });
    return data;
  },
  updateField: async (payload) => {
    const { data } = await httpService.post(couriersEndPoint + '/' + 'edit/'+ payload.courier_id, payload);
    return data;
  },   
  takeOrder: async (payload) => {
    const { data } = await httpService.get('operator/orders/'+payload.order_id+'/courier/'+payload.courier_id+'/take');
    return data;
  },
  takeOffOrder: async (payload) => {
    const { data } = await httpService.get('operator/orders/'+payload.order_id+'/courier/'+payload.courier_id+'/pick_up');
    return data;
  },  
  canselOrder: async (payload) => {
    const { data } = await httpService.get('operator/orders/'+payload.order_id+'/courier/'+payload.courier_id+'/cansel');
    return data;
  },  
  deliveredOrder: async (payload) => {
    const { data } = await httpService.get('operator/orders/'+payload.order_id+'/courier/'+payload.courier_id+'/delivered');
    return data;
  },    
     
  // getRoomBookings: async (roomId) => {
  //   const { data } = await httpService.get(couriersEndPoint, {
  //     params: {
  //       orderBy: 'roomId',
  //       equalTo: `${roomId}`,
  //     },
  //   });
  //   return data;
  // },
};

export default bookingService;
