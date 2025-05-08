import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import Wrapper from '../../Wrapper/wrapper'
import axios from 'axios'
import { backend_url } from '../../../utils/Config'
import Loading from '../../../shared/Loading'
import { FaBox, FaCheckCircle, FaShippingFast, FaMoneyBillWave, FaClock, FaTimesCircle, FaBan } from 'react-icons/fa'

const MyOrderDetails = () => {
    const [auth] = useAuth()
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const userId = auth?.user?._id
    console.log(userId)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.post(`${backend_url}/api/v1/orders/u/getOrderDetails`, { userId });
                if (response?.data?.order) {
                    setOrders(response.data.order);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setIsLoading(false); // ensure loading stops even if there's an error
            }
        };
    
        if (userId) {
            fetchOrders();
        }
    }, [userId]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered':
                return <FaCheckCircle className="text-green-500 text-xl mr-2" />;
            case 'Shipped':
                return <FaShippingFast className="text-blue-500 text-xl mr-2" />;
            case 'Confirmed':
                return <FaMoneyBillWave className="text-purple-500 text-xl mr-2" />;
            case 'Cancelled':
                return <FaTimesCircle className="text-red-500 text-xl mr-2" />;
            case 'Rejected':
                return <FaBan className="text-red-500 text-xl mr-2" />;
            default:
                return <FaClock className="text-yellow-500 text-xl mr-2" />;
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Shipped': return 'bg-blue-100 text-blue-800';
            case 'Confirmed': return 'bg-purple-100 text-purple-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    }

    if (isLoading) return <Loading />

    return (
        <Wrapper>
            <div className='min-h-screen bg-night py-8 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-4xl mx-auto'>
                    <h1 className='text-3xl text-center font-bold text-amber-300 mb-8 '>
                        My Orders
                    </h1>

                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <div key={order._id} className='bg-white rounded-lg shadow-sm mb-6 p-6 hover:shadow-md transition-shadow'>
                                <div className='flex justify-between items-start mb-4'>
                                    <div>
                                        <p className='text-sm font-mono text-gray-500'>
                                            Order: {order._id}
                                        </p>
                                        <p className='text-xs text-gray-400 mt-1'>
                                            Ordered on: {new Date(order.created_At).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </span>
                                </div>

                                <div className='border-t pt-4'>
                                {order.cart.map((item) => (
    <div key={item._id} className='flex items-center mb-4 last:mb-0'>
        {item?.item ? (
            <>
                <img
                    src={item.item.product_Images[0]}
                    alt={item.item.name}
                    className='w-16 h-16 object-cover rounded-lg border'
                />
                <div className='ml-4 flex-1'>
                    <h3 className='font-medium text-gray-900'>{item.item.name}</h3>
                    <p className='text-sm text-gray-500'>Quantity: {item.quantity}</p>
                    <p className='text-sm text-gray-500'>Price: ₹{item.item.price}</p>
                </div>
            </>
        ) : (
            <div className='ml-4 flex-1 text-red-500'>
                <h3 className='font-medium'>Item no longer available</h3>
                <p className='text-sm text-gray-500'>Quantity: {item.quantity}</p>
            </div>
        )}
    </div>
))}

                                </div>

                                <div className='border-t pt-4 mt-4'>
                                    <div className='flex justify-between items-center'>
                                        <p className='font-medium text-gray-900'>Total Amount:</p>
                                        <p className='text-lg font-semibold text-amber-600'>
                                            ₹{order.total_Order_Value}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='text-center py-12'>
                            <p className='text-gray-500 text-lg'>No orders found. Start shopping!</p>
                        </div>
                    )}
                </div>
            </div>
        </Wrapper>
    )
}

export default MyOrderDetails



// Old One

// import React, { useEffect, useState } from 'react'
// import { useAuth } from '../../../context/AuthContext'
// import Wrapper from '../../Wrapper/wrapper'
// import axios from 'axios'
// import { backend_url } from '../../../utils/Config'
// import Loading from '../../../shared/Loading'

// const MyOrderDetails = () => {
//     const [auth]=useAuth()
//     const [orders,setOrders]=useState([])
//     const [isLoading,setIsLoading]=useState(true)
//     console.log(auth?.user?._id)

//    const userId=auth?.user?._id

//    useEffect(()=>{
//     const fetchOrders = async () => {
//         try {
//           const response = await axios.post(`${backend_url}/api/v1/orders/u/getOrderDetails`, { userId })
//          if (response){
//             setOrders(response.data.order)
//             setIsLoading(false)
//         }
//           console.log(response.data.order)
//         } catch (error) {
//           console.error('Error fetching orders:', error)
//         }
//       }
//      fetchOrders()
//    },[userId])
// if(isLoading){
//     return(
//         <Loading/>
//     )
// }
//   return (
//     <Wrapper>
// <div className='w-full bg-night flex flex-col'>
// <h1 className='text-center text-amber-300 text-2xl font-semibold'>My Orders</h1>
// <div>
// {orders.length > 0 ? (
//             orders.map((items) => (
//               <div key={items._id} className='bg-white p-2 m-2 rounded-md shadow'>
//                 <h2 className='text-xl font-semibold'>Order ID: {items._id}</h2>
//                 {items.cart.map((c) => (
//                     <>
//                   <h3 key={c._id} className='text-gray-700'>
//                     Product Name: {c.item.name} | Quantity: {c.quantity}
//                   </h3>
//                   <img src={c.item.product_Images[0]} className='w-20 h-20' />
//                   </>
//                 ))}
//                 {/* <p className='text-gray-500'>Status: {items.status}</p> */}
//                 <p className={`${items.status=='Pending'||'Confirmed'? 'text-green-400' : 'text-black'}`}>{items.status==='Pending'||'Confirmed'?'🟢':'🟡'}Pending</p>
//                 <p className={`${items.status=='Confirmed'? 'text-green-400' : 'text-black'}`}>{items.status==='Confirmed'?'🟢':'🟡'}Confirmed</p>
//                 <p className='text-black'>{items.status==='Shipped'?'🟢':'🟡'}Shipped</p>
//                 <p className='text-black'>{items.status==='Delivered'?'🟢':'🟡'}Delivered</p>
//               </div>
//             ))
//           ) : (
//             <p className='text-gray-400 text-center'>No orders found.</p>
//           )}
// </div>

// </div>
//     </Wrapper>
//   )
// }

// export default MyOrderDetails make it look more eye catching