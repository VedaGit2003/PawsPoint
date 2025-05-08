import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../shared/Navbar'
import Wrapper from '../Wrapper/wrapper'
import HeaderCarousel from '../../shared/HeaderCarousel'
import CategoriesCard from '../../shared/CategoriesCard'
import ProductCard from '../../shared/ProductCard'
import { useAuth } from '../../context/AuthContext'
import Fish from  '../../images/fish.mp4'

const Home = () => {
  const navigate=useNavigate()
  const [auth,setAuth]=useAuth()
  return (
    <>
    <Wrapper current={'home'}>
    <div className='text-2xl cursor-custom w-full h-auto bg-night'>
    
      {/* <div className='w-full h-auto'>
        <img src='https://supertails.com/cdn/shop/files/Frame_1405176767-min_6855ee30-6ea4-48ef-96f0-13d809ed6f4d_1600x.png?v=1731579835'></img>
      </div> */}
      {/* corousal */}
      <HeaderCarousel/>
      {/* corousal end */}
      {/* Our Services Section */}
<div className='flex flex-col w-full h-fit my-2 p-6'>
  <div className='flex justify-center items-center mb-8'>
    <h1 className='font-extrabold font-title_font tracking-wider text-2xl text-amber-300 drop-shadow-[0px_0px_30px_rgba(192,33,110,1)] p-3'>
      Our Services
    </h1>
  </div>
  <div className='grid grid-cols-2 md:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto'>
    {/* Service Card Component */}
    {[
      { name: 'Pet Products', icon: '🛍️', desc: 'Premium quality pet supplies' },
      { name: 'Medicine', icon: '💊', desc: 'Verified pet medications' },
      { name: 'Online Vet', icon: '👩⚕️', desc: '24/7 Video consultations' },
      { name: 'Book Vet', icon: '📅', desc: 'In-clinic appointments' },
      { name: 'Grooming', icon: '✂️', desc: 'Professional grooming services' },
      { name: 'Sell Products', icon: '📦', desc: 'Marketplace for pet businesses' },
      { name: 'Buy Pets', icon: '🐾', desc: 'Ethical pet acquisition' },
      { name: 'Adopt Pets', icon: '🏠', desc: 'Find forever homes' },
    ].map((service, index) => (
      <div 
        key={index}
        className="relative group bg-night-800 rounded-xl p-6 transition-all duration-300 
                 hover:bg-night-700 hover:transform hover:scale-105 cursor-custom
                 border-2 border-amber-300/20 hover:border-amber-300/40"
        onClick={() => navigate(`/services/${service.name.toLowerCase().replace(' ', '-')}`)}
      >
        <div className="flex flex-col items-center text-center">
          <span className="text-4xl mb-4 transition-transform group-hover:scale-110">
            {service.icon}
          </span>
          <h3 className="font-bold text-lg text-amber-300 mb-2">{service.name}</h3>
          <p className="text-gray-300 text-sm">{service.desc}</p>
        </div>
        <div className="absolute inset-0 rounded-xl border-2 border-transparent 
                      group-hover:border-amber-300/20 transition-all duration-300" />
      </div>
    ))}
  </div>
</div>
      {/* popular categories  */}
      <div className='flex flex-col w-full h-fit my-2'>
       <div className='flex justify-center items-center'>
        <h1 className='font-extrabold font-title_font tracking-wider text-2xl text-amber-300 drop-shadow-[0px_0px_30px_rgba(192,33,110,1)] p-3'>Shop by Pet</h1>
       </div>
       <div className='flex flex-wrap justify-center items-center gap-4 my-3'>
        <CategoriesCard categoryName={"Dogs"} ur={'https://plus.unsplash.com/premium_photo-1694819488591-a43907d1c5cc?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D'}/>
        <CategoriesCard categoryName={"Cats"} ur={'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNhdHN8ZW58MHx8MHx8fDA%3D'}/>
        <CategoriesCard categoryName={"Rabbits"} ur={'https://media.istockphoto.com/id/173893247/photo/rabbit.webp?a=1&b=1&s=612x612&w=0&k=20&c=lLEYLC7Tlkb2PyIDda5Zi2kmpaRN8PmCSfuYDCJe2lY='}/>
        <CategoriesCard categoryName={"Fishes"} ur={'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmlzaHxlbnwwfHwwfHx8MA%3D%3D'}/>
        <CategoriesCard categoryName={"Birds"} ur={'https://plus.unsplash.com/premium_photo-1664543649513-c21242431e6e?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAxfHxCaXJkc3xlbnwwfHwwfHx8MA%3D%3D'}/>
        <CategoriesCard categoryName={"Reptiles"} ur={'https://media.istockphoto.com/id/1081594106/photo/green-iguana.webp?a=1&b=1&s=612x612&w=0&k=20&c=kqkbdhmpmkq3-UjzXZVp2ED2SaMsx9CNMD-DSwBl9EU='}/>
       </div>
      </div>
      {/* popular categories end */}
     {/* bank offer start  */}
      <div className='w-full px-5 my-2'>
         <img src='https://supertails.com/cdn/shop/files/Homepage_desk-min_34987ee0-64bf-417a-b4f8-9af815c22588.png?v=1732992049'></img>
      </div>
     {/* bank offer end  */}
     
     {/* Popular products  */}
     <div className='flex flex-col w-full h-fit my-2 p-6'>
       <div className='flex justify-center items-center'>
        <h1 className='font-extrabold font-title_font tracking-wider text-2xl text-amber-300 drop-shadow-[0px_0px_30px_rgba(192,33,110,1)] p-3'>Popular Products</h1>
       </div>
       <div className='flex flex-wrap justify-center md:justify-normal items-center gap-4 my-3'>
        <ProductCard ur={'https://supertails.com/cdn/shop/files/Frame_1405178184-min.png?v=1732537085'}/>
        <ProductCard  ur={'https://supertails.com/cdn/shop/files/Frame_1405180467-min.png?v=1733377612'}/>
        <ProductCard  ur={'https://supertails.com/cdn/shop/files/Frame_1405180047.png?v=1733205957'}/>
        <ProductCard  ur={'https://supertails.com/cdn/shop/files/Frame_1405178183-min.png?v=1732537526'}/>
        <ProductCard  ur={'https://supertails.com/cdn/shop/files/Frame_1405180472-min_800x.png?v=1733379910'}/>
        <ProductCard  ur={'https://supertails.com/cdn/shop/files/SKATRSTOYS_19.png?v=1714715536'}/>
       </div>
      </div>
     {/* Popular products end  */}

     {/* Video Hero Section */}
{/* Video Hero Section */}
<div className="relative w-full  overflow-hidden group">
  {/* Video Container */}
  <video 
    autoPlay 
    muted 
    loop 
    playsInline
    className="w-full h-full object-cover opacity-90"
  >
    <source src={Fish} type="video/mp4" />

  </video>

  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70" />

  {/* Slogan Container */}
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
    <h2 className="font-title_font text-xl md:text-7xl font-extrabold tracking-wide mb-6
      bg-gradient-to-r from-amber-300 via-pink-500 to-purple-600 
      bg-clip-text text-transparent
      drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)]
      animate-float">
      Where Every Pet Finds Paradise
    </h2>
    
    <p className="text-xl md:text-2xl text-gray-200 font-medium max-w-2xl mx-auto mb-3
      drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
      Premium Care, Unconditional Love - Everything Your Companion Deserves
    </p>

    <button 
      className="px-8 py-3 bg-amber-300 text-night rounded-full font-bold
        hover:bg-amber-400 transition-all duration-300 hover:scale-110
        shadow-lg hover:shadow-2xl hover:shadow-amber-300/30"
      onClick={() => navigate('/shop')}>
      Explore Now
    </button>
  </div>
</div>

    </div>
    {/* <button onClick={()=>navigate('/')}>Go back</button> */}
    </Wrapper>
    </>
  )
}

export default Home