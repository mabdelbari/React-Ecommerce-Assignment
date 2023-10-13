import React, { useEffect } from 'react';
import styles from './Login.module.css'
import { useFormik } from 'formik';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { authPending, authSuccess, authFail } from '../../Redux/authSlice';
import { Helmet } from 'react-helmet';


export default function Login() {

    let navigate = useNavigate();
    let dispatch = useDispatch();

    const { isPending } = useSelector((store) => store.authReducer)

    async function login(values) {
        dispatch(authPending());
        try {
            const { data } = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signin', values);
            if (data?.message === "success") {
                dispatch(authSuccess(data));
                navigate('/');
            }
        } catch (error) {
            if (error?.response) dispatch(authFail(error?.response.data.message))
            else if (error?.request) dispatch(authFail(error?.request))
            else dispatch(authFail(error?.message))
        }
    }

    let validationSchema = Yup.object({
        email: Yup.string().email('Email is not valid *example@yyy.zzz').required('Email is required'),
        password: Yup.string().required('Password is required')
    })


    let formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        }, validationSchema,
        onSubmit: login
    })

    return <>

        <Helmet>
            <title>Login - FreshCart</title>
        </Helmet>

        <section id='login' className={`py-4 vh-100`}>
            <div className="container my-5">
                <div className="row gy-3">
                    <div className='col-md-6'>
                        <div className="currentCustomer bg-main-light rounded p-4">
                            <h3 className='mb-5'>Login Now</h3>
                            <form onSubmit={formik.handleSubmit}>

                                <label htmlFor="email">Email:</label>
                                <input className={`form-control mb-3 mt-1 border-main`} value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} type="email" name='email' id='email' placeholder='E-Mail Address' />
                                {formik.errors.email && formik.touched.email ? <div className='alert alert-danger p-2'>{formik.errors.email}</div> : null}

                                <label htmlFor="password">Password:</label>
                                <input className={`form-control mb-3 mt-1 border-main`} value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} type="password" name='password' id='password' placeholder='Password' autoComplete="on" />
                                {formik.errors.password && formik.touched.password ? <div className='alert alert-danger p-2'>{formik.errors.password}</div> : null}

                                <Link className='nav-link mb-3' to={'/forgetpassword'}>Forget Password?</Link>

                                {isPending ?
                                    <button type='button' className='btn bg-main d-block w-100 text-white'><i className='fa-solid fa-spinner fa-spin px-4'></i></button> :
                                    <button type='submit' disabled={!(formik.dirty && formik.isValid)} className='btn bg-main d-block w-100 text-white rounded-pill'>Login</button>
                                }
                            </form>
                        </div>


                    </div>

                    <div className='col-md-6 d-flex'>
                        <div className="newCustomer bg-main-light rounded p-4 d-flex flex-column justify-content-between ">
                            <div>
                                <h3 className='mb-5'>New Customer</h3>

                                <p>By creating an account, you will be able to shop faster, check items in your cart, and make payments easily</p>
                            </div>

                            <Link to={'/register'} className='btn bg-main rounded-pill d-block w-100 text-white'>Continue</Link>
                        </div>
                    </div>
                </div>
            </div>

        </section>

    </>
}
