import React from "react";
import logo from "../../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../apps/features/userSlice";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.user);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    passwordRequired: Yup.string().required("Password is required"),
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    // dispatch(loginUser(values));
    // navigate("/");
    e.preventDefault();
    dispatch(loginUser(values));
    navigate("/");
  };

  return (
    <div className="container mx-auto flex flex-col justify-center items-center h-screen ">
      <div className="mt-10 flex flex-col items-center">
        <img src={logo} alt="Logo" className="mb-4" />
        <h4 className="text-2xl font-semibold mb-4">Login Form</h4>
      </div>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <form className="p-6 h-full w-1/2 max-w-md bg-white">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email address
              </label>
              <input
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="email"
                type="email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
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
                type="password"
                id="password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="!mt-8">
              <button
                type="submit"
                className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                disabled={status === "loading" || isSubmitting}
              >
                {status === "loading" ? "Logging in..." : "Login"}
              </button>
              {error && (
                <p className="text-red-500 mt-2" role="alert">
                  {error}
                </p>
              )}
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
