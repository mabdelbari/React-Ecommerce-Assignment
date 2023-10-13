import React, { useContext, useEffect, useState } from 'react';
import styles from './FeaturedProducts.module.css';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import placeholder from '../../Assets/images/placeholder2.jpg'
import { useQuery } from 'react-query';
import { TailSpin } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToCart } from '../../Redux/cartSlice';
import { addProductToWishlist, removeProductFromWishlist } from '../../Redux/wishlistSlice';

export default function FeaturedProducts() {

    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState("");

    const { userToken } = useSelector((store) => store.authReducer)

    const { wishAdded, isPending } = useSelector((store) => store.wishlistReducer)

    let { isLoading, data, refetch } = useQuery({
        queryKey: ['FeaturedProducts', page],
        queryFn: () => axios.get(`https://ecommerce.routemisr.com/api/v1/products?limit=12&page=${page}`),
        cacheTime: 600000,
        refetchOnMount: true,
        staleTime: 300000,
        refetchInterval: 120000
    })

    const handleChange = (e) => {
        setSearchKeyword(e.target.value);
    }

    useEffect(() => {
        refetch();
    }, [])

    return <>

        <section id='featuredProducts' className='py-4 my-5'>
            {isLoading
                ? (
                    <div className='w-100 vh-100 py-5 d-flex justify-content-center align-content-center '>
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
                    </div>
                )
                : (
                    <div className="container">
                        <div>
                            <div className='component-header position-relative py-2 px-4 text-main fw-bold font-sm'>Our Products</div>
                            <h5 className='fw-bold my-4'>Explore Our Products</h5>
                        </div>

                        <div className="row gy-4">
                            {data?.data.data.filter((product) => product.title.split(' ').slice(0, 4).join(' ').toLowerCase().includes(searchKeyword.toLowerCase()))
                                .map((product) => <div key={product.id} className='col-md-2 d-flex'>
                                    <div className='bg-main-light product d-flex flex-column p-2 rounded position-relative'>

                                        <LazyLoadImage
                                            src={product.imageCover ? product.imageCover : placeholder}
                                            className='w-100'
                                            effect='blur'
                                            placeholderSrc={placeholder}
                                            alt={product.title}
                                        />
                                        <span className='text-main fw-bold'>{product.category.name}</span>
                                        <h3 className='h6 fw-bolder'>{product.title.split(' ').slice(0, 4).join(' ')}</h3>

                                        <div className='d-flex justify-content-between flex-grow-1 '>
                                            <span className='fw-medium'>{product.price} Egp</span>
                                            <span><i className='fa-solid fa-star rating-color'></i>{product.ratingsAverage}</span>
                                        </div>

                                        <div className='d-flex justify-content-center justify-content-xl-between flex-wrap gap-3 my-3'>
                                            <Link to={`productdetails/${product.id}`} className='btn btn-sm bg-main-outline fw-medium flex-grow-1 fw-bold '>More Details</Link>
                                            <button className='btn btn-sm bg-main text-white flex-grow-1' onClick={() => dispatch(addProductToCart({ id: product.id, userToken }))} ><i className='fa-solid fa-shopping-cart'></i></button>
                                        </div>



                                        {wishAdded?.includes(product.id)
                                            ? (
                                                <button className='position-absolute btn text-main p-0' style={{ top: "10px", right: "10px" }} onClick={() => dispatch(removeProductFromWishlist({ id: product.id, userToken }))} ><i className='fa-solid fa-heart fa-xl'></i></button>
                                            )
                                            : (
                                                <button className='position-absolute btn text-main p-0' style={{ top: "10px", right: "10px" }} onClick={() => dispatch(addProductToWishlist({ id: product.id, userToken }))} ><i className='fa-regular fa-heart fa-xl'></i></button>
                                            )

                                        }



                                    </div>
                                </div>
                                )}
                        </div>

                        <div className='text-center'>
                            <Link to={'/products'} className='btn bg-main text-white mt-3'>View All Products</Link>
                        </div>

                    </div>
                )
            }

            {isPending || isLoading
                ? (
                    <div id="loading-screen">
                        <i className="fa-solid fa-spinner fa-spin fa-4x"></i>
                    </div>
                )
                : ""
            }



        </section >


    </>
}
