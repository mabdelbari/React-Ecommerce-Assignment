import React from 'react';
import styles from './Account.module.css';
import { Link, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export default function Account() {
    return <>
        <Helmet>
            <title>Account - FreshCart</title>
        </Helmet>


        <section id='cart' className='py-4 my-5'>
            <div className="container">
                <div className="cart-title text-center my-5">
                    <h6 className='h3 fw-bold'>My Account</h6>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center">
                            <li className="breadcrumb-item"><Link to="/"><i className='fa-solid fa-house me-2'></i>Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Account</li>
                        </ol>
                    </nav>
                </div>
                <div>
                    <div className="row gx-0 gy-4">
                        <div className="col-md-8">
                            <Outlet></Outlet>
                        </div>
                        <div className="col-md-4">
                            <div className='summary mx-3 bg-main-light rounded p-4 d-flex flex-column row-gap-3 '>
                                <h4 className='h6 fw-bold'>My Account</h4>
                                <ul className='list-unstyled d-flex flex-column row-gap-3 font-sm'>
                                    <li><Link to="">My Profile</Link></li>
                                    <li><Link to="allorders">My Orders</Link></li>
                                    <li><Link to="wishlist">My Wishlist</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
}
