import React from "react";
import logo from "../../assets/logo.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLoginMutation } from "../../apps/features/apiSlice";
import { useNavigate } from "react-router-dom";


const LoginPage = () => {
  const [login, { isLoading, isError, error }] = useLoginMutation();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await login(values).unwrap();
        console.log('Login Successful:', response);
        navigate('/')

        // Store token in localStorage
        if (response?.token) {
          localStorage.setItem('authToken', response.token);
          console.log('Token stored in localStorage');
        }
      } catch (err) {
        console.error('Login Failed:', err);
      } finally {
        setSubmitting(false);
      }
    },
  });


  return (
    <div className="container mx-auto flex flex-col justify-center items-center h-screen ">
      <div className="mt-10 flex flex-col items-center">
        <img src={logo} alt="Logo" className="mb-4" />
        <h4 className="text-2xl font-semibold mb-4">Login Form</h4>
      </div>
     
          <form className="p-6 h-full w-1/2 max-w-md bg-white" onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 font-medium mb-2"
              >
                UserName
              </label>
              <input
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="username"
                type="text"
                name="username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
              />
              {formik.touched.username && formik.errors.username ? (
                <div>{formik.errors.username}</div>
                  ) : null}
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Password
              </label>
              <input
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="password"
                name="password"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <div>{formik.errors.password}</div>
               ) : null}
            </div>

            <div className="!mt-8">
              <button
                type="submit"
                className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                disabled={formik.isSubmitting || isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
              {isError && <div>Error: {error?.data?.message || 'Login failed'}</div>}
            </div>
          </form>
        
      
    </div>
  );
};

export default LoginPage;
