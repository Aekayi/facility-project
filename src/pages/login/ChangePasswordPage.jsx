import React from "react";
import { useChangePasswordMutation } from "../../apps/features/apiSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [ChangePassword, { isLoading, isError, error }] =
    useChangePasswordMutation();
  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      // oldPassword: Yup.string().required("Old password is required"),
      newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),

    onSubmit: async (values) => {
      try {
        // Get the user ID from local storage.
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID not found. Please log in again.");
        }

        // Call the ChangePassword endpoint with the form values.
        await ChangePassword({
          id: userId,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        }).unwrap();

        // Show a success message and navigate to the login page.
        alert("Password changed successfully!");
        navigate("/login");
      } catch (err) {
        console.error("Error changing password:", err);
        alert(err.data?.message || "Failed to change password.");
      }
    },
  });

  return (
    <div className="container mx-auto flex flex-col justify-center items-center h-screen w-1/2">
      <form
        className="p-6 h-full w-2/3 max-w-md bg-white"
        onSubmit={formik.handleSubmit}
      >
        <div className="mb-4">
          <input
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter New Password"
            id="newPassword"
            name="newPassword"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPassword}
          />
          {formik.touched.newPassword && formik.errors.newPassword ? (
            <div className="text-yellow-600">{formik.errors.newPassword}</div>
          ) : null}
        </div>

        <div className="mb-4">
          <input
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm New Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="text-yellow-600">
              {formik.errors.confirmPassword}
            </div>
          ) : null}
        </div>

        <div className="!mt-8">
          <button
            type="submit"
            className="w-full py-2 px-4 text-lg tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none font-bold"
            disabled={formik.isSubmitting || isLoading}
          >
            {isLoading ? "Updating..." : "Change Password"}
          </button>
          {isError && (
            <div className="text-red-600">
              Error: {error?.data?.message || "Failed to change password"}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
