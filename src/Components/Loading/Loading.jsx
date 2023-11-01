import React from 'react';
import styles from './Loading.module.css';

export default function Loading() {
    return <>
        <div className={styles.Loading}>
            <i className="fa-solid fa-spinner fa-spin fa-4x"></i>
        </div>
    </>
}
