// import roomsReducer from './rooms';
import { useDispatch } from 'react-redux';
import ordersReducer from './orders.js';
import usersReducer from './users.js';
import couriersReducer from './couriers.js';

// import reviewsReducer from './reviews';
// import bookingsReducer from './bookings';
import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit';


const rootReducer = combineReducers({
  // rooms: roomsReducer,
  users: usersReducer,
  orders: ordersReducer,
  couriers: couriersReducer,
  // likes: likesReducer,
  // reviews: reviewsReducer,
  // bookings: bookingsReducer,
});

export function createStore() {
  return configureStore({
    reducer: rootReducer,
  });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore['dispatch'];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type AppThunk = ThunkAction<Promise<any>, RootState, unknown, Action>;
