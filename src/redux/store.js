// store.js
import { configureStore } from '@reduxjs/toolkit';
import courseReducer from '../redux/reducers/CourseSlice';
import authReducer from '../redux/reducers/authSlice';
import conatctUsReducer from '../redux/reducers/contactUsSlice';
import resetPasswordReducer from '../redux/reducers/resetPasswordSlice';
export default configureStore({
    reducer: {
        course:courseReducer,
        auth:authReducer,
        contactUs:conatctUsReducer,
        resetPassword:resetPasswordReducer
    },
});
