import React from 'react';
import styles from './WishList.module.css';
import { useDispatch, useSelector } from 'react-redux';
import placeholder from '../../Assets/images/placeholder2.jpg'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
import { getLoggedUserWishlist, removeProductFromWishlist } from '../../Redux/wishlistSlice';
import { addProductToCart } from '../../Redux/cartSlice';
import { useEffect } from 'react';
import { useState } from 'react';
import { Tooltip } from '@mui/material';
import { Helmet } from 'react-helmet';






export default function WishList() {

    const dispatch = useDispatch();

    const { userToken } = useSelector((store) => store.authReducer);
    const { wishData, wishAdded, isPending: isWishPending, error } = useSelector((store) => store.wishlistReducer)
    const { isPending: isCartPending } = useSelector((store) => store.cartReducer)
    const [prevWishAdded, setPrevWishAdded] = useState([]);

    useEffect(() => {
        if (JSON.stringify(prevWishAdded) !== JSON.stringify(wishAdded)) {
            setPrevWishAdded(wishAdded)
            dispatch(getLoggedUserWishlist(userToken));
        }
    }, [wishAdded])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return <>

        <Helmet>
            <title>Wishlist - Account - FreshCart</title>
        </Helmet>


        {isWishPending || isCartPending
            ?
            <div id="loading-screen">
                <i className="fa-solid fa-spinner fa-spin fa-4x"></i>
            </div>
            : null
        }
        {wishData?.data && !error
            ? wishData?.count === 0 ? <h6 className='text-center' style={{ height: '50vh' }} >Your wishlist is empty!</h6>
                : <div className='table-responsive'>
                    <table className="table table-bordered text-center">
                        <thead>
                            <tr>
                                <th scope="col" className='bg-main-light'>Image</th>
                                <th scope="col" className='bg-main-light'>Product Name</th>
                                <th scope="col" className='bg-main-light'>Availability</th>
                                <th scope="col" className='bg-main-light'>Unit Price</th>
                                <th scope='col' className='bg-main-light'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wishData?.data.map((item) => <tr key={item.id}>
                                <td className='align-middle'><LazyLoadImage
                                    src={item.imageCover ? item.imageCover : placeholder}
                                    className='w-100'
                                    effect='blur'
                                    placeholderSrc={placeholder}
                                    alt={item.title}
                                    width={50}
                                /></td>
                                <td className='align-middle'><Link to={`/productdetails/${item._id}`}>{item.title}</Link></td>
                                <td className='align-middle'>{item?.quantity >= 1 ? <span className='text-main fw-bold'>In Stock</span> : <span className='text-danger fw-bold'>Out of Stock</span>}</td>
                                <td className='align-middle'>{item.price}</td>
                                <td className='align-middle'>
                                    <div className='d-flex justify-content-center align-items-center gap-2'>
                                        <button className="btn btn-sm bg-main text-white" onClick={() => dispatch(addProductToCart({ id: item._id, userToken }))}><i className='fa-solid fa-shopping-cart'></i></button>
                                        <button className="btn btn-sm btn-secondary" onClick={() => dispatch(removeProductFromWishlist({ id: item._id, userToken }))} ><i className='fa-solid fa-trash'></i></button>
                                    </div>
                                </td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            : error ? <h6 className='text-center' style={{ height: '50vh' }} >{error}</h6> : null
        }

    </>
}
