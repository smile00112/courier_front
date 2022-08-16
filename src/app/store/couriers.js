import { createAction, createSlice } from '@reduxjs/toolkit';
import orderService from '../services/couriers.service.js';
import isOutDated from '../utils/isOutDated.js';
//import { BookingType } from './../types/types';
import { AppThunk, RootState } from './createStore.ts';

const couriersSlice = createSlice({
  name: 'couriers',
  initialState: {
    entities: [],
    isLoading: true,
    createBookingLoading: false,
    error: null,
    lastFetch: null,
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
  },
});

const { actions, reducer: couriersReducer } = couriersSlice;

const {
  couriersRequested,
  couriersReceived,
  couriersRequestFailed,
  courierCreated,
  courierRemoved,
  courierCreateRequested,
  courierCreateRequestedFailed,
} = actions;

const removeBookingRequested = createAction('couriers/removeBookingRequested');
const removeBookingRequestedFailed = createAction('couriers/removeBookingRequestedFailed');

export const loadCouriersList = () => async (dispatch, getState) => {
  const { lastFetch } = getState().couriers;
  if (isOutDated(Number(lastFetch))) {
    dispatch(couriersRequested());
    try {
      const { content } = await orderService.getAll();
      dispatch(couriersReceived(content || []));
    } catch (error) {
      dispatch(couriersRequestFailed(error.message));
    }
  }
};

export const createBooking =
  (payload) =>
  async dispatch => {
    dispatch(courierCreateRequested());
    try {
      const { content } = await orderService.create(payload);
      dispatch(courierCreated(content));
      return content;
    } catch (error) {
      if (error.response.status === 500) {
        dispatch(courierCreateRequestedFailed(error.response.data.message));
        return;
      }
      const { message } = error.response.data.error;
      dispatch(courierCreateRequestedFailed(message));
    }
  };

export const removeBooking =
  (courierId) =>
  async dispatch => {
    dispatch(removeBookingRequested());
    try {
      const id = await orderService.remove(courierId || '');
      dispatch(courierRemoved(id));
    } catch (error) {
      dispatch(removeBookingRequestedFailed());
    }
  };

export const getCouriers = () => (state) => state.couriers.entities;
export const getCouriersLoadingStatus = () => (state) => state.couriers.isLoading;
export const getBookingCreatedStatus = () => (state) => state.couriers.createBookingLoading;
export const getCouriersByUserId = (userId) => (state) => {
  if (state.couriers.entities) {
    return state.couriers.entities.filter(courier => courier.userId === userId);
  }
  return [];
};
export const getCouriersByRoomId = (roomId) => (state) => {
  if (state.couriers.entities) {
    return state.couriers.entities.filter(courier => courier.roomId === roomId);
  }
  return [];
};

export const getCouriersErrors = () => (state) => state.couriers.error;

export default couriersReducer;
