import React, { useEffect, useRef, useState } from "react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoIosClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

import { useParams } from "react-router-dom";
// import LoadingComponent from "../loading/LoadingComponent";
import Images from "../../assets/icons";
import {
  useUsersQuery,
  useParticipantsQuery,
} from "../../apps/features/apiSlice";

function AddPeople({
  addPerson,
  setAddPerson,
  participants,
  isDropdownOpen,
  setIsDropdownOpen,
  filteredPeople,
  setFilteredPeople,
}) {
  const [inputValue, setInputValue] = useState("");
  const [searchPeople, setSearchPeople] = useState([]);
  // const [filteredPeople, setFilteredPeople] = useState([]);
  // const [addPerson, setAddPerson] = useState([]);
  const [showFilteredPeople, setShowFilteredPeople] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const inputRef = useRef(null);

  // const { data: peopleLists } = useUsersQuery();
  // console.log(peopleLists, "people.......");

  const { data: participantsData } = useParticipantsQuery();

  const loginUser = useSelector((state) => state.auth.id);
  // const usersPeoples = peopleLists?.data
  //   ?.filter((person) => person.id !== loginUser)
  //   ?.sort((a, b) => a.name.localeCompare(b.name));

  const participantLists = participantsData
    ?.filter((participant) => participant.id !== loginUser)
    ?.sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        !event.target.closest(".scrollbar-create")
      ) {
        setIsDropdownOpen(false);
        setInputValue("");
        setShowFilteredPeople(addPerson);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [addPerson]);

  const allUser = participantLists?.filter((person) =>
    person.name.toLowerCase().includes(inputValue)
  );

  const dropDownList = () => {
    if (addPerson?.length === 0) {
      setFilteredPeople(allUser);
    } else {
      const filtered = participantLists?.filter(
        (person) => !addPerson?.map((p) => p.id).includes(person.id)
      );
      setFilteredPeople(filtered);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e?.target.value;
    setInputValue(inputValue);

    if (inputValue === "") {
      setFilteredPeople(participantLists);
    } else {
      const filtered = participantLists?.filter((person) => {
        const personValue = (person.name || "").toString().toLowerCase();
        const inputLowerCase = inputValue.toLowerCase();

        return personValue.includes(inputLowerCase);
      });

      setFilteredPeople(filtered);
    }
  };

  const handleItemRemove = (person) => {
    const updatedItems = showFilteredPeople?.filter(
      (people) => people.id !== person.id
    );
    console.log(updatedItems, "updatedItemsss");

    setShowFilteredPeople(updatedItems);
    setAddPerson(updatedItems);
  };

  // const handleItemRemove = (person) => {
  //   setAddPerson(addPerson.filter((p) => p.id !== person.id));
  // };

  const handleSearchPeople = (value) => {
    const result = allUser?.filter((person) =>
      person.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPeople(result);
  };

  const handleSelectAll = (e) => {
    // setInputValue(e.target.value);
    setSelectAll((prevSelectAll) => !prevSelectAll);
    if (!selectAll) {
      setAddPerson(allUser);
      // setIsPersonAdded(true)
    } else {
      setAddPerson([]);
      // setIsPersonAdded(false)
    }
  };

  useEffect(() => {
    if (participants) {
      setAddPerson(participants);
      setShowFilteredPeople(participants);
    }
  }, [participants, setAddPerson, setShowFilteredPeople]);

  useEffect(() => {
    setFilteredPeople(allUser);
  }, [participantsData]);

  const handleSelectDropDownPerson = (person) => {
    const personAdded = addPerson.some((p) => p.id === person.id);
    if (!personAdded) {
      setAddPerson((prevList) => {
        if (!prevList.some((p) => p.id === person.id)) {
          return [...prevList, person];
        } else {
          return prevList;
        }
      });
    } else {
      setAddPerson((prevList) => prevList.filter((p) => p.id !== person.id));
    }

    if (selectAll) {
      setSelectAll(false);
    }
  };

  return (
    <>
      <section className="addPeopeContainer flex ml-2 ">
        <AiOutlineUsergroupAdd
          size={20}
          className="addGroup w-[40px] pr-[15px]"
        />
        <input
          type="text"
          placeholder="Add People"
          tabIndex="-1"
          value={inputValue}
          onChange={handleInputChange}
          onClick={() => {
            setIsDropdownOpen((prev) => !prev);
            dropDownList();
          }}
          className="bg-transparent outline-none focus:outline-none  placeholder:text-gray-500 border-b border-gray-300 w-full"
        />
      </section>

      {/* dropdown list */}
      {/* {filteredPeople?.length > 0 && ( */}
      <div
        style={{ position: "relative", top: "-60px", zIndex: 10 }}
        ref={inputRef}
      >
        {isDropdownOpen && (
          <div className="scrollbar-create py-[10px] px-[15px] border-[0.4px] border-gray-300 rounded-lg bg-slate-300 shadow-md">
            <div className="flex  justify-between items-center mb-4">
              <div>
                <input
                  type="text"
                  // value={searchPeople}
                  onChange={(e) => handleSearchPeople(e.target.value)}
                  name=""
                  placeholder="Search people"
                  id=""
                  className=" focus:outline-none bg-transparent text-gray-500 ml-4"
                />
              </div>
              <div
                className="close-btn "
                onClick={() => setIsDropdownOpen(false)}
              >
                <img
                  src={Images.CloseIcon}
                  alt="close"
                  className="w-[16px] mt-2 cursor-pointer filter-[contrast(0.5)]"
                />
              </div>
            </div>
            <div
              className="user-list-box min-h-[350px] max-h-[350px] overflow-auto w-full py-[5px] px-[15px] mt-[5px]"
              // style={{
              //   maxHeight:
              //     facilityFilter[0]?.needLocation == 0 ? "130px" : "190px",
              // }}
            >
              {/* <LoadingComponent loadingGroup={"u"} design="true"> */}
              {inputValue == "" ? (
                <div
                  className="all-Box h-[50px] flex align-middle justify-between border-b-[1px] border-gray-300 cursor-pointer"
                  onClick={(e) => handleSelectAll(e)}
                >
                  <div className="all-Img flex align-middle gap-[10px]">
                    <figure
                      className="all-Icon w-[30px] h-[30px] rounded-[180px] bg-[#05445e] text-white ml-[4px] flex justify-center items-center
                    "
                    >
                      A
                    </figure>
                    <span>All</span>
                  </div>
                  <input
                    className="dropDownPeopleBox "
                    id="all-CheckBox rounded-[4px] border-b-transparent"
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </div>
              ) : null}
              {filteredPeople?.map((person, index) => (
                <div
                  className="dropDownPeopleList flex justify-between items-center h-[50px] ml-[4px] cursor-pointer"
                  key={index}
                  onClick={(e) => handleSelectDropDownPerson(person)}
                >
                  <div className="dropDownPeople flex gap-[10px] cursor-pointer">
                    <figure className="dropDownPeopleImg w-[30px] h-[30px] bg-[#05445e] rounded-[180px] flex justify-center items-center text-white">
                      {person.name.split("").slice(0, 1)}
                    </figure>
                    <span className="dropDownPeopleName flex items-center text-[#333]">
                      {person.name}
                    </span>
                  </div>
                  <input
                    className="dropDownPeopleBox rounded-[4px]"
                    type="checkbox"
                    checked={addPerson.some((p) => p.id === person.id)}
                    onChange={() => handleSelectDropDownPerson(person)}
                  />
                </div>
              ))}
              {/* </LoadingComponent> */}
            </div>
          </div>
        )}
      </div>

      {/* )} */}

      {/* show lists */}

      {
        // !isDropdownOpen &&
        showFilteredPeople?.length > 0 ? (
          <section
            className="showPeopleListsContainer ml-[45px] mt-[10px] flex flex-col"
            style={{
              position: isDropdownOpen && "relative",
              marginTop:
                isDropdownOpen && `${-60 - 46 * showFilteredPeople?.length}px`,
            }}
          >
            {showFilteredPeople?.map((person, key) => (
              <section
                className="addPerson mb-4"
                key={key}
                onClick={() => handleItemRemove(person)}
              >
                <div className="flex">
                  <article className="showPeopleContainer flex content-center">
                    {person?.avatar_url !== null ? (
                      <figure className="shwoPeopleImgCustom w-[30px] h-[30px] bg-[#05445e] rounded-[180px] flex justify-center items-center text-white">
                        {person?.name?.split("").slice(0, 1)}
                      </figure>
                    ) : (
                      <img
                        src={person?.avatar_url}
                        className="shwoPeopleImg w-[30px] h-[30px] rounded-[180px]"
                      />
                    )}

                    <span className="shwoPeopleName ml-[5px] p-1 h-[30px]">
                      {person?.name}
                    </span>
                  </article>
                  <IoIosClose
                    className="shwoPeopleIcon p-1 h-[30px] cursor-pointer"
                    size={30}
                  />
                </div>
              </section>
            ))}
          </section>
        ) : null
      }
    </>
  );
}

export default AddPeople;
