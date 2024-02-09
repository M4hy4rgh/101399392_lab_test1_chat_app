import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ParticlesComponent from "../components/ParticlesComponent";
import axios from "axios";




export default function Dashboard() {
    const [groupList, setGroupList] = useState([]);
    const [userlist, setUserlist] = useState([]);

    useEffect(() => {
        loadGroups();
        loadUsers();
    }, []);


    const loadGroups = async () => {
        try {
            const result = await axios.get("http://localhost:8089/group/groups");
            setGroupList(result.data);
        } catch (err) {
            console.error("Error loading groups:", err);
        }
    };

    const loadUsers = async () => {
        try {
            const result = await axios.get("http://localhost:8089/user/users");
            setUserlist(result.data.data);
        } catch (err) {
            console.error("Error loading users:", err);
        }
    };

    const deleteGroup = async (id) => {
        // console.log(groupList[0]._id);
        try {
            await axios.delete(`http://localhost:8089/group/${id}`);
            loadGroups();
        } catch (error) {
            console.error("Error deleting group:", error);
        }
    };

    //add the members to the group
    
    const addMembers = async (id) => {
        navigate(`/chat/${id}`);
    };

    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };



    return (
        <div>
            <div className="flex items-start justify-start pl-5 py-4 text-gray-500 bg-[#282828] ">
                <h1 className="text-4xl font-bold">Dashboard</h1>
            </div>

            <div className="container mx-auto min-h-screen min-w-full">
                <ParticlesComponent />

                <div className="flex items-center justify-center min-h-screen min-w-full px-5 ">
                    <div
                        className="flex flex-col justify-center items-center relative  p-4 my-10 bg-white rounded-lg  shadow-[0px_0px_25px_10px_#282828]
          sm:w-[90%] md:w-full lg:w-2/3 "
                    >
                        <div className="flex flex-col justify-center items-center my-3 ">
                            <h2 className="mb-2 text-2xl font-bold text-gray-700">
                Welcome to Dashboard
                            </h2>
                        </div>

                        <div className="flex flex-row gap-3 lg:px-12 lg:absolute lg:top-6 lg:right-12  xl:px-0 xl:top-6 xl:right-6">
                            <Link to="/group">
                                <button className="text-slate-100 bg-sky-700 rounded-xl px-4 py-2 hover:bg-gray-700/50  text-xl ">
                                Add Group
                                </button>
                            </Link>
                            <Link to="/">
                                <button
                                    className="text-slate-700 bg-red-700/30 rounded-xl px-4 py-2 
                hover:bg-red-700/50 text-xl "
                                    onClick={logout}
                                >
                  Log-out
                                </button>
                            </Link>
                        </div>

                        <div className="flex w-full flex-row justify-center items-center gap-8">
                            <div className="w-6/12 border-r-2 pr-6 max-h-[450px] overflow-auto sm:flex sm:flex-col sm:justify-center sm:items-center lg:w-5/12">
                                {userlist.map((user) => (
                                    <div
                                        key={user._id}
                                        className="flex flex-col justify-between items-left text-slate-700
                                        py-2 gap-2 rounded-none sm:w-full"
                                    >
                                        <div className=" bg-gray-700/30 rounded-xl divide-y">
                                            <div className="flex flex-row gap-16 px-3 py-2">
                                                <h4>User Name:</h4>
                                                <p>
                                                    {user.username}  
                                                </p>
                                            </div>
                                        </div>                                        
                                    </div>
                                ))
                                }
                                {userlist.length === 0 && (
                                    <div className="flex flex-col justify-center items-center py-3">
                                        <div className="flex-1 justify-center items-center py-32 pl-16 pr-8 bg-slate-600/80 rounded-2xl shadow-lg shadow-black/70">
                                            <h4 className="text-xl text-white -ml-9">No user available</h4>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="w-full min-h-[570px] max-h-[570px] overflow-auto overscroll-contain pt-48 sm:flex sm:flex-col sm:justify-center sm:items-center">
                                {groupList.map((group) => (
                                    <div
                                        key={group._id}
                                        className="flex flex-col justify-between items-left text-slate-700
                                            py-4 px-2 gap-2 border-b-2 border-black rounded-none pb-4 sm:w-full"
                                    >
                                        <div className=" bg-gray-700/30 rounded-xl divide-y">
                                            <div className="flex flex-row  gap-16  px-3 py-2">
                                                <h4>Group Name:</h4>
                                                <p>
                                                    {group.name}
                                                </p>
                                            </div>
                                            <div className="flex flex-row gap-16 px-3 py-2">
                                                <h4>Members:</h4>
                                                <p>
                                                    {group.members.length} member/s
                                                </p>
                                            </div>
                                            
                                            <div
                                                className="flex flex-row justify-center items-center px-2 py-2
                                                    sm:items-right sm:justify-end">
                                                <div className="flex flex-row space-x-5 gap-16 px-3 py-2">
                                                    <Link to={`/chat/${group._id}`}>
                                                        <button className="bg-gray-700/30 rounded-xl px-4 py-2 hover:bg-gray-700/50 sm:px-12"
                                                        onClick={() => addMembers(group._id)}
                                                        >
                                                        Join
                                                        </button>
                                                    </Link>
                                                </div>
                                                <div className="flex flex-row space-x-5 gap-16 px-3 py-2">
                                                    <button type="submit" onClick={() => deleteGroup(group._id)} className="bg-red-500/70 rounded-xl px-4 py-2 hover:bg-red-700 hover:text-white sm:px-12">
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {groupList.length === 0 && (
                                    <div className="flex flex-col justify-center items-center  py-3">
                                        <div className="flex-1 justify-center items-center py-28 px-32 bg-slate-600/80 rounded-2xl shadow-lg shadow-black/70">
                                            <h4 className="text-xl text-white">No group available</h4>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
