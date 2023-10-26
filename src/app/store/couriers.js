import { createAction, createSlice } from '@reduxjs/toolkit';
import couriersService from '../services/couriers.service.js';
import getCourierRouteObj from '../utils/couriersUtils';
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
    activeCourier: null,
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

    /*Создаём маршруты курьеров*/
    mapRoutesReceived: (state, action) => {
      const map_routes =  action.payload.map( courier => {
        return getCourierRouteObj(courier)
      });

      if(DEBUG) console.warn('mapRoutesReceived', map_routes);
      state.mapRoutes = map_routes;
    },

    /*обновляем данные маршрута курьера полностью*/
    mapRouteReceived: (state, action) => {
      if(DEBUG) console.log('=====mapRouteReceived====', action, state.mapRoutes);
      state.mapRoutes[action.payload.index] = action.payload.data;
    },

    /*Пересоздаём маршрут курьера*/
    courierReMakeRoute: (state, action) => {
      const courierIndex = state.mapRoutes.findIndex(route => route.courier_id === action.payload._id);
      let activeCourier = action.payload._id === state.activeCourier
      console.warn('courierIndex', courierIndex)
      state.mapRoutes[courierIndex] = getCourierRouteObj(action.payload, activeCourier);
      state.isLoading = false;
    },

    setActiveCourier: (state, action) => {
      state.activeCourier = action.payload;
    },
    courierRouteDistanceReducer: (state, action) => {
      if(DEBUG) console.warn('=====courierRouteDistanceReducer====', action, state);
      const courierIndex = state.entities.findIndex(courier => courier.id === action.payload.courier_id);
      state.entities[courierIndex].routeDistance = action.payload.delivery_distance;
    },
    courierRouteTimeReducer: (state, action) => {
      if(DEBUG) console.warn('=====courierRouteDistanceReducer====', action, state);
      const courierIndex = state.entities.findIndex(courier => courier.id === action.payload.courier_id);
      state.entities[courierIndex].routeTime = action.payload.delivery_time;
    },

  },
});

const { actions, reducer: couriersReducer } = couriersSlice;

const {
  couriersRequested,
  couriersReceived,
  couriersRequestFailed,
  couriersUpdateOne,
  courierReMakeRoute,
  mapRoutesReceived,
  mapRouteReceived,
  setActiveCourier,
  //couriersSort,
  courierRemoved,
  courierCreateRequested,
  courierCreateRequestedFailed,
  courierSetShowRotes,
  courierRouteDistanceReducer,
  courierRouteTimeReducer,

} = actions;

const removeBookingRequested = createAction('couriers/removeBookingRequested');
const removeBookingRequestedFailed = createAction('couriers/removeBookingRequestedFailed');

/* ф-я сортировки курьеров */
const sort_couriers = (couriers, isLoading) => {
  const sort_keys = {
  online : 0,
  offline: 1,
}

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
    //Обновляем данные курьера
    dispatch(couriersUpdateOne(content.data || []));
    //Обновляем маршрут курьера
    dispatch(courierReMakeRoute(content.data || []));

    //dispatch(couriersSort());
  } catch (error) {
    if(DEBUG) console.log('reLoadCourier error',error);
  }
};

export const setCourierActive = (payload) => async dispatch => { 
  if(DEBUG) console.log('setActiveCourier payload ', payload)
  dispatch(setActiveCourier(payload || null));
  //dispatch(couriersSort());
}

export const updateCourier = (payload) => async dispatch => { 
  if(DEBUG) console.log('updateCourier payload STOP', payload)
  dispatch(couriersUpdateOne(payload || {}));
  //dispatch(couriersSort());
}

export const updateCourierField = (payload) => async dispatch => { 
  if(DEBUG) console.log('updateCourierField payload STOP', payload);
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

export const getActiveCourierData = (activeCourier) => (state) => {
  return '12345   ' + activeCourier;
}
export const getActiveCourier = () => (state) => state.couriers.activeCourier;
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
export const courierDeliveryDistanceUpdate = (payload) => courierRouteDistanceReducer(payload);
export const courierDeliveryTimeUpdate = (payload) => courierRouteTimeReducer(payload);


// export const sortCouriersBy = (field) => (state) => {

// };
export const getCouriersErrors = () => (state) => state.couriers.error;


export default couriersReducer;
