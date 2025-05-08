import React from 'react'
import { Link } from 'react-router-dom'

const CategoriesCard = ({categoryName,ur}) => {
  return (
    <Link>
    <div className='bg-black h-40 w-36 md:h-40 md:w-40 p-3 flex flex-col rounded-md hover:shadow-[0px_6px_32px_0px_#f7fafc] hover:animate-pulse'>
    <img src={ur} className='h-3/4'></img>
    <hr></hr>
    <h2 className='text-white w-full text-center m-0.5'>{categoryName}</h2>
    </div>
    </Link>
  )
}

export default CategoriesCard