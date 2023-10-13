import React, { useContext, useEffect } from 'react';
import styles from './ProductDetails.module.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';
import Slider from 'react-slick';
import { addProductToCart } from '../../Redux/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToWishlist, removeProductFromWishlist } from '../../Redux/wishlistSlice';



export default function ProductDetails() {

    let navigate = useNavigate()
    const dispatch = useDispatch();
    let urlParams = useParams();

    const { userToken } = useSelector((store) => store.authReducer)

    const { wishAdded, error: wishError, isPending } = useSelector((store) => store.wishlistReducer)

    let { isLoading, isError, data, error } = useQuery('ProductDetails', () => axios.get(`https://ecommerce.routemisr.com/api/v1/products/${urlParams.id}`))

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        className: 'border border-2',

    };

    useEffect(()=>{
        window.scrollTo(0, 0)
    },[])

    return <>
        {!isError ?
            <section id='productDetails' className='py-4 my-5'>
                {isLoading ? <div className='w-100 vh-100 py-5 d-flex justify-content-center align-content-center '>
                    <TailSpin
                        height="80"
                        width="80"
                        color="#0aad0a"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                    />
                </div> : <div className="container">
                    <div className="row align-items-center ">
                        <div className="col-md-4">
                            <Slider {...settings}>
                                {data?.data.data.images.map((image) => <img key={data?.data.data._id} src={image} className='w-100' alt={data?.data.data.title} />)}
                            </Slider>
                        </div>
                        <div className="col-md-8">
                            <div className='mb-2'>
                                <span className='text-main'>{data?.data.data.category.name}/</span>
                                <span className='text-main'>{data?.data.data.subcategory[0].name}</span>
                            </div>
                            <h2 className='fw-bold'>{data?.data.data.title}</h2>
                            <div className="d-flex justify-content-between align-items-center border-bottom border-2 py-4">
                                <span className='text-main fw-bold fs-4'>{data?.data.data.price} LE</span>
                                <span>Availability: {data?.data.data.quantity >= 1 ? <span className='text-main fw-bold'>In Stock</span> : <span className='text-danger fw-bold'>Out of Stock</span>}</span>
                            </div>


                            <h4><span className='fw-bold align-middle'>Brand: </span><img src={data?.data.data.brand.image} width={100} alt={data?.data.data.brand} /> </h4>

                            <p className='p-3'>{data?.data.data.description}</p>

                            <div className='d-flex justify-content-between align-items-center'>

                                <span>Ratings: <i className='fa-solid fa-star rating-color'></i> {data?.data.data.ratingsAverage}</span>
                                <div>
                                    {wishAdded?.includes(data?.data.data._id)
                                        ? (
                                            <button className='btn bg-main text-white' onClick={() => dispatch(removeProductFromWishlist({ id: data?.data.data.id, userToken }))} ><i className='fa-solid fa-heart fa-xl'></i> Wishlist</button>
                                        )
                                        : (
                                            <button className='btn bg-main text-white' onClick={() => dispatch(addProductToWishlist({ id: data?.data.data.id, userToken }))} ><i className='fa-regular fa-heart fa-xl'></i> Wishlist</button>
                                        )
                                    }
                                </div>
                            </div>

                            {data?.data.data.quantity >= 1 ?
                                <button onClick={() => dispatch(addProductToCart({ id: data?.data.data.id, userToken }))} className='btn bg-main w-100 text-white mt-3'>Add to Cart</button> : ""
                            }
                        </div>
                    </div>
                </div>}
            </section> :
            <div className='vh-100 d-flex flex-column align-items-center justify-content-center '>
                <h6 className='h1'>Page is no longer found</h6>
                <Link to={'/'} className='btn bg-main-outline'>Continue</Link>
            </div>}
    </>
}
