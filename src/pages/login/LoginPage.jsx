import React from "react";
import logo from "../../assets/logo.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLoginMutation } from "../../apps/features/apiSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../apps/features/AuthSlice";

const LoginPage = () => {
  const [login, { isLoading, isError, error }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try{
        const response = await login(values).unwrap();
        dispatch(
          setCredentials({
            id: response.id,
            accessToken: response.accessToken,
          })
        );
        navigate("/");
      }
      catch(err){
      console.error("Login Failed:", err);
      alert(err.data?.message || "Login failed. Please try again.");
    }
  }
  });

  return (
    <div className="container mx-auto flex flex-col justify-center items-center h-screen w-1/2">
      <form
        className="p-6 h-full w-2/3 max-w-md bg-white"
        onSubmit={formik.handleSubmit}
      >
        <div className="mt-10 flex flex-col items-center">
          <img src={logo} alt="Logo" className="mb-4" />
          <h4 className="text-2xl font-semibold mb-4">Welcome !</h4>
        </div>
        <div className="mb-4">
          <input
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter user name"
            id="username"
            type="text"
            name="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          />
          {formik.touched.username && formik.errors.username ? (
            <div className="text-yellow-600">{formik.errors.username}</div>
          ) : null}
        </div>

        <div className="mb-4">
          <input
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Password"
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-yellow-600">{formik.errors.password}</div>
          ) : null}
        </div>

        <div className="!mt-8">
          <button
            type="submit"
            className="w-full py-2 px-4 text-lg tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none font-bold"
            disabled={formik.isSubmitting || isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          {isError && (
            <div className="text-red-600">
              Error: {error?.data?.message || "Login failed"}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
