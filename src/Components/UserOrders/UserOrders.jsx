import React, { useEffect, useState } from 'react';
import styles from './UserOrders.module.css';
import { useQuery } from 'react-query';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';
import { useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';



export default function UserOrders() {

    const { userToken } = useSelector((store) => store.authReducer);

    const decodedToken = jwtDecode(userToken);

    const [isShown, setIsShown] = useState(false);
    const [filteredOrder, setFilteredOrder] = useState(null);

    const handleShow = (id) => {
        setFilteredOrder(data?.data.filter((order) => order.id == id));
        setIsShown(true);
    }
    const handleHide = () => setIsShown(false);



    const { isLoading, data } = useQuery('UserOrders', () => axios.get(`https://ecommerce.routemisr.com/api/v1/orders/user/${decodedToken?.id}`));

    return <>
        <Helmet>
            <title>My Orders - Account - FreshCart</title>
        </Helmet>

        {isLoading
            ? <div id="loading-screen">
                <i className="fa-solid fa-spinner fa-spin fa-4x"></i>
            </div>
            : !isShown
                ? data?.data.length === 0
                    ?
                    <div>
                        <h6 className='text-center mb-4'>Your order history is empty!</h6>
                        <Link className='btn btn-dark w-100' to={'/account'}>Continue</Link>
                    </div>
                    :
                    <div className='table-responsive'>
                        <table className="table table-bordered text-center">
                            <thead>
                                <tr>
                                    <th scope="col" className='bg-main-light'>Order ID</th>
                                    <th scope="col" className='bg-main-light'>Customer</th>
                                    <th scope="col" className='bg-main-light'>Num Of Products</th>
                                    <th scope="col" className='bg-main-light'>Status</th>
                                    <th scope="col" className='bg-main-light'>Total</th>
                                    <th scope="col" className='bg-main-light'>Date Added</th>
                                    <th scope='col' className='bg-main-light'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.data.map((order) => <tr key={order.id}>
                                    <td className='align-middle font-sm'>#{order.id}</td>
                                    <td className='align-middle font-sm'>{order.user.name}</td>
                                    <td className='align-middle font-sm'>{order.cartItems.length}</td>
                                    <td className='align-middle font-sm'>{order.isDelivered ? "Shipped" : "Pending"}</td>
                                    <td className='align-middle font-sm'>{order.totalOrderPrice} EGP</td>
                                    <td className='align-middle font-sm'>{order.paidAt.slice(0, 10)}</td>
                                    <td className='align-middle font-sm'><button className="btn bg-dark-subtle btn-sm" onClick={() => handleShow(order.id)}><i className='fa-regular fa-eye'></i></button></td>
                                </tr>)}
                            </tbody>
                        </table>
                    </div>
                :
                <>
                    <div className='table-responsive'>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col" className='bg-main-light w-50'>Order Details</th>
                                    <th scope="col" className='bg-main-light w-50'>Shipping Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td >
                                        <div className='d-flex flex-column '>
                                            <span><span className='fw-bold'>Order ID: </span>#{filteredOrder[0].id}</span>
                                            <span><span className='fw-bold'>Order Date: </span>{filteredOrder[0].paidAt.slice(0, 10)}</span>
                                            <span><span className='fw-bold'>Order Status: </span>{filteredOrder[0].isDelivered ? "Shipped" : "Pending"}</span>
                                        </div>
                                    </td>
                                    <td >
                                        <div className='d-flex flex-column '>
                                            <span>{filteredOrder[0].user.name}</span>
                                            <span>{filteredOrder[0].shippingAddress.details}</span>
                                            <span>{filteredOrder[0].shippingAddress.city}</span>
                                            <span>{filteredOrder[0].shippingAddress.phone}</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table >
                    </div>

                    <div className='table-responsive'>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col" className='bg-main-light'>Product Name</th>
                                    <th scope="col" className='bg-main-light'>Quantity</th>
                                    <th scope="col" className='bg-main-light'>Unit Price</th>
                                    <th scope="col" className='bg-main-light'>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrder[0].cartItems.map((product) => <tr key={product.product.id}>
                                    <td>{product.product.title}</td>
                                    <td>{product.count}</td>
                                    <td>{product.price}</td>
                                    <td>{product.price * product.count}</td>
                                </tr>)}
                                <tr>
                                    <td className='bg-main-light' colSpan={2}></td>
                                    <td className='bg-main-light fw-bold'>Total</td>
                                    <td className='bg-main-light'>{filteredOrder[0].totalOrderPrice}</td>
                                </tr>
                            </tbody>
                        </table >
                    </div>
                    <button className='btn btn-outline-dark w-100' onClick={() => handleHide()}>Go Back</button>
                </>
        }
    </>
}
