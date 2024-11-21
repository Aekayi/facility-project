import { useSelector } from "react-redux";
import { Loading, RoomLoading, BookedLoading } from "./Loading";

const LoadingComponent = ({
  loadingGroup,
  loadingDesign,
  design,
  bookedDesign,
  children,
}) => {
  const selectedData = useSelector((state) => state.loading[loadingGroup]);

  return selectedData ? (
    loadingDesign ? (
      <RoomLoading />
    ) : design ? (
      <RoomLoading design="view-loading" />
    ) : bookedDesign ? (
      <BookedLoading />
    ) : (
      <Loading />
    )
  ) : (
    children
  );
};

export default LoadingComponent;
