import { createAction, createSlice } from '@reduxjs/toolkit';
import couriersService from '../services/couriers.service.js';
//import isOutDated from '../utils/isOutDated.js';
//import { BookingType } from './../types/types';
//import { AppThunk, RootState } from './createStore.ts';
const DEBUG = true;
const couriersSlice = createSlice({
  name: 'couriers',
  initialState: {
    entities: [],
    isLoading: true,
    createBookingLoading: false,
    error: null,
    lastFetch: null,
    mapRoutes: [],
  },
  reducers: {
    couriersRequested: state => {
      state.isLoading = true;
    },
    couriersReceived: (state, action) => {
      state.entities = action.payload;
      state.lastFetch = Date.now();
      state.isLoading = false;
    },
 
    couriersUpdateOne: (state, action) => {
      const courierIndex = state.entities.findIndex(courier => courier._id === action.payload._id);
      state.entities[courierIndex] = action.payload;
      state.isLoading = false;
    },    
    couriersRequestFailed: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    courierCreateRequested: state => {
      state.error = null;
      state.createBookingLoading = true;
    },
    courierCreateRequestedFailed: (state, action) => {
      state.error = action.payload;
      state.createBookingLoading = false;
    },
    courierCreated: (state, action) => {
      state.entities.push(action.payload);
      state.error = null;
      state.createBookingLoading = false;
    },
    courierRemoved: (state, action) => {
      state.entities = state.entities.filter(courier => courier._id !== action.payload);
      state.error = null;
    },
    // couriersSort: (state) => {
    //   if(DEBUG) console.log('=====couriersSortReceived====', sort_keys);
    //   state.entities = state.entities.sort( (a, b) => (( sort_keys[a.status] && sort_keys[b.status] ) && (a.orders.length < b.orders.length) ) );
    // },
    courierSetShowRotes: (state, action) => {
      const status = action.payload.status;
      const courierIndex = state.entities.findIndex(courier => {
        return courier.id === action.payload.courier_id
      });
      /*обновляем только статус*/
      state.mapRoutes[courierIndex] = {...state.mapRoutes[courierIndex], status}
      state.entities[courierIndex].show_route = status;
    },    
    mapRoutesReceived: (state, action) => {
      const map_routes =  action.payload.map( courier => { 
        let points = [courier.coordinates];
        if(typeof courier.orders !== 'undefined' && courier.orders.length > 0){
          points= [...points, ...courier.orders.map( order => order.coordinates_to )];
        }
        return {courier_id: courier.id, transport: courier.transport, status: false, route: false, points: points}
      });
      if(DEBUG) console.warn('mapRoutesReceived', map_routes);
      state.mapRoutes = map_routes;
    },
    /*обновляем полностью*/
    mapRouteReceived: (state, action) => {
      if(DEBUG) console.log('=====mapRouteReceived====', action, state.mapRoutes);
      state.mapRoutes[action.payload.index] = action.payload.data;
    },  

  },
});

const { actions, reducer: couriersReducer } = couriersSlice;

const {
  couriersRequested,
  couriersReceived,
  couriersRequestFailed,
  couriersUpdateOne,
  mapRoutesReceived,
  mapRouteReceived,
  //couriersSort,
  courierRemoved,
  courierCreateRequested,
  courierCreateRequestedFailed,
  courierSetShowRotes,
} = actions;

const removeBookingRequested = createAction('couriers/removeBookingRequested');
const removeBookingRequestedFailed = createAction('couriers/removeBookingRequestedFailed');

/* ф-я сортировки курьеров */
const sort_couriers = (couriers, isLoading) => {
  const sort_keys = {
  online : 0,
  offline: 1,
}
  //console.log('sort_couriers', isLoading, sort_keys, couriers)
  let c = [...couriers]
  return c.sort( (a, b) => ( sort_keys[a.status] - sort_keys[b.status] || a.orders.length - b.orders.length ) );

}

export const loadCouriersList = () => async (dispatch, getState) => {
  dispatch(couriersRequested());
  try {
    const { content } = await couriersService.getAll();

    //сортируем по статусу и количеству заказов
    //content.data.sort( (a, b) => (( sort_keys[a.status] - sort_keys[b.status] ) || (a.orders.length < b.orders.length) ) );
    
    //Создаём параметр show_route (показ маршрута на карте)
    content.data.map(
      courier => {
        courier.show_route = false;
        return courier;
      }
    );
    
    
    if(DEBUG) console.log('content couriers ', content);
    dispatch(mapRoutesReceived(content.data || []));
    dispatch(couriersReceived(content.data || []));
    //dispatch(couriersSort());

    
  } catch (error) {
    dispatch(couriersRequestFailed(error.message));
  }
};


export const reLoadCourier = (payload) => async dispatch => { 
  if(DEBUG) console.log('reLoadCourier payload', payload)
  try {
    const { content } = await couriersService.getById(payload);
    dispatch(couriersUpdateOne(content.data || []));
    //dispatch(couriersSort());
  } catch (error) {
    if(DEBUG) console.log('reLoadCourier error',error);
  }
};


export const updateCourier = (payload) => async dispatch => { 
  console.log('updateCourier payload STOP', payload)
  dispatch(couriersUpdateOne(payload || {}));
  //dispatch(couriersSort());
}

export const updateCourierField = (payload) => async dispatch => { 
  console.log('updateCourierField payload STOP', payload);
  try {
    const { content } = await couriersService.updateField(payload);
    dispatch(couriersUpdateOne(content.data || []));
  } catch (error) {
    if(DEBUG) console.log('updateCourierField error',error);
  }
}

export const courierActions = (payload) => async dispatch => { 
  console.log('courierActions payload', payload)
  switch (payload.action) {
    case "take":// принять заказ
        try {
          const { content } = await couriersService.takeOrder(payload);
          dispatch(couriersUpdateOne(content.data || []));
          //dispatch(couriersSort());
        } catch (error) {
          if(DEBUG) console.log('courierActionsTake error',error);
        }
    break;
  
    case "takeOff": // забрать заказ
        try {
          const { content } = await couriersService.takeOffOrder(payload);
          dispatch(couriersUpdateOne(content.data || []));
         // dispatch(couriersSort());
        } catch (error) {
          if(DEBUG) console.log('courierActionsTake error',error);
        }
    break;

    case "cansel": // отказаться от заказа
        try {
          const { content } = await couriersService.canselOrder(payload);
          dispatch(couriersUpdateOne(content.data || []));
         // dispatch(couriersSort());
        } catch (error) {
          if(DEBUG) console.log('courierActionsTake error',error);
        }
    break;

    case "orderDelivered": // забрать заказ
        try {
          const { content } = await couriersService.deliveredOrder(payload);
          dispatch(couriersUpdateOne(content.data || []));
          //dispatch(couriersSort());
        } catch (error) {
          if(DEBUG) console.log('courierActionsTake error',error);
        }
    break;    
    default:
      break;
  }


  // try {
  //   const { content } = await couriersService.getById(payload);
  //   dispatch(couriersUpdateOne(content.data || []));
  // } catch (error) {
  //   if(DEBUG) console.log('reLoadCourier error',error);
  // }
};

export const updateMapRoute  = (payload) => mapRouteReceived(payload);
export const showCourierRoutes  = (payload) => courierSetShowRotes(payload);
// export const createBooking =
//   (payload) =>
//   async dispatch => {
//     dispatch(courierCreateRequested());
//     try {
//       const { content } = await couriersService.create(payload);
//       dispatch(courierCreated(content));
//       return content;
//     } catch (error) {
//       if (error.response.status === 500) {
//         dispatch(courierCreateRequestedFailed(error.response.data.message));
//         return;
//       }
//       const { message } = error.response.data.error;
//       dispatch(courierCreateRequestedFailed(message));
//     }
//   };

// export const removeBooking =
//   (courierId) =>
//   async dispatch => {
//     dispatch(removeBookingRequested());
//     try {
//       const id = await couriersService.remove(courierId || '');
//       dispatch(courierRemoved(id));
//     } catch (error) {
//       dispatch(removeBookingRequestedFailed());
//     }
//   };

export const getCouriers = () => (state) => sort_couriers(state.couriers.entities, state.couriers.isLoading);
export const getCouriersLoadingStatus = () => (state) => state.couriers.isLoading;
export const getBookingCreatedStatus = () => (state) => state.couriers.createBookingLoading;
export const getCouriersByUserId = (userId) => (state) => {
  if (state.couriers.entities) {
    return state.couriers.entities.filter(courier => courier.userId === userId);
  }
  return [];
};
export const getCourierById = (courierId) => (state) => {
  if (state.couriers.entities) {
    return state.couriers.entities.filter(courier => courier._id === courierId)[0];
  }
  return [];
};
export const getMapRoutes = () => (state) => state.couriers.mapRoutes;
export const getCourierMapRoutes = (courier_id) => (state) => {
  if (state.couriers.mapRoutes) {
    return state.couriers.mapRoutes.filter(route => route.courier_id === courier_id);
  }
  return null;

}

// export const sortCouriersBy = (field) => (state) => {

// };
export const getCouriersErrors = () => (state) => state.couriers.error;


export default couriersReducer;
