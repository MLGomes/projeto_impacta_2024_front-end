import React from 'react';
import ReactDOM from 'react-dom/client';
import { router } from './App';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer} from 'react-toastify';

import { RouterProvider } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastContainer autoClose={3000}/>
    <RouterProvider router={ router }/>
  </React.StrictMode>
);
