import React, { useContext, useEffect } from 'react';
import styles from './Home.module.css';
import FeaturedProducts from '../FeaturedProducts/FeaturedProducts';
import MainSlider from '../MainSlider/MainSlider';
import CategorySlider from '../CategorySlider/CategorySlider';
import { Helmet } from 'react-helmet';

export default function Home() {



    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return <>
        <Helmet>
            <title>Home - FreshCart</title>
        </Helmet>


        <MainSlider></MainSlider>
        <CategorySlider></CategorySlider>
        <FeaturedProducts></FeaturedProducts>
    </>
}
