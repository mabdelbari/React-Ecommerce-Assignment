import React, { useEffect, useState } from 'react';
import styles from './Products.module.css';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import placeholder from '../../Assets/images/placeholder2.jpg'
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToCart } from '../../Redux/cartSlice';
import { addProductToWishlist, removeProductFromWishlist } from '../../Redux/wishlistSlice';
import { Helmet } from 'react-helmet';
import Loading from '../Loading/Loading';



export default function Products() {

    const dispatch = useDispatch();
    const urlParams = useParams();

    const [page, setPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState("");

    const { userToken } = useSelector((store) => store.authReducer)
    const { isPending: cartIsLoading } = useSelector((store) => store.cartReducer)
    const { wishAdded, isPending } = useSelector((store) => store.wishlistReducer)

    let { isLoading, data, refetch } = useQuery({
        queryKey: ['ourStoreProducts', page],
        queryFn: () => axios.get(`https://ecommerce.routemisr.com/api/v1/products?${urlParams?.id ? `category=${urlParams?.id}` : ""}&page=${page}`),
        cacheTime: 600000,
        refetchOnMount: true,
        staleTime: 300000,
        refetchInterval: 120000
    })

    const handleChange = (e) => {
        setSearchKeyword(e.target.value);
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [page])

    useEffect(() => {
        refetch();
        window.scrollTo(0, 0);
    }, [])

    return <>

        <Helmet>
            <title>Store - FreshCart</title>
        </Helmet>

        <section id='featuredProducts' className='py-4 my-5'>

            {isLoading
                ? (
                    <Loading />
                )
                : (
                    <div className="container">
                        <div>
                            <div className='component-header position-relative py-2 px-4 text-main fw-bold font-sm'>Our Products</div>
                            <h5 className='fw-bold my-4'>Explore Our Products</h5>
                        </div>

                        <div className='search-form my-4'>
                            <input type="text" onChange={handleChange} className='form-control w-50 mx-auto border-main' placeholder="what are you looking for?" />
                        </div>

                        <div className="row gy-4">
                            {data?.data.data.filter((product) => product.title.split(' ').slice(0, 4).join(' ').toLowerCase().includes(searchKeyword.toLowerCase()))
                                .map((product) => <div key={product.id} className='col-md-2 d-flex'>
                                    <div className='bg-main-light product d-flex flex-grow-1 flex-column p-2 rounded position-relative'>
                                        <LazyLoadImage
                                            src={product.imageCover ? product.imageCover : placeholder}
                                            className='w-100 mb-3'
                                            style={{ minHeight: 100 }}
                                            effect='blur'
                                            placeholderSrc={placeholder}
                                            alt={product.title}
                                        />
                                        <h3 className='h6 fw-bolder font-sm'>{product.title.split(' ').slice(0, 4).join(' ')}</h3>

                                        <div className='d-flex justify-content-between flex-grow-1 '>
                                            <span className='fw-medium'>{product.price} Egp</span>
                                            <span><i className='fa-solid fa-star rating-color'></i>{product.ratingsAverage}</span>
                                        </div>

                                        <div className='d-flex justify-content-center justify-content-xl-between flex-wrap gap-3 my-3'>
                                            <Link to={`/productdetails/${product.id}`} className='btn btn-sm bg-main-outline fw-medium flex-grow-1 fw-bold '>More Details</Link>
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
                    </div>
                )
            }

            {data?.data.data.length !== 0
                ? <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-center mt-3">
                        <li className={`${data?.data.metadata.currentPage === 1 ? "disabled" : ""} page-item`}>
                            <button
                                onClick={() => { setPage((current) => current - 1) }}
                                className="page-link">
                                <span aria-hidden="true">&laquo;</span>
                            </button>
                        </li>


                        {
                            ((numOfPages) => {
                                let li = [];

                                if (numOfPages > 5) {
                                    for (let i = 1; i <= 5; i++) {
                                        li.push(<li key={i} className="page-item"><button onClick={() => { setPage(i) }} className="page-link">{i}</button></li>);
                                    }
                                    li.push(<li key={6} className="page-item"><button disabled className="page-link" >...</button></li>)

                                    return li
                                }

                                for (let i = 1; i <= numOfPages; i++) {
                                    li.push(<li key={i} className={`${i === page ? "active" : ""} page-item`}><button onClick={() => { setPage(i) }} className="page-link">{i}</button></li>);
                                }
                                return li;

                            })(data?.data.metadata.numberOfPages)
                        }


                        <li className={`${data?.data.metadata.currentPage === data?.data.metadata.numberOfPages ? "disabled" : ""} page-item`}>
                            <button
                                onClick={() => { setPage((current) => current + 1) }}
                                className="page-link">
                                <span aria-hidden="true">&raquo;</span>
                            </button>
                        </li>
                    </ul>
                </nav>
                : <h4 className='text-center mt-5'>No Products In this Category</h4>
            }

            {isPending || cartIsLoading ? (<Loading />) : ""}
        </section >

    </>
}
