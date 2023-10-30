import { RouterProvider, createBrowserRouter, createHashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';

import './App.css';

import Home from './Components/Home/Home';
import Products from './Components/Products/Products';
import ProductDetails from './Components/ProductDetails/ProductDetails';
import Cart from './Components/Cart/Cart';
import WishList from './Components/WishList/WishList';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import UserOrders from './Components/UserOrders/UserOrders';
import UserInformation from './Components/UserInformation/UserInformation'
import Notfound from './Components/Notfound/Notfound';
import Account from './Components/Account/Account'
import Layout from './Components/Layout/Layout'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import { Provider } from 'react-redux';
import store from './Redux/Store';
import ForgetPassword from './Components/ForgetPassword/ForgetPassword';
import ResetPassword from './Components/ResetPassword/ResetPassword';


let routes = createHashRouter([
    {
        path: '/', element: <Layout />, children: [
            { index: true, element: <ProtectedRoute> <Home /> </ProtectedRoute> },
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            { path: 'forgetpassword', element: <ForgetPassword /> },
            { path: 'resetpassword', element: <ResetPassword /> },
            {
                path: 'account', element: <ProtectedRoute> <Account /> </ProtectedRoute>, children: [
                    { index: true, element: <ProtectedRoute> <UserInformation /></ProtectedRoute> },
                    { path: 'allorders', element: <ProtectedRoute> <UserOrders /></ProtectedRoute> },
                    { path: 'wishlist', element: <ProtectedRoute> <WishList /> </ProtectedRoute> },
                ]
            },
            { path: 'products/:id?', element: <ProtectedRoute> <Products /> </ProtectedRoute> },
            { path: 'productdetails/:id', element: <ProtectedRoute> <ProductDetails /> </ProtectedRoute> },
            { path: 'cart', element: <ProtectedRoute> <Cart /> </ProtectedRoute> },


            { path: '*', element: <Notfound /> },
        ]
    }
])


export default function App() {

    let queryClient = new QueryClient();


    return <>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <RouterProvider router={routes} />
                <ToastContainer></ToastContainer>
            </Provider>
        </QueryClientProvider>
    </>
}