import React from 'react';
import styles from './MainSlider.module.css';
import Slider from 'react-slick';
import slide1 from '../../Assets/images/slider-image-1.jpeg'
import slide2 from '../../Assets/images/slider-image-2.jpeg'
import slide3 from '../../Assets/images/slider-image-3.jpeg'
import blog1 from '../../Assets/images/blog-img-1.jpeg'
import blog2 from '../../Assets/images/blog-img-2.jpeg'


export default function MainSlider() {

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        className: 'h-100',
        dotsClass: 'slick-dots bottom-0',
        arrows: false
    };


    return <>
        <section id='mainSlider' className='py-4 my-5'>
            <div className="container">
                <div className="row gy-3">
                    <div className="col-md-9">
                        <Slider {...settings}>
                            <img src={slide1} className='w-100 rounded-3' height={450} alt={'Slider Image 1'} />
                            <img src={slide2} className='w-100 rounded-3' height={450} alt={'Slider Image 2'} />
                            <img src={slide3} className='w-100 rounded-3' height={450} alt={'Slider Image 3'} />
                        </Slider>
                    </div>
                    <div className="col-md-3 d-flex flex-column justify-content-between row-gap-2">
                        <img src={blog1} className='w-100 rounded-3' height={220} alt="Blog Image 1" />
                        <img src={blog2} className='w-100 rounded-3' height={220} alt="Blog Image 2" />
                    </div>
                </div>
            </div>
        </section>
    </>
}
