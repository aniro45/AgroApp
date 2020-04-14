import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe('pk_test_yAvpPPSrN75PT7G8l6mM2VU5002XZosmpz');

export const bookProduct = async (productId) => {
  try {
    //1) Get Checkout session from api
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${productId}`
    );
    console.log(session);

    //2)Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    console.log(error);
    showAlert('error', error);
  }
};
