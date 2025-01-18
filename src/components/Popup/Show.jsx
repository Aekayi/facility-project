import Box from "@mui/material/Box";
import { forwardRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bookedRedx } from "../../apps/features/customSlice";
import LocalIcon from "../../assets/icons";
// import LoadingComponent from "../loading/LoadingComponent";
import Modal from "@mui/material/Modal";
import { useBookedListByDateQuery } from "../../apps/features/apiSlice";

const Show = forwardRef(
  (
    { popupId, openShow, setOpenShow, openEdit, setOpenEdit, setCreateData },
    ref
  ) => {
    const [deleteComfirm, setDeleteComfirm] = useState(false);
    const dispatch = useDispatch();

    const {
      data: bookedList = [],
      isLoading,
      isError,
    } = useBookedListByDateQuery({
      facilityByRoomId,
      bookedListByDate: changeDate || dayjs().format("YYYY-MM-DD"),
    });

    console.log(bookedList, "bookedList......");

    const adminId = useSelector(
      (state) => state?.auth?.login?.data?.data?.user?.id
    );
    const approvedId = bookingDatas?.approved_by?.find(
      (approver) => approver.id === adminId
    );
    const needApproval = bookingDatas?.facility_id?.needApproval;

    const handelEdit = () => {
      setOpenEdit(!openEdit);
      setOpenShow(false);
    };

    return (
      <>
        <main ref={ref} className="showContainer">
          <Box className="date-modal-show">
            {/* <LoadingComponent loadingGroup={"s"} design="true"> */}
            {adminId === bookingDatas?.book_by?.id && (
              <section className="showIcon">
                <button onClick={() => handelEdit()}>
                  <img src={LocalIcon.Edit} width={20} alt="Edit" />
                </button>
                <button onClick={() => setDeleteComfirm(true)}>
                  <img src={LocalIcon.Delete} width={20} alt="Delete" />
                </button>
              </section>
            )}

            <section className="bodyContainer">
              <section className="scrollContainer">
                <article className="titleContainer">
                  {bookingDatas?.title !== null && (
                    <h4 className="title">{bookingDatas?.title}</h4>
                  )}
                  <p className="createTime">
                    Time -- <span>{bookingDatas?.start_time}</span> -{" "}
                    <span>{bookingDatas?.end_time}</span>
                  </p>
                </article>

                {bookingDatas?.note !== null && (
                  <article className="desContainer">
                    <h4 className="desTitle">Descriptions</h4>
                    <p className="showDes">{bookingDatas?.note}</p>
                  </article>
                )}
                {bookingDatas?.participants !== null && (
                  <article className="memberContainer">
                    <h4 className="membertitle">
                      {bookingDatas?.participants.length} Members
                    </h4>
                    <section className="personContainer">
                      {bookingDatas?.participants.map((member, index) => (
                        <div
                          key={index}
                          className="personBox py-1 px-2 bg-[#D1F1F4] text-[#05445E] text-[12px] rounded-md"
                        >
                          {member?.name}
                        </div>
                      ))}
                    </section>
                  </article>
                )}
                {bookingDatas?.approved_by !== null && (
                  <div className="memberContainer flex flex-col gap-2 mb-4">
                    <h4 className="membertitle text-[#333]">
                      Booking approved
                    </h4>
                    <div className="approver-con ">
                      {bookingDatas?.approved_by?.map((approver, index) => (
                        <p className="approver" key={index}>
                          {approver?.name}
                          {bookingDatas?.approved_by?.length - 1 !== index && (
                            <span> , </span>
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                {bookingDatas?.locations.length > 0 && (
                  <article className="locationContainer">
                    <h4 className="locationTitle">Location(s)</h4>
                    {bookingDatas?.locations?.map((location, index) => (
                      <div className="locationAddress" key={index}>
                        <h5>{location?.name}</h5>
                        {location?.address}
                      </div>
                    ))}
                  </article>
                )}
              </section>
            </section>

            {/* footer */}

            <section className="show_footer_container">
              <div className="approval-conatiner">
                {approvedId !== undefined && needApproval && (
                  <>
                    {bookingDatas?.status !== "booked" && (
                      <button className="save" onClick={() => handelAprove()}>
                        Approve
                      </button>
                    )}

                    <button
                      className="cancel"
                      onClick={() => handelAproveCancel()}
                    >
                      Not Approve
                    </button>
                  </>
                )}
              </div>
              <div className="cancel-container">
                <button className="save" onClick={() => setOpenShow(!openShow)}>
                  Close
                </button>
              </div>
            </section>
            {/* </LoadingComponent> */}
          </Box>
        </main>

        <Modal
          open={deleteComfirm}
          onClose={() => setDeleteComfirm(false)}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
          disableEnforceFocus
          autoFocus={false}
          className="confirm-modal-container"
        >
          <Box className="confirm-modal" tabIndex="-1">
            <div className="confirm-info">
              {/* <div className="confirm-title"> */}
              <div className="confirm-img">
                <img src={LocalIcon.Delete} alt="Infomation" />
              </div>

              <h3>Delete Booking Request</h3>
              {/* </div> */}
              <p>Are you sure? Do you want to delete?</p>
            </div>
            <div className="confirm-footer">
              <button
                onClick={() => setDeleteComfirm(false)}
                className="cancel"
              >
                Cancel
              </button>
              <button onClick={() => handelDelete()} className="delete">
                Confirm
              </button>
            </div>
          </Box>
        </Modal>

        {/* {edit ? <Edit popupId={popupId} /> : null}*/}
      </>
    );
  }
);

// const
export default Show;
