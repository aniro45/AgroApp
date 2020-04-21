import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const result = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name: name,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
      },
    });

    if (result.data.status === 'success') {
      showAlert('success', 'Created New Account Successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
