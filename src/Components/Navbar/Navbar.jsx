import React, { useEffect } from 'react';
import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';
import logo from '../../Assets/images/freshcart-logo.svg'
import { useDispatch, useSelector } from 'react-redux';
import { setUserToken } from '../../Redux/authSlice';
import { setNumOfItems, getLoggedUserCart } from '../../Redux/cartSlice';
import { getLoggedUserWishlist, setNumOfWishItems } from '../../Redux/wishlistSlice';

export default function Navbar() {

    const dispatch = useDispatch();

    let { numOfItems } = useSelector((store) => store.cartReducer);
    let { numOfWishItems } = useSelector((store) => store.wishlistReducer);
    const { userToken } = useSelector((store) => store.authReducer);


    function logOut() {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('numOfItems');
        localStorage.removeItem('numOfWishItems');
        dispatch(setNumOfItems(0));
        dispatch(setNumOfWishItems(0));
        dispatch(setUserToken(null));
    }

    useEffect(() => {
        if (userToken) {
            dispatch(getLoggedUserCart(userToken))
            dispatch(getLoggedUserWishlist(userToken))
        }
        // eslint-disable-next-line
    }, [userToken])

    return <>
        <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src={logo} alt="Freshcart logo" />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {userToken ?
                        <>
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                                <li className="nav-item">
                                    <Link className="nav-link text-black" to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-black" to="/products">Our Store</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-black" to="#">About</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-black" to="#">Contact</Link>
                                </li>
                            </ul>
                        </> : null}
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item d-flex align-items-center ">
                            <i className="fab fa-instagram mx-2"></i>
                            <i className="fab fa-facebook mx-2"></i>
                            <i className="fab fa-tiktok mx-2"></i>
                            <i className="fab fa-twitter mx-2"></i>
                            <i className="fab fa-linkedin mx-2"></i>
                            <i className="fab fa-youtube mx-2"></i>
                        </li>
                        {userToken ? <>
                            <li className="nav-item">
                                <Link className="nav-link text-black" to="/account"><i className="fa-regular fa-user fa-lg text-main"></i></Link>
                            </li>
                            <li className="nav-item" tooltip="Hi" >
                                <Link className="nav-link position-relative " to="/account/wishlist">
                                    <i className='fa-regular fa-heart fa-lg text-main'></i>
                                    <span className={`${styles.wishListSpan}`}>{numOfWishItems}</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link position-relative " to="/cart">
                                    <i className='fa-solid fa-cart-shopping fa-lg text-main'></i>
                                    <span className={`${styles.cartSpan}`}>{numOfItems}</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-black" onClick={() => logOut()} to="/login">Logout</Link>
                            </li>
                        </> :
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-black" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-black" to="/register">Register</Link>
                                </li>
                            </>}
                    </ul>
                </div>
            </div>
        </nav>

    </>
}
