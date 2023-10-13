import React from 'react';
import styles from './Footer.module.css';
import amazonPayImg from '../../Assets/images/Amazon_Pay_logo.svg'
import americanExpressImg from '../../Assets/images/american_express.png'
import masterCardImg from '../../Assets/images/MasterCard_Logo.svg.webp'
import paypalImg from '../../Assets/images/PayPal.svg.png'
import googleplayImg from '../../Assets/images/google-play-badge.png'
import appStoreImg from '../../Assets/images/app-store.png'

export default function Footer() {
    return <>
        <footer className='bg-main-light pt-4 '>
            <div className="container">
                <h4>Get the FreshCart App</h4>
                <span>We will send you a link, open it on your phone to download the app</span>

                <form>
                    <div className="row my-3 gy-3">
                        <div className="col-md-10 ps-5">
                            <input className='form-control h-100 border-main' type="email" placeholder='Email ..' name='email' />
                        </div>
                        <div className="col-md-2">
                            <button className='btn bg-main text-white'>Share App Link</button>
                        </div>
                    </div>
                </form>

                <div className='d-flex justify-content-between flex-wrap  '>
                    <div className='d-flex align-items-center column-gap-3  '>
                        <span className='font-sm fw-bold'>Payment Partners </span>
                        <img src={amazonPayImg} width={60} alt="" />
                        <img src={americanExpressImg} width={60} alt="" />
                        <img src={masterCardImg} width={60} alt="" />
                        <img src={paypalImg} width={60} alt="" />
                    </div>
                    <div className='d-flex align-items-center column-gap-3  '>
                        <span className='font-sm fw-bold'>Get deliveries with FreshCart</span>
                        <img src={appStoreImg} width={80} alt="" />
                        <img src={googleplayImg} width={80} alt="" />
                    </div>
                </div>
            </div>
            <h6 className='font-sm text-center bg-dark text-white-50 m-0 p-2'>Copyright © 2023 All Rights Reserved.</h6>
        </footer>
    </>
}
