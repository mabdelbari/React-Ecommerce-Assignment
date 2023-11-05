import React from 'react';
import styles from './CategorySlider.module.css';
import { useQuery } from 'react-query';
import axios from 'axios';
import Slider from 'react-slick';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import placeholder from '../../Assets/images/placeholder2.jpg'
import { Link } from 'react-router-dom';
import Loading from '../Loading/Loading';


export default function CategorySlider() {

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        slidesToShow: 7,
        slidesToScroll: 7,
        arrows: false,
        draggable: false
    }

    let { isLoading, isError, data } = useQuery('categorySlider', () => axios.get('https://ecommerce.routemisr.com/api/v1/categories'));

    return <>
        {isLoading
            ? <Loading />
            : data?.data.data && !isError 
                ? <section id='categorySlider' className='my-4'>
                    <div className="container">

                        <div>
                            <div className='component-header position-relative py-2 px-4 text-main fw-bold font-sm'>Categories</div>
                            <h5 className='fw-bold my-4'>Browse By Category</h5>
                        </div>



                        <Slider {...settings}>
                            {data?.data.data.map((category) => <Link className='px-2 text-center' key={category._id} to={`products/${category._id}`}>
                                <LazyLoadImage src={category.image}
                                    alt={`${category.name} slide image`}
                                    height={200}
                                    className='w-100 rounded'
                                    effect='blur'
                                    placeholderSrc={placeholder}
                                />
                                <h3 className='h6 mt-2 fw-bold font-sm'>{category.name}</h3>
                            </Link>)
                            }
                        </Slider>
                    </div>
                </section>
                : null
        }


    </>
}
