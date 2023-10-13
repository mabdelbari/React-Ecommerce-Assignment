import React from 'react';
import styles from './Notfound.module.css';
import notFoundImg from '../../Assets/images/error.svg'
import { Helmet } from 'react-helmet';

export default function Notfound() {
    return <>
        <Helmet>
            <title>404 Not Found - FreshCart</title>
        </Helmet>
        <section id='notFound' className='py-4' >
            <div className="container my-5 text-center">
                <img src={notFoundImg} alt="404 Error Image" />
            </div>
        </section>
    </>
}
