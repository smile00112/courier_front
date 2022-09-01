//import { AppThunk, RootState } from './createStore';
//import { OrderType, BookingType } from './../types/types';
import { createAction, createSlice } from '@reduxjs/toolkit';
import ordersService from '../services/orders.service';
import dateDiff from '../utils/getDateDiff';

const DEBUG = false;
const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    entities: [],
    filteredEntities: [] ,
    isLoading: true,
    selectCourierMode: false,
    selectCourierForOrder: 0, 
    error: null,
  },
  reducers: {
    ordersRequested: state => {
      //alert('store.ordersRequested');
      state.isLoading = true;
    },
    ordersReceived: (state, action) => {
      if(DEBUG) console.log('ordersReceived', action.payload)
      state.entities = action.payload;
      state.isLoading = false;
    },
    filteredOrdersReceived: (state, action) => {
      state.filteredEntities = action.payload;
      state.isLoading = false;
    },
    ordersRequestFailed: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    orderUpdated: (state, action) => {
      console.log('orderUpdated', action)
      const orderIndex = state.entities.findIndex(order => order.id === action.payload.data.id);
      state.entities[orderIndex] = action.payload.data;
    },
    orderNew: (state, action) => {
      console.log('orderNew', action.payload.order)
      state.entities.push(action.payload.order);
    }, 
    orderSelectCourierModeEnable: (state, action) => {
      console.log('reducer_orderSelectCourierModeEnable', action);
      state.selectCourierMode = true;
      state.selectCourierForOrder = action.payload.order_id;
    },
    orderSelectCourierModeDisable: (state, action) => {
      state.selectCourierMode = false;
      state.selectCourierForOrder = 0;
    },
    orderSetCourierToOrder: (state, action) => {
      if(DEBUG) console.log('state',action, action.payload, 'state' , state)
      state.selectCourierMode = false;
      state.selectCourierForOrder = 0;
    },        
    orderDeliveryTimerReducer: (state, action) => {
        state.entities.map(
          order => dateDiff(Date.parse(order.order_close_time), new Date())
        );
    }
    
  },
});

const { actions, reducer: ordersReducer } = ordersSlice;

const { 
  ordersRequested, 
  ordersReceived, 
  ordersRequestFailed, 
  orderUpdated, 
  filteredOrdersReceived, 
  orderDeliveryTimerReducer,
  orderSelectCourierModeEnable, 
  orderSelectCourierModeDisable, 
  orderSetCourierToOrder,
  orderNew,

} = actions;

const addBookingOrderRequested = createAction('orders/addBookingOrderRequested');
const addBookingOrderRequestedSuccess = createAction('orders/addBookingOrderRequestedSuccess');
const addBookingOrderRequestedFailed = createAction('orders/addBookingOrderRequestedFailed');

const removeBookingOrderRequested = createAction('orders/removeBookingOrderRequested');
const removeBookingOrderRequestedSuccess = createAction('orders/removeBookingOrderRequestedSuccess');
const removeBookingOrderRequestedFailed = createAction('orders/removeBookingOrderRequestedFailed');

const orderUpdateRequested = createAction('orders/orderUpdateRequested');
const orderUpdateRequestedFailed = createAction('orders/orderUpdateRequestedFailed');

export const loadOrdersList = () => async dispatch => {
  dispatch(ordersRequested());
  try {
    const { content } = await ordersService.getAll();
    content.data.map(
      order => {
          order.deliveryTimer = dateDiff(Date.parse(order.order_close_time), new Date());
          order.productsTotal = 777;//order.products.reduce( (Sum, product) => Sum + actions, 0)
          //order.poducts_count = dateDiff(Date.parse(order.order_close_time), new Date());
          return order;
      }
    );
    if(DEBUG) console.log('content 2 ', content);
    dispatch(ordersReceived(content.data || []));
  } catch (error) {
    dispatch(ordersRequestFailed(error.message));
  }
};

export const loadFilteredOrdersList =
  (queryParams?) =>
  async dispatch => {
    dispatch(ordersRequested());
    try {
      const { content } = await ordersService.getAll(queryParams);
      //if(DEBUG) console.log('content', content);
      dispatch(filteredOrdersReceived(content.data || []));
    } catch (error) {
      dispatch(ordersRequestFailed(error.message));
    }
  };

export const addBookingOrder =
  (payload) =>
  async dispatch => {
    dispatch(addBookingOrderRequested());
    try {
      ordersService.setBooking(payload);
      dispatch(addBookingOrderRequestedSuccess());
    } catch (error) {
      dispatch(addBookingOrderRequestedFailed());
    }
  };

export const removeBookingOrder =
  (payload) =>
  //(payload: { orderId; id }) =>
  async dispatch => {
    dispatch(removeBookingOrderRequested());
    try {
      ordersService.deleteBooking(payload);
      dispatch(removeBookingOrderRequestedSuccess());
    } catch (error) {
      dispatch(removeBookingOrderRequestedFailed());
    }
  };

  export const updateOrderData =
    (payload) =>
    async dispatch => {
      if(DEBUG) console.log('updateOrderData payload', payload)
      dispatch(orderUpdateRequested());
      try {
        const { content } = await ordersService.orderToCourier(payload);
        dispatch(orderUpdated(content));
        dispatch(orderSelectCourierModeDisable());
      } catch (error) {
        if(DEBUG) console.log(error);
        dispatch(orderUpdateRequestedFailed());
      }
  };

  export const orderToCourier =
    (payload) =>
    async dispatch => {
      if(DEBUG) console.log('orderToCourier payload', payload)
      dispatch(orderUpdateRequested());
      try {
        const { content } = await ordersService.orderToCourier(payload);
        dispatch(orderUpdated(content));
        dispatch(orderSelectCourierModeDisable());        
      } catch (error) {
        if(DEBUG) console.log(error);
        dispatch(orderUpdateRequestedFailed());
      }
  };

  
export const getOrders = () => (state) => state.orders.entities;
export const getFilteredOrders = () => (state) => state.orders.filteredEntities;
export const getOrdersLoadingStatus = () => (state) => state.orders.isLoading;
export const getSelectCourierModeStatus = () => (state) => state.orders.selectCourierMode;
export const getSelectCourierModeOrderId = () => (state) => state.orders.selectCourierForOrder;
export const getOrderById = (orderId) => (state) => {
  if (state.orders.entities) {
    return state.orders.entities.find(order => order.id === orderId);
  }
};


export const sosketNewOrder = (payload) => orderNew(payload);
export const sosketUpdateOrder = (payload) => orderUpdated(payload);

export const orderDeliveryTimerUpdate = () => orderDeliveryTimerReducer();
export const enableModeSelectCourier = (payload) => orderSelectCourierModeEnable(payload);
export const disableModeSelectCourier = (payload) => orderSelectCourierModeDisable(payload);
export const courierToOrder = (payload) => orderSetCourierToOrder(payload);

export const getOrdersByIds = (ordersIds) => (state) => {
  if (state.orders.entities) {
    return state.orders.entities.filter(order => (ordersIds.length > 0 ? ordersIds.includes(order.id || '') : false));
  }
  return [];
};

export default ordersReducer;
