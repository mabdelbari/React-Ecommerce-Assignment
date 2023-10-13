import React, { useState } from 'react';
import styles from './UserInformation.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import axios from 'axios';
import { setUserData } from '../../Redux/authSlice';
import { Backdrop, Box, Fade, Modal } from '@mui/material';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';


export default function UserInformation() {

    let dispatch = useDispatch();

    const { userData, userToken } = useSelector((store) => store.authReducer)


    const [isPending, setIsPending] = useState(false);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        formik2.setValues(formik2.initialValues)
    }

    const headers = {
        token: userToken
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

    async function updateUserData(values) {
        setIsPending(true)
        try {
            const { data } = await axios.put('https://ecommerce.routemisr.com/api/v1/users/updateMe', values, {
                headers
            })
            setIsPending(false);
            if (data.message === "success") {
                dispatch(setUserData(data?.user))
                toast.success("Your data has been updated successfully", {
                    autoClose: 2000,
                    theme: 'colored'
                })
            }
        } catch (error) {
            setIsPending(false);
            if (error?.response) {
                toast.error(error?.response?.data?.errors?.msg || error?.response.data.message, {
                    autoClose: 2000,
                    theme: 'colored'
                });
            } else if (error?.request) {
                toast.error(error?.request, {
                    autoClose: 2000,
                    theme: 'colored'
                });
            } else {
                toast.error(error?.message, {
                    autoClose: 2000,
                    theme: 'colored'
                });
            }

        }
    }

    async function updateUserPassword(values) {
        setIsPending(true)
        try {
            const { data } = await axios.put('https://ecommerce.routemisr.com/api/v1/users/changeMyPassword', values, {
                headers
            })
            setIsPending(false);
            if (data.message === "success") {
                dispatch(setUserData(data?.user))
                handleClose();
                toast.success("Your data has been updated successfully", {
                    autoClose: 2000,
                    theme: 'colored'
                })
            }
        } catch (error) {
            setIsPending(false);
            console.log(error);
            if (error?.response) {
                toast.error(error?.response?.data?.errors?.msg || error?.response.data.message, {
                    autoClose: 2000,
                    theme: 'colored'
                });
            } else if (error?.request) {
                toast.error(error?.request, {
                    autoClose: 2000,
                    theme: 'colored'
                });
            } else {
                toast.error(error?.message, {
                    autoClose: 2000,
                    theme: 'colored'
                });
            }

        }
    }

    const nameRegex = /^[a-z]{2,}(?:\s[a-z]{2,})*$/i;
    const phoneRegex = /\+?\d{0,2}\s?1?-?(\d{1,3})?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
    const PassRegex = /^(?=(?:.*?[0-9]){2})(?=(?:.*?[a-z]){2})(?=(?:.*?[A-Z]){2})(?=(?:.*?[^a-zA-Z0-9]){2})(?!.*\s).{8,30}$/;


    let dataValidationSchema = Yup.object({
        name: Yup.string()
            .matches(nameRegex, 'Your name should be atleast two letter without special characters or numbers')
            .required('Name  is required'),
        email: Yup.string()
            .email('Email not valid *example@yyy.zzz')
            .required('Email is required'),
        phone: Yup.string()
            .matches(phoneRegex, 'Invalid phone number')
            .required('Phone is required')
    })

    let passValidationSchema = Yup.object({
        password: Yup.string()
            .matches(PassRegex, 'Password must contain at least two uppercase, two lowercase, two digits, two special characters and with no whitespaces')
            .required('Password is required'),
        rePassword: Yup.string()
            .oneOf([Yup.ref("password")], `Password doesn't match`)
            .required('rePassword is required'),
    })

    let formik = useFormik({
        initialValues: {
            name: userData?.name,
            email: userData?.email,
            phone: '',
        }, validationSchema: dataValidationSchema,
        onSubmit: updateUserData,
        validateOnChange: false,
        validateOnBlur: false
    })

    let formik2 = useFormik({
        initialValues: {
            currentPassword: '',
            password: '',
            rePassword: '',
        }, validationSchema: passValidationSchema,
        onSubmit: updateUserPassword,
    })

    return <>

        <Helmet>
            <title>My Profile - Account - FreshCart</title>
        </Helmet>


        <form onSubmit={formik.handleSubmit}>

            {!formik.isValid
                ?
                <div className='alert alert-danger p-2'>
                    <ul className='m-0'>
                        {formik.touched.name && formik.errors.name ? <li>{formik.errors.name}</li> : ""}
                        {formik.errors.email && formik.touched.email ? <li>{formik.errors.email}</li> : ""}
                        {formik.errors.phone && formik.touched.phone ? <li>{formik.errors.phone}</li> : ""}
                    </ul>
                </div>
                : null}

            <div className="row">
                <div className="col-md-4">
                    <label htmlFor="name">Name:</label>
                </div>
                <div className="col-md-8">
                    <input className='form-control mb-3 mt-1 border-main' value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} type="text" name='name' id='name' />
                </div>
            </div>


            <div className="row">
                <div className="col-md-4">
                    <label htmlFor="email">Email:</label>
                </div>
                <div className="col-md-8">
                    <input className='form-control mb-3 mt-1 border-main' value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} type="email" name='email' id='email' />
                </div>
            </div>


            <div className="row">
                <div className="col-md-4">
                    <label htmlFor="phone">Phone:</label>
                </div>
                <div className="col-md-8">
                    <input className='form-control mb-3 mt-1 border-main' value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur} type="tel" name='phone' id='phone' />
                </div>
            </div>
        </form>



        <div className="row">
            <div className="col-md-4">
                <label htmlFor="phone">Password:</label>
            </div>
            <div className="col-md-8">
                <button className='btn btn-secondary' onClick={handleOpen}>Update Password</button>
            </div>
        </div>



        {
            isPending
                ? <button type='button' disabled={true} className='btn bg-main d-block ms-auto text-white'><i className='fa-solid fa-spinner fa-spin px-4'></i></button>
                : <button type='submit' onClick={formik.handleSubmit} className='btn bg-main d-block ms-auto text-white'>Update</button>
        }


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
                        <h2>Update Password</h2>
                        <button onClick={handleClose} className='btn'><i className="fa-solid fa-xmark fa-xl"></i></button>
                    </div>
                    <div>
                        <form onSubmit={formik2.handleSubmit}>

                            <label htmlFor="currentPassword">Current Password:</label>
                            <input className='form-control mb-3 mt-1 border-main' value={formik2.values.currentPassword} onChange={formik2.handleChange} onBlur={formik2.handleBlur} type="password" name='currentPassword' id='currentPassword' />

                            <label htmlFor="password">New Password:</label>
                            <input className='form-control mb-3 mt-1 border-main' value={formik2.values.password} onChange={formik2.handleChange} onBlur={formik2.handleBlur} type="password" name='password' id='password' />
                            {formik2.errors.password && formik2.touched.password ? <div className='alert alert-danger p-2'>{formik2.errors.password}</div> : null}

                            <label htmlFor="rePassword">Confirm Password:</label>
                            <input className='form-control mb-3 mt-1 border-main' value={formik2.values.rePassword} onChange={formik2.handleChange} onBlur={formik2.handleBlur} type="password" name='rePassword' id='rePassword' />
                            {formik2.errors.rePassword && formik2.touched.rePassword ? <div className='alert alert-danger p-2'>{formik2.errors.rePassword}</div> : null}

                            {
                                isPending ?
                                    <button type='button' className='btn bg-main d-block w-100 text-white'><i className='fa-solid fa-spinner fa-spin px-4'></i></button> :
                                    <button disabled={!(formik2.dirty && formik2.isValid)} type='submit' className='btn bg-main text-white w-100 d-block'>Update</button>
                            }

                        </form>
                    </div>
                </Box>
            </Fade>
        </Modal>

    </>
}
