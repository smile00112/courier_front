//import { AppThunk, RootState } from './createStore';
//import { OrderType, BookingType } from './../types/types';
import { createAction, createSlice } from '@reduxjs/toolkit';
import ordersService from '../services/orders.service';
import dateDiff from '../utils/getDateDiff';


const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    entities: [],
    filteredEntities: [] ,
    isLoading: true,
    selectCourierMode: true,
    selectCourierForOrder: 20,
    error: null,
  },
  reducers: {
    ordersRequested: state => {
      //alert('store.ordersRequested');
      state.isLoading = true;
    },
    ordersReceived: (state, action) => {
      state.entities = action.payload;
      //alert('store.ordersReceived');
      state.isLoading = false;
    },
    filteredOrdersReceived: (state, action) => {
      //alert('store.filteredOrdersReceived');
      state.filteredEntities = action.payload;
      state.isLoading = false;
    },
    ordersRequestFailed: (state, action) => {
      //alert('store.ordersRequestFailed');
      state.error = action.payload;
      state.isLoading = false;
    },
    orderUpdated: (state, action) => {
      const orderIndex = state.entities.findIndex(order => order._id === action.payload._id);
      state.entities[orderIndex] = action.payload;
    },

    orderDeliveryTimerReducer: (state, action) => {
        state.entities.map(
          order => dateDiff(Date.parse(order.order_close_time), new Date())
        );
    }
    
  },
});

const { actions, reducer: ordersReducer } = ordersSlice;

const { ordersRequested, ordersReceived, ordersRequestFailed, orderUpdated, filteredOrdersReceived, orderDeliveryTimerReducer } = actions;

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
    console.log('content 2 ', content);
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
      //console.log('content', content);
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
  //(payload: { orderId; _id }) =>
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
    dispatch(orderUpdateRequested());
    try {
      const { content } = await ordersService.update(payload);
      dispatch(orderUpdated(content));
    } catch (error) {
      console.log(error);
      dispatch(orderUpdateRequestedFailed());
    }
  };

export const getOrders = () => (state) => state.orders.entities;
export const getFilteredOrders = () => (state) => state.orders.filteredEntities;
export const getOrdersLoadingStatus = () => (state) => state.orders.isLoading;
export const getSelectCouriesModeStatus = () => (state) => state.orders.isLoading;
export const getOrderById = (orderId) => (state) => {
  if (state.orders.entities) {
    return state.orders.entities.find(order => order._id === orderId);
  }
};

export const orderDeliveryTimerUpdate = () => orderDeliveryTimerReducer();

export const getOrdersByIds = (ordersIds) => (state) => {
  if (state.orders.entities) {
    return state.orders.entities.filter(order => (ordersIds.length > 0 ? ordersIds.includes(order._id || '') : false));
  }
  return [];
};

export default ordersReducer;
