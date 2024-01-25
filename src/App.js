import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CustomerLayout from './Layouts/CustomerLayout';
import AdminLayout from './Layouts/AdminLayout';
import LoginPage from './Pages/Login/LoginPage';
import RegisterPage from './Pages/Register/RegisterPage';
import PageNotFound from './Pages/NotFound/PageNotFound'
import RolePage from './Pages/Admin/Roles/RolePage'
import DashboardPage from './Pages/Admin/Dashboard/DashboardPage'
import { ToastContainer } from 'react-toastify';
import './App.scss'
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import userService from './services/userService';
import { doLogout, setUserInfo } from './redux/slices/authSlice';
import PrivateRoute from './Pages/ProtectedRoute/PrivateRoute';
import AuthPage from './Pages/Auth/AuthPage';
import UserPage from './Pages/Admin/Users/UserPage';
import PermissionPage from './Pages/Admin/Permissions/PermissionPage';

function App() {
  const isDarkMode = useSelector(state => state.theme.isDarkMode)
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  const dispatch = useDispatch()

  const getCurrentUser = async () => {
    const res = await userService.getCurrentUser()
    if (res && res.id) {
      dispatch(setUserInfo(res))
    }
    else {
      dispatch(doLogout())
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      getCurrentUser()
    }
  }, [isAuthenticated])

  const router = createBrowserRouter([
    {
      path: "/admin",
      element: <PrivateRoute>
        <AdminLayout />
      </PrivateRoute>,
      children: [
        {
          index: true,
          element: <DashboardPage />
        },
        {
          path: 'roles',
          element: <RolePage />
        },
        {
          path: 'users',
          element: <UserPage />
        },
        {
          path: 'permissions',
          element: <PermissionPage />
        }
      ]
    },
    {
      path: "/",
      element: <CustomerLayout />
    },
    {
      path: '/login',
      element: <LoginPage />
    },
    {
      path: '/register',
      element: <RegisterPage />
    },
    {
      path: '/auth',
      element: <AuthPage />
    },
    {
      path: '*',
      element: <PageNotFound />
    }
  ]);

  return (
    <div>
      <RouterProvider router={router} />

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? 'dark' : 'light'}
      />

    </div>
  )
}

export default App;
