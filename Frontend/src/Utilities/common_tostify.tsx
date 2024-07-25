import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import { toast } from 'react-toastify';
export const toastMessageSuccess = (message: string) => {
  
  toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,

  });
};


export const toastMessageError = (message: string) => {

  toast.error(message, {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,

  });

};