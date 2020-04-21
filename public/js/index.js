import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { signup } from './signup';
import { forgotPassword, resetPassword } from './passwordOps';
import { updateSettings } from './updateSettings';
import { bookProduct } from './stripe.js';
import { showAlert } from './alerts';

if (document.querySelector('.form--password-recover')) {
  document
    .querySelector('.form--password-recover')
    .addEventListener('submit', (e) => {
      showAlert('processing', 'This Feature is Under construction!');
    });
}

//!Forgot Paasword
if (document.querySelector('.form--forgotPassword')) {
  document
    .querySelector('.form--forgotPassword')
    .addEventListener('submit', (e) => {
      e.preventDefault();
      showAlert('processing', 'Processing...');
      const email = document.getElementById('email').value;
      forgotPassword(email);
    });
}

//! Signup
if (document.querySelector('.form--signup')) {
  document.querySelector('.form--signup').addEventListener('submit', (e) => {
    e.preventDefault();
    showAlert('processing', 'Signing Up! Please Wait...');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('confirm-password').value;
    signup(name, email, password, passwordConfirm);
  });
}

//!DOM implemetation
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
// const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-product');

//!For map on the product page
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

//! Login in the
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showAlert('processing', 'Logging In! Please wait...');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

//! Logout
logOutBtn.addEventListener('click', logout);

//!Update User data like name and email
if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // document.querySelector('.btn--save-data').textContent = 'Updating...';

    const form = new FormData();

    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');

    // document.querySelector('.btn--save-data').textContent = 'Save settings';
    // location.reload(true);
  });

//! Update password
if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

//!Stripe payment

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { productId } = e.target.dataset;
    // alert(productId);
    bookProduct(productId);
  });
}
