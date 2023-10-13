import React, { useState } from 'react';
import styles from './ForgetPassword.module.css';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup'
import axios from 'axios';
import { Backdrop, Box, Fade, Modal } from '@mui/material';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';


export default function ForgetPassword() {
    let navigate = useNavigate();
    let dispatch = useDispatch();

    const [isPending, setIsPending] = useState(false);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        formik2.setValues(formik2.initialValues)
    }

    const toastSettings = {
        autoClose: 2000,
        theme: 'colored'
    }

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #fef',
        borderRadius: "10px",
        boxShadow: 20,
        p: 2,
    };

    const sendUserEmail = async (values) => {
        setIsPending(true)
        try {
            const { data } = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords', values)
            setIsPending(false);
            if (data?.statusMsg === "success") {
                handleOpen();
                sessionStorage.setItem('emailSent', values.email);
                toast.success(data?.message, toastSettings)
            }
        } catch (error) {
            setIsPending(false);
            if (error?.response) {
                toast.error(error?.response?.data?.errors?.msg || error?.response?.data?.message, toastSettings);
            } else {
                toast.error(error?.message, toastSettings);
            }

        }
    }

    const sendResetCode = async (values) => {
        setIsPending(true)
        try {
            const { data } = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode', values)
            setIsPending(false);
            if (data?.status === "Success") {
                handleClose();
                sessionStorage.setItem('isCodeVerified', true)
                navigate('/resetpassword')
                toast.success(data?.message, toastSettings)
            }
        } catch (error) {
            setIsPending(false);
            if (error?.response) {
                toast.error(error?.response?.data?.errors?.msg || error?.response?.data?.message, toastSettings);
            } else {
                toast.error(error?.message, toastSettings);
            }

        }
    }



    let emailValidationSchema = Yup.object({
        email: Yup.string()
            .email('Email not valid *example@yyy.zzz')
            .required('Email is required'),
    })

    let resetCodeValidationSchema = Yup.object({
        resetCode: Yup.string()
            .required('Reset code is required')
            .min(4, 'Reset code must be at least 4 characters')
            .max(6, 'Reset code cannot exceed 6 characters')
            .matches(/^\d+$/, 'Reset code must be numeric')
    })


    let formik = useFormik({
        initialValues: {
            email: "",
        }, validationSchema: emailValidationSchema,
        onSubmit: sendUserEmail,
        validateOnChange: false,
        validateOnBlur: false
    })

    let formik2 = useFormik({
        initialValues: {
            resetCode: "",
        }, validationSchema: resetCodeValidationSchema,
        onSubmit: sendResetCode,
    })

    return <>
        <Helmet>
            <title>Forget Password - FreshCart</title>
        </Helmet>

        <section id='login' className={`py-4 vh-100`}>
            <div className="container my-5">
                <div className="row gy-3">
                    <div className='col-md-12'>
                        <div className="currentCustomer bg-main-light rounded p-4">
                            <h3 className='mb-2 text-center'>Forgot Your Password?</h3>

                            <p className='font-sm text-center'>Enter the e-mail address associated with your account. Click submit to have a password reset link e-mailed to you.</p>

                            <form onSubmit={formik.handleSubmit}>

                                {!formik.isValid
                                    ?
                                    <div className='alert alert-danger p-2'>
                                        <ul className='m-0'>
                                            {formik.errors.email && formik.touched.email ? <li>{formik.errors.email}</li> : ""}
                                        </ul>
                                    </div>
                                    : null}

                                <div className="row align-items-center mb-3">
                                    <div className="col-md-4">
                                        <label htmlFor="email">Your E-mail Address:</label>
                                    </div>
                                    <div className="col-md-8">
                                        <input className='form-control mt-1 border-main' value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} type="text" name='email' id='email' />
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


        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <Box sx={modalStyle}>
                    <div className='d-flex justify-content-between align-items-center mb-4'>
                        <h2>Verify Your Code</h2>
                        <button onClick={handleClose} className='btn'><i className="fa-solid fa-xmark fa-xl"></i></button>
                    </div>
                    <div>
                        <form onSubmit={formik2.handleSubmit}>
                            <h6 className='text-center mb-4'>Enter the code that has been sent to your email</h6>
                            <input className='form-control mb-3 mt-1 border-main' value={formik2.values.currentPassword} onChange={formik2.handleChange} onBlur={formik2.handleBlur} type="test" name='resetCode' id='resetCode' />
                            {formik2.errors.resetCode && formik2.touched.resetCode ? <div className='alert alert-danger p-2'>{formik2.errors.resetCode}</div> : null}

                            {
                                isPending ?
                                    <button type='button' className='btn bg-main d-block w-100 text-white'><i className='fa-solid fa-spinner fa-spin px-4'></i></button> :
                                    <button disabled={!(formik2.dirty && formik2.isValid)} type='submit' className='btn bg-main text-white w-100 d-block'>Verify</button>
                            }

                        </form>
                    </div>
                </Box>
            </Fade>
        </Modal>
    </>
}
