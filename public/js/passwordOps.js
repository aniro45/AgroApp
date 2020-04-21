import axios from 'axios';
import { showAlert } from './alerts';

//! Forgot Password function
export const forgotPassword = async (email) => {
  try {
    console.log('My Words ' + email);
    const result = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: {
        email,
      },
    });

    if (result.data.status === 'success') {
      showAlert('success', 'Recovery link has sent to your registered email!');
      window.setTimeout(() => {
        location.assign('/login');
      }, 2500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const resetPassword = (password, passwordConfirm, token) => {
  const result = axios({
    method: 'POST',
    url: `/api/v1/users/resetPassword/${token}`,
    data: {
      password,
      passwordConfirm,
    },
  });
};
