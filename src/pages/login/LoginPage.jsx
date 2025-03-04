import React, { useContext } from "react";
import logo from "../../assets/logo.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLoginMutation } from "../../apps/features/apiSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../apps/features/AuthSlice";
import { UserContext } from "../../context/userContext";

const LoginPage = () => {
  const [login, { isLoading, isError, error }] = useLoginMutation();
  const { setUser } = useContext(UserContext);
  console.log("set", setUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("username or email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await login(values).unwrap();
        console.log("response", response);
        dispatch(
          setCredentials({
            id: response.data.user.id,
            token: response.data.token,
            role: response.data.user.role,
          })
        );

        navigate("/");
      } catch (err) {
        console.error("Login Failed:", err);
        // alert(err.data?.message || "Login failed. Please try again.");
      }
    },
  });

  return (
    <form
      className="p-6 h-screen w-2/3 max-w-md bg-white"
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
          id="email"
          type="text"
          name="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="text-yellow-600">{formik.errors.email}</div>
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
          className="w-full py-2 px-4 text-lg tracking-wide rounded-lg text-white bg-[#05445E] hover:bg-[#05445E]/80 focus:outline-none font-bold"
          disabled={formik.isSubmitting || isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {isError && (
          <div className="text-red-600">
            Error:{" "}
            {error?.data?.message || "Access Denide : Invalid Crendtials"}
          </div>
        )}
      </div>
    </form>
  );
};

export default LoginPage;
