import React, { useContext, useEffect } from 'react';
import styles from './Layout.module.css';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { setUserToken } from '../../Redux/authSlice'
import { useDispatch } from 'react-redux';
import { setNumOfItems } from '../../Redux/cartSlice';


export default function Layout() {

    return <>
        <Navbar />
        <Outlet />
        <Footer />
    </>
}
