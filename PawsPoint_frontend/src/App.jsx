import { useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Home from './components/pages/Home';
import Signup from './components/pages/Signup';
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import EditProfile from './components/pages/EditProfile';
import CreateProduct from './components/pages/protected/CreateProduct';
import OwnProduct from './components/pages/protected/OwnProduct';
import UpdateProduct from './components/pages/protected/UpdateProduct';
import SearchResult from './components/pages/SearchResult';
import Shop from './components/pages/Shop';
import SingleProduct from './components/pages/SingleProduct';
import OrderPage from './components/pages/OrderPage';
import Payment from './components/pages/Payment';
import PaymentSuccess from './components/pages/PaymentSuccess';
import MyOrderDetails from './components/pages/protected/MyOrderDetails';
import Cart from './components/pages/Cart';
import CartOrderPage from './components/pages/CartOrderPage';
import PaymentMultiple from './components/pages/PaymentMultiple';
import PaymentCartSuccess from './components/pages/PaymentCartSuccess';
import OnlineAppointmentVet from './components/pages/protected/OnlineAppointmentVet';
import AppointmentAcceptByVet from './components/pages/protected/AppointmentAcceptByVet';
import VetVideoCall from './components/pages/protected/VetVideoCall';
import AdminOrderPanel from './components/pages/protected/AdminOrderPanel';

function App() {
  const [cookies] = useCookies(['token']);
  const cookie = cookies?.token;

  return (
    <div className="cursor-custom w-screen h-screen font-poppins">
      <Routes>
        {cookie ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path='/search-product' element={<SearchResult/>} />
            <Route path='/shop' element={<Shop/>} />
            <Route path='/p/:pID' element={<SingleProduct/>} />
            <Route path='/o/:pID' element={<OrderPage/>} />
            <Route path='/cartOrder' element={<CartOrderPage/>} />
            <Route path='/pay/:pID' element={<Payment/>} />
            <Route path='/pay-multiple' element={<PaymentMultiple/>} />
            <Route path='/paymentSuccess' element={<PaymentSuccess/>} />
            <Route path='/paymentSuccessCart' element={<PaymentCartSuccess/>} />
            <Route path='/dashboard' element={<Dashboard/>} />
            <Route path='/profile' element={<EditProfile/>}/>
            <Route path='/myOrders' element={<MyOrderDetails/>}/>
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/vet-appointment-online' element={<OnlineAppointmentVet/>}/>
            <Route path='/vet-appointment-online-update/:appointmentId' element={<AppointmentAcceptByVet/>}/>
            <Route path='/vet-videocall/:appointmentId' element={<VetVideoCall/>}/>

            <Route path='/dashboard/createproduct' element={<CreateProduct/>}/>
            <Route path='/dashboard/own-product' element={<OwnProduct/>}/>
            <Route path='/dashboard/update-product' element={<UpdateProduct/>}/>

            <Route path='/dashboard/admin/update-order' element={<AdminOrderPanel/>}/>

    
            <Route path="*" element={<Home />} />
          </>
        ) : (
          <>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Signup />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
