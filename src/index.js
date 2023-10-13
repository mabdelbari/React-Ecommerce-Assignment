import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './index.css';
import { Offline } from 'react-detect-offline';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<>
    <App />
    <div>
        <Offline>
            <div className="position-fixed shadow-lg bg-main text-white p-3 rounded" style={{ bottom: "50px", left: "50px" }}>
                <i className='fa-solid fa-wifi me-2'></i> You're offline. Check your internet connection.
            </div>
        </Offline>
    </div>
</>);
