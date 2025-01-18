import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {};
export const yourSlice = createSlice({
  name: "yourSlice",
  initialState: INITIAL_STATE,
  reducers: {
    setLoading: (state, action) => {
      return state;
    },
  },
});

export const bookedRedx = createSlice({
  name: "bookedRedx",
  initialState: {
    bookedRedxRequest: { info: [], participants: [], coord: [], location: [] },
  },
  reducers: {
    setData: (state, action) => {
      state.bookedRedxRequest.info = [
        ...state.bookedRedxRequest.info,
        action.payload,
      ];
    },
    updateData: (state, action) => {
      const updatedData = action.payload;
      const infoList = state.bookedRedxRequest.info;
      state.bookedRedxRequest.info = infoList.map((info) => {
        const matchingUpdate = updatedData.find(
          (update) => update.id === info.id
        );
        if (matchingUpdate) {
          return {
            ...info,
            title: matchingUpdate?.title,
            note: matchingUpdate?.note,
            book_date: matchingUpdate?.book_date,
            start_time: matchingUpdate?.start_time.toLowerCase(),
            end_time: matchingUpdate?.end_time.toLowerCase(),
            facility_id: matchingUpdate?.facility_id,
            locations: matchingUpdate?.locations,
            book_by: matchingUpdate?.book_by,
            participants: matchingUpdate?.participants,
            status: matchingUpdate?.status,
          };
        }
        return info;
      });
    },
    updateApprove: (state, action) => {
      const updatedStatusId = action.payload;
      const infoList = state.bookedRedxRequest.info;
      const updatedInfoList = infoList.map((info) => {
        if (info.id === updatedStatusId) {
          return {
            ...info,
            status: "booked",
          };
        } else {
          return info;
        }
      });
      return {
        ...state,
        bookedRedxRequest: {
          ...state.bookedRedxRequest,
          info: updatedInfoList,
        },
      };
    },
    cancelBooked: (state, action) => {
      const cancelBooked = action.payload;
      const bookedList = state.bookedRedxRequest.info;
      // const filterBooked = bookedList?.filter(
      //   (booked) => booked?.id !== cancelBooked
      // );
      // state.bookedRedxRequest.info = [...filterBooked];
      // console.log("cancelBooked :",filterBooked)
      const cancelledInfoList = bookedList.map((info) => {
        if (info.id === cancelBooked) {
          return {
            ...info,
            status: "cancelled",
          };
        } else {
          return info;
        }
      });
      return {
        ...state,
        bookedRedxRequest: {
          ...state.bookedRedxRequest,
          info: cancelledInfoList,
        },
      };
    },
    setAddPeople: (state, action) => {
      state.bookedRedxRequest.participants = [...action.payload];
    },
    cancelPeople: (state, action) => {
      const cancelPeople = action.payload;
      const participantsList = state.bookedRedxRequest.participants;
      const filterParticipants = participantsList.filter(
        (participant) => participant?.id !== cancelPeople
      );
      state.bookedRedxRequest.participants = [...filterParticipants];
    },

    setCoord: (state, action) => {
      state.bookedRedxRequest.coord = [...action.payload];
    },
    setLocationList: (state, action) => {
      state.bookedRedxRequest.location = [...action.payload];
    },

    setCleanCoord: (state, action) => {
      const removeCoord = action.payload;
      console.log("from redux => ", removeCoord);
      const coordList = state.bookedRedxRequest.coord;
      const filterCoord = coordList.filter(
        (coord) => coord.address !== removeCoord.address
      );
      state.bookedRedxRequest.coord = [...filterCoord];
    },

    setCleanAddPeople: (state, action) => {
      const removedPerson = action.payload;
      const peopleList = state.bookinginfo.participants;
      const filterAddPeople = peopleList.filter(
        (person) => person !== removedPerson
      );
      state.bookinginfo.participants = [...filterAddPeople];
    },
  },
});

export default {
  yourSlice,
  bookedRedx,
};
