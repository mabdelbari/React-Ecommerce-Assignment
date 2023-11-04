import React, { useEffect, useState } from 'react';
import styles from './Cart.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { getLoggedUserCart, deleteSpecificProduct, updateProductQuantity, checkoutCart } from '../../Redux/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import Loading from '../Loading/Loading';
import Checkout from '../Checkout/Checkout';


export default function Cart() {

    let navigate = useNavigate();
    const dispatch = useDispatch();

    const { userToken } = useSelector((store) => store.authReducer);
    const { data, error, isPending } = useSelector((store) => store.cartReducer)

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);

    useEffect(() => {
        dispatch(getLoggedUserCart(userToken));
        window.scrollTo(0, 0);
    }, [])

    return <>
        <Helmet>
            <title>Cart - FreshCart</title>
        </Helmet>


        <section id='cart' className='py-4 my-5'>
            {data?.data || !isPending ?
                <div className="container">
                    <div className="cart-title text-center my-5">
                        <h6 className='h3'>Shopping Cart</h6>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb justify-content-center">
                                <li className="breadcrumb-item"><Link to="/"><i className='fa-solid fa-house me-2'></i>Home</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Shoppping Cart</li>
                            </ol>
                        </nav>
                    </div>
                    <div className={`${styles.cartContent} cart-content `}>
                        <div className="row gx-0">
                            <div className="col-md-8">
                                {data && error === null ? (data?.numOfCartItems === 0 ? <h6 className='text-center' style={{ height: '50vh' }} >Your shopping cart is empty!</h6> : <>
                                    {data.data.products.map((product, index) => <div key={product.product._id || index} className='row gx-0 px-2 border-bottom border-2'>
                                        <div className="col-md-1">
                                            <img src={product.product.imageCover} className='w-100' alt={product.product.title} />
                                        </div>
                                        <div className="col-md-11 p-3">
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <div className='font-sm'>
                                                    <h3 className='h6 fw-bold'>{product.product.title}</h3>
                                                    <span className='text-main fw-bold'>Unit Price: </span><span>{product.price} EGP</span><br />
                                                    <span className='text-main fw-bold'>subTotal: </span><span>{product.price * product.count} EGP</span>
                                                </div>

                                                <div className='stepper d-flex flex-column align-items-center'>
                                                    <div className='d-flex align-items-center '>
                                                        <button disabled={product.count === 1} onClick={() => dispatch(updateProductQuantity({ id: product.product._id, quantity: product.count - 1, userToken }))} className='btn bg-main-outline fw-bold btn-sm'>-</button>
                                                        <span className='mx-3'>{product.count}</span>
                                                        <button onClick={() => dispatch(updateProductQuantity({ id: product.product._id, quantity: product.count + 1, userToken }))} className='btn bg-main-outline fw-bold btn-sm'>+</button>
                                                    </div>


                                                    <button onClick={() => dispatch(deleteSpecificProduct({ id: product.product._id, userToken }))} className='btn btn-outline-danger btn-sm mt-2 w-100'>Remove</button>


                                                </div>
                                            </div>
                                        </div>
                                    </div>)}</>
                                ) : <h6 className='text-center' style={{ height: '50vh' }} >Your shopping cart is empty!</h6>
                                }
                            </div>
                            <div className="col-md-4">
                                <div className='summary mx-3 bg-main-light rounded p-4 d-flex flex-column row-gap-3 font-sm'>
                                    <h6 className='fw-bold'>Summary</h6>
                                    <div className='d-flex justify-content-between'>
                                        <span>item(s)</span>
                                        <span className='fw-bold'>{data?.numOfCartItems || 0}</span>
                                    </div>
                                    <div className='d-flex justify-content-between '>
                                        <span>Est. Total</span>
                                        <span className='fw-bold'>{data?.data.totalCartPrice || 0} EGP</span>
                                    </div>
                                    <button onClick={() => navigate('/')} className='btn btn-outline-dark font-sm'>Continue Shopping</button>

                                    {(error === null && data?.numOfCartItems !== 0) ? <button type='button' className='btn btn-dark font-sm' onClick={handleOpen}>Checkout</button> : null}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : <div className='w-100 vh-100 py-5 d-flex justify-content-center align-content-center '>
                    <Loading />
                </div>
            }
        </section>


        <Checkout data={data}
            isPending={isPending}
            userToken={userToken}
            checkoutCart={checkoutCart}
            open={open}
            setOpen={setOpen}
        />
    </>
}
