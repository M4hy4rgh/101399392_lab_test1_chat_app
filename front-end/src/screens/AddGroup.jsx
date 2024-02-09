import React, { useState, useEffect } from "react";
import { RxTextAlignLeft } from "react-icons/rx";
import ParticlesComponent from "../components/ParticlesComponent";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import axios from "axios";


export default function AddGroup() {
  const [formData, setFormData] = useState({
    name: "",
    member: [],
  });
  const navigate = useNavigate();

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: capitalizeFirstLetter(value) });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const userid = localStorage.getItem("id");
    
    try {
      const newGp = await axios.post("http://localhost:8089/group/create", formData);
      console.log("nnnn",newGp);

    
      if(newGp.data._id) {
        const groupid = newGp.data._id;
  
        await axios.post(`http://localhost:8089/group/${groupid}/members`, {
          memberId: userid,
        });
  
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response.data.error);
      console.log(err);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-start justify-start pl-5 py-4  text-gray-500 bg-[#282828] absolute w-full z-10">
        <h1 className="text-4xl font-bold">Add Group</h1>
      </div>
      <div className="container mx-auto min-h-screen min-w-full">
        <ParticlesComponent />

        <div className="flex items-center justify-center min-h-screen min-w-fit px-8">
          <div className="flex flex-col relative justify-center items-center w-full p-4 bg-white rounded-lg md:w-2/3 lg:w-1/3 z-10 mt-16 shadow-[0px_0px_25px_10px_#282828]">
            <Link
              to="/dashboard"
              className="absolute top-2 left-2 hover:cursor-pointer"
            >
              <IoArrowBackOutline className="text-4xl text-black" />
            </Link>
            <div className="flex flex-col justify-center items-center ">
              <h2 className="mb-2 text-xl font-bold text-gray-700">
                Add Group
              </h2>
              <p className="text-sm text-gray-400">
                Please fill the form to add a new group.
              </p>
            </div>

            {/* groupName */}
            <div className="flex flex-col mt-4 w-80 justify-center ">
              <form
                onSubmit={handleSubmit}
                autoComplete="false"
                className=" flex flex-col"
              >
                <div className="flex flex-col relative ">
                  <label className="text-gray-400 mb-1">Group name</label>
                  <div className="flex relative mx-2">
                    <span className="inline-flex items-center justify-center absolute left-0 top-0 w-10 h-full pl-3 pr-3 text-gray-400 scale-[1.2]">
                      <RxTextAlignLeft />
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full h-10 pl-10 pr-3 text-base placeholder-gray-400 text-black border rounded-lg focus:shadow-outline"
                      placeholder="Group name"
                      required
                    />
                  </div>
                </div>
                {/* Submit Button */}
                <div className="flex flex-col mt-6 w-52  justify-self-center self-center ">
                  <button
                    type="submit"
                    className=" place-self-center w-full h-12 px-6 py-2 font-medium tracking-wide text-white capitalize
                      duration-200 transform bg-sky-600 rounded-full hover:bg-sky-500
                      focus:outline-none focus:bg-sky-500 hover:scale-[1.095] transition-all duration-800 ease-linear "
                  >
                    Add Group
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
