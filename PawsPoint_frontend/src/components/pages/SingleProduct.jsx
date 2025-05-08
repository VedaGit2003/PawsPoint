import React, { useEffect, useState } from 'react'
import Wrapper from '../Wrapper/wrapper'
import { useNavigate, useParams } from 'react-router-dom'
import { backend_url } from '../../utils/Config'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const SingleProduct = () => {
    const { pID } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [address, setAddress] = useState('')
    const [auth] = useAuth()
    const [cart,setCart]=useState([])

    const navigate=useNavigate()


    const addToCart=async()=>{
        const userId=auth?.user?._id
        try{
          const response=await axios.post(`${backend_url}/api/v1/cart/add`,{
             userId,
             productId:pID,
             quantity: 1
          })
          if (response.data.success){
            toast.success("Product added to cart")
          }
          else{
            toast.error("Product not added,error occured!")
          }
        }catch(e){
            console.log(e)
            toast.error("An error occur while adding to the cart")
        }
        
    }

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${backend_url}/api/v1/products/p/${pID}`)
                if (!response.ok) throw new Error('Product not found')
                const data = await response.json()
                setProduct(data.data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [pID])

    if (loading) return <Wrapper><div className="text-center py-8">Loading...</div></Wrapper>
    if (error) return <Wrapper><div className="text-center py-8 text-red-500">{error}</div></Wrapper>

    return (
        <Wrapper>
            <div className=" mx-auto w-full px-4 py-8 bg-night">
                <div className=" flex flex-col md:flex-row gap-8 bg-night">
                    {/* Left Side - Product Image */}
                    <div className="md:w-1/2">
                        <div className="bg-white p-4 rounded-lg shadow-lg shadow-amber-400">
                            <img
                                src={product.product_Images[0]}
                                alt={product.name}
                                className="w-full h-96 object-contain rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Right Side - Product Details */}
                    <div className="md:w-1/2 space-y-6 bg-night">
                        <h1 className="text-3xl font-bold text-amber-400">{product.name}</h1>
                        <div className="text-lg font-semibold text-white">
                            Brand: <span className="text-blue-600">{product.brand}</span>
                        </div>
                        <div className="text-2xl font-bold text-green-400">
                            ₹{product.price}
                        </div>
                        <p className="text-gray-300">{product.description}</p>
                        <div className="text-gray-400">
                            Category: <span className="font-medium">{product.category}</span>
                        </div>

                        {/* Action Buttons */}
                        {
                            auth?.user ?
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex-1"
                                    onClick={() => navigate(`/o/${pID}`)}
                                    >
                                        Buy Now
                                    </button>
                                    <button className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors flex-1"
                                    onClick={addToCart}
                                    >
                                        Add to Cart
                                    </button>
                                </div> :
                                <div>
                                    <h1>You have to login before continue</h1>
                                </div>
                        }

                        {/* Address Section */}
                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-xl font-semibold mb-4 text-teal-300">Shipping Address</h3>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter your delivery address"
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Update Address
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

export default SingleProduct