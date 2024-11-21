import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCredentials } from '../apps/features/AuthSlice'
import { persistor } from '../apps/store'

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = ()=>{
        dispatch(clearCredentials());
        persistor.purge();
        navigate("/login");
    }
  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-blue-600"
    >
      Logout
    </button>
  )
}

export default Logout
