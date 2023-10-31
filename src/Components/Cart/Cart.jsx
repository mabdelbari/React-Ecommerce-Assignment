import React, { useEffect, useState } from 'react';
import styles from './Cart.module.css';
import { TailSpin } from 'react-loader-spinner';
import { Link, useNavigate } from 'react-router-dom';
import { getLoggedUserCart, deleteSpecificProduct, updateProductQuantity, checkoutCart } from '../../Redux/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Backdrop, Box, Fade, Modal } from '@mui/material';
import * as Yup from 'yup'
import { Helmet } from 'react-helmet';


export default function Cart() {

    let navigate = useNavigate();
    const dispatch = useDispatch();

    const { userToken } = useSelector((store) => store.authReducer);
    const { data, error, isPending } = useSelector((store) => store.cartReducer)

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #fef',
        borderRadius: "10px",
        boxShadow: 20,
        p: 2,
    };

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        formik.setValues(formik.initialValues)
    }


    const phoneRegex = /\+?\d{0,2}\s?1?-?(\d{1,3})?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{5}/;
    const validationSchema = Yup.object({
        details: Yup.string().min(5).required(),
        phone: Yup.string()
            .matches(phoneRegex, 'Invalid phone number')
            .required('Phone is required'),
        city: Yup.string().min(2).required()
    })

    const formik = useFormik({
        initialValues: {
            details: '',
            phone: '',
            city: ''
        },
        validationSchema,
        onSubmit: (values) => {
            dispatch(checkoutCart({ values, cartId: data.data._id, url: `${window.location.hostname === "localhost" ? "http://localhost:3000/account" : `http://${window.location.hostname}/account`}`, userToken }))
        }
    })

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
            }


            {isPending
                ?
                <div id="loading-screen">
                    <i className="fa-solid fa-spinner fa-spin fa-4x"></i>
                </div>
                : null
            }
        </section>


        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <Box sx={modalStyle}>
                    <div className='d-flex justify-content-between align-items-center  '>
                        <h2>Add Address</h2>
                        <button onClick={handleClose} className='btn'><i className="fa-solid fa-xmark fa-xl"></i></button>
                    </div>
                    <div>
                        <form onSubmit={formik.handleSubmit}>

                            <label htmlFor="details">Address</label>
                            <input type="text" className='form-control mb-3 mt-1' value={formik.values.details} onChange={formik.handleChange} name="details" id="details" placeholder="Street name" />

                            <label htmlFor="phone">Phone</label>
                            <input type="tel" className='form-control mb-3 mt-1' value={formik.values.phone} onChange={formik.handleChange} name="phone" id="phone" placeholder="Phone" />

                            <label htmlFor="city">City</label>
                            <input type="text" className='form-control mb-3 mt-1' value={formik.values.city} onChange={formik.handleChange} name="city" id="city" placeholder="City" />

                            {
                                isPending ?
                                    <button type='button' className='btn bg-main d-block w-100 text-white'><i className='fa-solid fa-spinner fa-spin px-4'></i></button> :
                                    <button disabled={!(formik.dirty && formik.isValid)} type='submit' className='btn bg-main text-white w-100 d-block'>Continue to Payment</button>
                            }

                        </form>
                    </div>
                </Box>
            </Fade>
        </Modal>
    </>
}
