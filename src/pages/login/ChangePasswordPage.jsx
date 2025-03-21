import React, { useState } from "react";
import { useChangePasswordMutation } from "../../apps/features/apiSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import SettingBox from "../../components/SettingBox";
import LocalIcon from "../../assets/icons";
import { clearCredentials } from "../../apps/features/AuthSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [changePassword, { isLoading, isSuccess, isError, error }] =
    useChangePasswordMutation();

  const [oldPassword, setOldPassword] = useState(false);
  const [newPassword, setNewPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      current_password: "",
      password: "",
    },
    validationSchema: Yup.object({
      current_password: Yup.string().required("Old password is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("New password is required"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      const notifyerror = () => toast.error("This time is already booked!");
      const notifysuccess = () =>
        toast.info("Booking created successfully!", {
          style: { backgroundColor: "#d4f1f4", color: "#05445e" },
          progressStyle: {
            background: "#05445e",
          },
        });
      try {
        const response = await changePassword({
          current_password: values.current_password,
          password: values.password,
        }).unwrap();
        if (response.status === false) {
          notifyerror();
          return;
        } else {
          toast.success("Password changed successfully!");
        }

        console.log("API Response:", response);

        navigate("/login"); // Redirect to login page
        dispatch(clearCredentials());
        formik.resetForm();
      } catch (err) {
        console.error("Error changing password:", err);
        alert(
          err?.data?.message || "Failed to change password. Please try again."
        );
      } finally {
        setSubmitting(false); // Re-enable the submit button
      }
    },
  });

  const handleBack = () => {
    navigate("/"); // Navigate back to the previous page
  };

  return (
    <>
      <div className="min-h-screen w-2/3 max-w-md bg-white">
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
            <h1 className="text-xl font-semibold text-[#05445E]">
              Change Password
            </h1>
            <SettingBox />
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4 relative">
              <input
                type={oldPassword ? "text" : "password"}
                name="current_password"
                value={formik.values.current_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#d4f1f4]"
                placeholder="Enter old password"
              />
              <button
                type="button"
                onClick={() => setOldPassword(!oldPassword)}
                className="absolute top-2 right-3 flex items-center text-gray-600"
              >
                {oldPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </button>
              {formik.touched.current_password &&
                formik.errors.current_password && (
                  <div className="text-red-500">
                    {formik.errors.current_password}
                  </div>
                )}
            </div>

            <div className="mb-4 relative">
              <input
                type={newPassword ? "text" : "password"}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#d4f1f4]"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setNewPassword(!newPassword)}
                className="absolute top-2 right-3 flex items-center text-gray-600"
              >
                {newPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </button>
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500">{formik.errors.password}</div>
              )}
            </div>

            {/* <div>
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <div className="text-red-500">
                  {formik.errors.confirmPassword}
                </div>
              )}
          </div> */}

            {isError && (
              <div className="text-red-500">
                {error?.data?.message ||
                  "An error occurred while changing password."}
              </div>
            )}
            {isSuccess && (
              <div className="text-green-500">
                Password changed successfully!
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || formik.isSubmitting}
              className="bg-[#05445E] hover:bg-[#05445E]/80 text-white py-2 px-4 rounded w-full"
            >
              {isLoading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordPage;
