
import React, { useState } from "react";
import { IallProduct } from "../Interfaces/common_interfaces";
import { RootStateOrAny, useSelector } from "react-redux";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { IErrors } from "../Interfaces/stripe_interface";
import { paymentStripe, savePaymentAction } from "../Service/user_service";

interface propsInterface {
  data: IallProduct[];
}

function Proceedtopay(props: propsInterface) {
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState<IErrors>({
    incomplete_number: "",
    incomplete_expiry: "",
    incomplete_cvc: "",
  });
  const elements = useElements();
  const stripe = useStripe();
  const user_id = useSelector(
    (state: RootStateOrAny) => state.AuthReducer.authData.user_id
  );

  const handleSubmit = async () => {
    setLoader(true);
    try {
      const cardElement = elements && elements.getElement(CardNumberElement);
      const new_data = props.data;

      let amount: number = 0;
      const product_ids: any = [];

      new_data.map((item) => {
        amount += item.price;
        product_ids.push(item._id);
      });
      amount = Number(amount.toFixed(2));

      const { data: clientSecret } = await paymentStripe({
        amount: Math.round(amount * 100),
        product_ids: product_ids,
        type: "Buying",
      });

      console.log("clientSecret>>>>>>>>>>>>>>",clientSecret);

      const createPayment =
        stripe &&
        (await stripe.createPaymentMethod({        
          type: "card",
          card: cardElement!,
        }));

        console.log("createPayment>>>>>>>>>>>>>>",createPayment);

        if (createPayment?.error && createPayment?.error?.code) {
          const tempErr: IErrors = errors;
          tempErr[createPayment?.error?.code as keyof IErrors] =
            createPayment?.error.message;
          alert(createPayment?.error.message as string);
          setErrors({ ...tempErr });
        }

      if (createPayment?.paymentMethod && clientSecret?.client_secret) {
        const confirmPayment =
          stripe &&
          (await stripe.confirmCardPayment(clientSecret?.client_secret as any, {
            payment_method: createPayment?.paymentMethod.id,
          }));

          console.log("confirmPayment>>>>>>>",confirmPayment);

        if (createPayment?.paymentMethod && confirmPayment) {
          const { paymentIntent, error } = confirmPayment;
          if (paymentIntent) {
            const paymentPayload = {
              user_id: user_id,
              product_ids: product_ids,
              transactionId: paymentIntent.id,
              amount: amount,
            };
            const savePayment = await savePaymentAction(paymentPayload);
            if (savePayment.data?.status) {
              alert("Payment successfully done");
            } else if (error) {
              alert(error);
            }
          }
        }
      }
    } catch (error: any) {
      console.log(error);
    }
    setLoader(false);
  };

  return (
    <form>
      <style>
        {`
          .input-container {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
          }
          
          .input-container label {
            font-weight: bold;
            display: block;
            width: 100px;
          }
          
          .input-container .form-control {
            flex: 1;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            transition: border-color 0.3s;
          }
          
          .input-container .form-control:focus {
            border-color: #007bff;
          }
          
          .text-center {
            text-align: center;
            margin-top: 20px;
          }
          
          .theme-button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s, color 0.3s;
          }
          
          .theme-button.blue-btn:hover {
            background-color: #0056b3;
          }
          
          .theme-button.blue-btn:disabled {
            background-color: #ccc;
            cursor: not-allowed;
          }
        `}
      </style>
      
      <div className="input-container">
        <label>Card Number</label>
        <CardNumberElement className="form-control" />
      </div>
      <div className="input-container">
        <label>Card Expiry</label>
        <CardExpiryElement className="form-control" />
      </div>
      <div className="input-container">
        <label>CVC</label>
        <CardCvcElement className="form-control" />
      </div>

      <div className="text-center">
        <button
          disabled={loader ? true : false}
          type="button"
          onClick={handleSubmit}
          className={`theme-button button-lg blue-btn ${
            loader ? "disabled" : ""
          }`}
        >
          <span>Pay Now</span>
        </button>
      </div>
    </form>
  );
}

export default Proceedtopay;
