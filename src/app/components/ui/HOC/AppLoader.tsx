import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadOrdersList } from '../../../store/orders';
// import { loadBookingsList } from '../../../store/bookings';
// import { loadLikesList } from '../../../store/likes';
// import { loadReviewsList } from '../../../store/reviews';
// import { loadRoomsList } from '../../../store/rooms';
import { getIsLoggedIn, getUsersLoadingStatus, loadUsersList } from '../../../store/users';

const AppLoader = ({ children }: any) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(getIsLoggedIn());
  const usersStatusLoading = false;// useSelector(getUsersLoadingStatus());
  console.warn('children', children);

  useEffect(() => {
    dispatch(loadOrdersList());
    dispatch(loadUsersList());
    // dispatch(loadRoomsList());
    // dispatch(loadLikesList());
    // dispatch(loadReviewsList());
    // dispatch(loadBookingsList());
  }, [isLoggedIn]);

  if (!usersStatusLoading) {
    console.warn('usersStatusLoading___1', usersStatusLoading)
    return children;
  } else {
    console.warn('usersStatusLoading___2', usersStatusLoading)

    return <></>;
  }
};

export default AppLoader;