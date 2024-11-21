import React from "react";
import { Outlet, useNavigation } from "react-router-dom";
import { Loading } from "./Loading";

const AppLayout = () => {
  const navigation = useNavigation();

  return (
    <div>
      {navigation.state === "loading" && <Loading />}
      <Outlet />
    </div>
  );
};

export default AppLayout;
