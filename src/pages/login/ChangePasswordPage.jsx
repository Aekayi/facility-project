import React from "react";
import { useChangePasswordMutation } from "../../apps/features/apiSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import SettingBox from "../../components/SettingBox";
import LocalIcon from "../../assets/icons";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [changePassword, { isLoading, isError, error }] =
    useChangePasswordMutation();

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Old password is required"),
      newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),

    onSubmit: async (values) => {
      try {
        const response = await changePassword({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        }).unwrap();

        console.log("API Response:", response);

        // Show a success message and navigate to the login page
        alert("Password changed successfully. Please log in again.");
        navigate("/login");
      } catch (err) {
        console.error("Error changing password:", err);
        alert(
          err?.data?.message || "Failed to change password. Please try again."
        );
      }
    },
  });

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="h-full w-2/3 max-w-md bg-white">
      <div className="m-4">
        <div className="container flex justify-between items-center py-3 px-4 mb-4 border border-gray-300 shadow rounded">
          <button className="back-con" onClick={handleBack}>
            <img
              src={LocalIcon.BackColor}
              style={{ width: "11px" }}
              title="Back"
              alt="Back"
            />
          </button>
          <h1 className="text-xl font-semibold text-blue-500">
            Change Password
          </h1>
          <SettingBox />
        </div>
        <form
          className="m-4 flex flex-col items-center"
          onSubmit={formik.handleSubmit}
        >
          {/* Old Password */}
          <div className="mb-4 w-full">
            <input
              className="w-full py-2 px-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Old Password"
              id="oldPassword"
              name="oldPassword"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.oldPassword}
            />
            {formik.touched.oldPassword && formik.errors.oldPassword && (
              <div className="text-yellow-600">{formik.errors.oldPassword}</div>
            )}
          </div>

          {/* New Password */}
          <div className="mb-4 w-full">
            <input
              className="w-full py-2 px-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter New Password"
              id="newPassword"
              name="newPassword"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.newPassword}
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <div className="text-yellow-600">{formik.errors.newPassword}</div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4 w-full">
            <input
              className="w-full py-2 px-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm New Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <div className="text-yellow-600">
                  {formik.errors.confirmPassword}
                </div>
              )}
          </div>

          {/* Submit Button */}
          <div className="mt-4 w-full">
            <button
              type="submit"
              className="w-full py-2 px-4 text-lg tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none font-bold"
              disabled={isLoading || formik.isSubmitting}
            >
              {isLoading ? "Changing..." : "Change Password"}
            </button>
            {isError && (
              <div className="text-red-600 mt-2">
                Error: {error?.data?.message || "Failed to change password."}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
