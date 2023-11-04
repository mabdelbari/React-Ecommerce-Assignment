import React from 'react';
import styles from './Checkout.module.css';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { Backdrop, Box, Fade, Modal } from '@mui/material';
import * as Yup from 'yup'

export default function Checkout({ data, userToken, checkoutCart, open, isPending, setOpen }) {

    const dispatch = useDispatch();

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

    const handleClose = () => {
        setOpen(false);
        formik.setValues(formik.initialValues)
    }

    const phoneRegex = /\+?\d{0,2}\s?1?-?(\d{1,3})?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{5}/;
    const validationSchema = Yup.object({
        details: Yup.string().min(5).required(),
        phone: Yup.string()
            .matches(phoneRegex, 'Invalid phone number')
            .required('Phone is required'),
        city: Yup.string().min(2).required()
    })

    const formik = useFormik({
        initialValues: {
            details: '',
            phone: '',
            city: ''
        },
        validationSchema,
        onSubmit: (values) => {
            dispatch(checkoutCart({ values, cartId: data.data._id, url: `${window.location.hostname === "localhost" ? "http://localhost:3000/account" : `http://${window.location.hostname}/account`}`, userToken }))
        }
    })

    return <>
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
                    <div className='d-flex justify-content-between align-items-center  '>
                        <h2>Add Address</h2>
                        <button onClick={handleClose} className='btn'><i className="fa-solid fa-xmark fa-xl"></i></button>
                    </div>
                    <div>
                        <form onSubmit={formik.handleSubmit}>

                            <label htmlFor="details">Address</label>
                            <input type="text" className='form-control mb-3 mt-1' value={formik.values.details} onChange={formik.handleChange} name="details" id="details" placeholder="Street name" />

                            <label htmlFor="phone">Phone</label>
                            <input type="tel" className='form-control mb-3 mt-1' value={formik.values.phone} onChange={formik.handleChange} name="phone" id="phone" placeholder="Phone" />

                            <label htmlFor="city">City</label>
                            <input type="text" className='form-control mb-3 mt-1' value={formik.values.city} onChange={formik.handleChange} name="city" id="city" placeholder="City" />

                            {
                                isPending ?
                                    <button type='button' className='btn bg-main d-block w-100 text-white'><i className='fa-solid fa-spinner fa-spin px-4'></i></button> :
                                    <button disabled={!(formik.dirty && formik.isValid)} type='submit' className='btn bg-main text-white w-100 d-block'>Continue to Payment</button>
                            }

                        </form>
                    </div>
                </Box>
            </Fade>
        </Modal>
    </>
}
