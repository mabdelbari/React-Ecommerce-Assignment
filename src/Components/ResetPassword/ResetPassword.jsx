import React, { useEffect, useState } from 'react';
import styles from './ResetPassword.module.css';
import { Navigate, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup'
import { toast } from 'react-toastify';


export default function ResetPassword() {

    let navigate = useNavigate()
    const [isPending, setIsPending] = useState(false);

    const toastSettings = {
        autoClose: 2000,
        theme: 'colored'
    }

    const resetPassword = async (values) => {
        setIsPending(true)
        try {
            const { data } = await axios.put('https://ecommerce.routemisr.com/api/v1/auth/resetPassword', values)
            setIsPending(false);
            navigate('/login')
            toast.success("Your password has been reset successfully. Please Login to access your Account", toastSettings)
            
        } catch (error) {
            setIsPending(false);
            if (error?.response) {
                toast.error(error?.response?.data?.errors?.msg || error?.response?.data?.message, toastSettings);
            } else {
                toast.error(error?.message, toastSettings);
            }

        }
    }


    const PassRegex = /^(?=(?:.*?[0-9]){2})(?=(?:.*?[a-z]){2})(?=(?:.*?[A-Z]){2})(?=(?:.*?[^a-zA-Z0-9]){2})(?!.*\s).{8,30}$/;

    let validationSchema = Yup.object({
        email: Yup.string().email('Email is not valid *example@yyy.zzz').required('Email is required'),
        newPassword: Yup.string()
            .matches(PassRegex, 'Password must contain at least two uppercase, two lowercase, two digits, two special characters and with no whitespaces')
            .required('Password is required'),
    })


    let formik = useFormik({
        initialValues: {
            email: sessionStorage.getItem('emailSent'),
            newPassword: ''
        }, validationSchema,
        onSubmit: resetPassword,
        validateOnChange: false,
        validateOnBlur: false
    })

    useEffect(() => {
        if (!sessionStorage.getItem('isCodeVerified')) navigate('/login')

        return () => {
            sessionStorage.removeItem('isCodeVerified');
        }
    }, [])

    return <>
        <section id='login' className={`py-4 vh-100`}>
            <div className="container my-5">
                <div className="row gy-3">
                    <div className='col-md-12'>
                        <div className="currentCustomer bg-main-light rounded p-4">
                            <h3 className='mb-2 text-center'>Reset Your Password</h3>

                            <form onSubmit={formik.handleSubmit}>

                                {!formik.isValid
                                    ?
                                    <div className='alert alert-danger p-2'>
                                        <ul className='m-0'>
                                            {formik.errors.newPassword && formik.touched.newPassword ? <li>{formik.errors.newPassword}</li> : ""}
                                        </ul>
                                    </div>
                                    : null}

                                <div className="row align-items-center mb-3">
                                    <div className="col-md-4">
                                        <label htmlFor="newPassword">New Password:</label>
                                    </div>
                                    <div className="col-md-8">
                                        <input className='form-control mt-1 border-main' value={formik.values.newPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} type="password" name='newPassword' id='newPassword' />
                                    </div>
                                </div>

                                {isPending ?
                                    <button type='button' className='btn bg-main d-block w-100 text-white'><i className='fa-solid fa-spinner fa-spin px-4'></i></button> :
                                    <button type='submit' className='btn bg-main d-block w-100 text-white rounded'>Submit</button>
                                }
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    </>
}
