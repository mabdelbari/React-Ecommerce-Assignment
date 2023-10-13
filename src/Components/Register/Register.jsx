import React from 'react';
import styles from './Register.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerPending, registerSuccess, registerFail } from '../../Redux/userRegistrationSlice';
import { Helmet } from 'react-helmet';



export default function Register() {

    let navigate = useNavigate();

    let dispatch = useDispatch();

    const { isPending } = useSelector((store) => store.userRegistrationReducer)

    async function createAccount(values) {
        dispatch(registerPending());
        try {
            const { data } = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signup', values)
            if (data.message === "success") {
                dispatch(registerSuccess("Account has been successfully created"));
                navigate('/login');
            }
        } catch (error) {
            if (error.response) {
                dispatch(registerFail(error.response.data.message))
            } else if (error.request) {
                dispatch(registerFail(error.request))
            } else {
                dispatch(registerFail(error.message))
            }

        }
    }
    const nameRegex = /^[a-z]{2,}(?:\s[a-z]{2,})*$/i;
    const PassRegex = /^(?=(?:.*?[0-9]){2})(?=(?:.*?[a-z]){2})(?=(?:.*?[A-Z]){2})(?=(?:.*?[^a-zA-Z0-9]){2})(?!.*\s).{8,30}$/;
    const phoneRegex = /\+?\d{0,2}\s?1?-?(\d{1,3})?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;

    let validationSchema = Yup.object({
        name: Yup.string()
            .matches(nameRegex, 'Your name should be atleast two letter without special characters or numbers')
            .required('Name  is required'),
        email: Yup.string()
            .email('Email not valid *example@yyy.zzz')
            .required('Email is required'),
        password: Yup.string()
            .matches(PassRegex, 'Password must contain at least two uppercase, two lowercase, two digits, two special characters and with no whitespaces')
            .required('Password is required'),
        rePassword: Yup.string()
            .oneOf([Yup.ref("password")], `Password doesn't match`)
            .required('rePassword is required'),
        phone: Yup.string()
            .matches(phoneRegex, 'Invalid phone number')
            .required('Phone is required')
    })

    let formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            rePassword: '',
            phone: '',
        }, validationSchema,
        onSubmit: createAccount
    })

    return <>
        <Helmet>
            <title>Signup - FreshCart</title>
        </Helmet>

        <section id='register' className='py-4 my-5'>
            <div className="container">
                <h3 className='text-center'>Create an account</h3>
                <form className='w-75 mx-auto' onSubmit={formik.handleSubmit}>

                    <label htmlFor="name">Name:</label>
                    <input className='form-control mb-3 mt-1 border-main' value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} type="text" name='name' id='name' />
                    {formik.touched.name && formik.errors.name ? <div className='alert alert-danger p-2'>{formik.errors.name}</div> : null}

                    <label htmlFor="email">Email:</label>
                    <input className='form-control mb-3 mt-1 border-main' value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} type="email" name='email' id='email' />
                    {formik.errors.email && formik.touched.email ? <div className='alert alert-danger p-2'>{formik.errors.email}</div> : null}

                    <label htmlFor="password">Password:</label>
                    <input className='form-control mb-3 mt-1 border-main' value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} type="password" name='password' id='password' />
                    {formik.errors.password && formik.touched.password ? <div className='alert alert-danger p-2'>{formik.errors.password}</div> : null}

                    <label htmlFor="rePassword">rePassword:</label>
                    <input className='form-control mb-3 mt-1 border-main' value={formik.values.rePassword} onChange={formik.handleChange} onBlur={formik.handleBlur} type="password" name='rePassword' id='rePassword' />
                    {formik.errors.rePassword && formik.touched.rePassword ? <div className='alert alert-danger p-2'>{formik.errors.rePassword}</div> : null}

                    <label htmlFor="phone">Phone:</label>
                    <input className='form-control mb-3 mt-1 border-main' value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur} type="tel" name='phone' id='phone' />
                    {formik.errors.phone && formik.touched.phone ? <div className='alert alert-danger p-2'>{formik.errors.phone}</div> : null}

                    {isPending ?
                        <button type='button' disabled={true} className='btn bg-main d-block ms-auto text-white'><i className='fa-solid fa-spinner fa-spin px-4'></i></button> :
                        <button type='submit' disabled={!(formik.dirty && formik.isValid)} className='btn bg-main d-block ms-auto text-white'>Register</button>
                    }
                </form>
            </div>
        </section>
    </>
}