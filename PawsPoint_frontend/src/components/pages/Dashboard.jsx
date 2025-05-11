import React from 'react';
import Wrapper from '../Wrapper/wrapper';
import { useAuth } from '../../context/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate()
  console.log(auth?.user);
  const profilePic = auth?.user?.profile_Image;
  const role = auth?.user?.user_Role;
  const name = auth?.user?.user_Name;
  const email = auth?.user?.email;


  // ISO formatted date
  const joinDateISO = auth?.user?.created_at;
  const joiningDate = new Date(joinDateISO);

  // Function for converting Date to string
  function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  // Date of joining
  const join = formatDate(joiningDate);

  return (
    <Wrapper>
      <div className="h-full w-full m-0 bg-night flex flex-col gap-2 justify-center items-center">
        <div className="w-3/4 px-2 py-2 flex flex-col rounded-md gap-1 justify-center items-center bg-orange-500/60 hover:shadow-[0.5rem_0.5rem_#F44336,-0.5rem_-0.5rem_#00BCD4] ">
          <img
            src={
              profilePic ||
              'https://media.istockphoto.com/id/1476171646/photo/young-woman-ready-for-job-business-concept.webp?a=1&b=1&s=612x612&w=0&k=20&c=sjeKzIKtiaJIc0hoGE19u3_jJxERowxVOdbeDpXM_J8='
            }
            height={100}
            width={100}
            className="rounded-full"
          />
          <h1 className="text-xl font-extrabold">{name?.toUpperCase()}</h1>
          <h1 className="text-lg font-bold">{role}</h1>
          <h1>{email}</h1>
          <h1>
            <span className="font-bold">Joining Date:</span>
            {join}
          </h1>
          <div className='flex flex-row justify-center items-center gap-3'>
            <button onClick={() => navigate('/profile')} className="cursor-pointer my-4 uppercase rounded-full bg-white px-4 py-2 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#F44336,-0.5rem_-0.5rem_#00BCD4] hover:animate animate-pulse transition">
              Edit Profile
            </button>
            <button onClick={() => navigate('/myOrders')} className="cursor-pointer my-4 uppercase rounded-full bg-white px-4 py-2 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#F44336,-0.5rem_-0.5rem_#00BCD4] hover:animate animate-pulse transition">
              My Orders
            </button>
            <button onClick={() => navigate('/myPetOrders')} className="cursor-pointer my-4 uppercase rounded-full bg-white px-4 py-2 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#F44336,-0.5rem_-0.5rem_#00BCD4] hover:animate animate-pulse transition">
              My Pet Orders
            </button>
            <button onClick={() => navigate('/cart')} className="cursor-pointer my-4 uppercase rounded-full bg-white px-4 py-2 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#F44336,-0.5rem_-0.5rem_#00BCD4] hover:animate animate-pulse transition">
              Cart
            </button>
          </div>
        </div>

        {/* Dashboard only for seller,admin,vet   */}
        {(role === 'seller' || role === 'admin' || role === 'vet') && (
          <div className="w-3/4 bg-emerald-500 flex flex-col items-center justify-around p-4 rounded-lg gap-4 hover:shadow-[0px_6px_32px_0px_#f7fafc]">
            <h1 className="font-bold text-white text-xl mb-4">Dashboard</h1>
            {
              role === 'seller' &&
              <>
                <button onClick={() => navigate('/dashboard/createproduct')} className="px-6 py-3 rounded-full bg-white text-emerald-600 font-semibold uppercase hover:bg-emerald-100 shadow-md">
                  Create Product
                </button>
                <button onClick={() => navigate('/dashboard/own-product')} className="px-6 py-3 rounded-full bg-white text-emerald-600 font-semibold uppercase hover:bg-emerald-100 shadow-md">
                  Update Product
                </button>
                <button onClick={() => navigate('/dashboard')} className="px-6 py-3 rounded-full bg-white text-emerald-600 font-semibold uppercase hover:bg-emerald-100 shadow-md">
                  Orders
                </button>
            <button onClick={() => navigate('/dashboard/createpet')} className="px-6 py-3 rounded-full bg-white text-emerald-600 font-semibold uppercase hover:bg-emerald-100 shadow-md">
                  Sell Pet
                </button>
                
              </>
            }
            {
              role === 'admin' &&
              <><button className="px-6 py-3 rounded-full bg-white text-emerald-600 font-semibold uppercase hover:bg-emerald-100 shadow-md"
               onClick={()=>navigate('/dashboard/admin/pet-order')}
              >
Pet Order Details
              </button>

                <button className="px-6 py-3 rounded-full bg-white text-emerald-600 font-semibold uppercase hover:bg-emerald-100 shadow-md"
                onClick={()=>navigate('/dashboard/admin/update-order')}
                >
                  Order Update
                </button>

                <button className="px-6 py-3 rounded-full bg-white text-emerald-600 font-semibold uppercase hover:bg-emerald-100 shadow-md">
                  Set Appointments
                </button>
              </>
            }



            {/* only for vets  */}
            {
              role === 'vet' &&
              <div className='flex flex-row justify-center gap-2 flex-wrap'>
                <button className="px-6 py-3 rounded-full bg-white text-emerald-600 font-semibold uppercase hover:bg-emerald-100 shadow-md"
                onClick={()=>navigate('/vet-appointment-online')}
                >
                 Online Appointments
                </button>
                <button className="px-6 py-3 rounded-full bg-white text-emerald-600 font-semibold uppercase hover:bg-emerald-100 shadow-md">
                 Offline Appointments
                </button>
              </div>
            }

          </div>
        )}
      </div>

    </Wrapper>
  );
};

export default Dashboard;
