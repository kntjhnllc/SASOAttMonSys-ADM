
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Roboto&display=swap" rel="stylesheet"></link>


function Profile () {
    return (
        <div>
            
            <div className=' block'>
                <h1 className='text-2xl font-semibold font-montserrat text-blue-900'>
                    Profile - No Data - Text Only - For Approval
                </h1>
                <hr className="h-1 my-4 bg-gray-200 border-0 dark:bg-gray-700"/>
                <div className="md:h-[520px] h-full w-full border-2 border-blue-950 rounded-xl  ">
                    <div className="md:flex">
                        <div className="p-2 text-blue-950 font-montserrat w-full">
                            <h1 className="">Your Attendance</h1>
                            <div className="p-2 md:py-3 shadow-lg rounded-xl flex mt-2">
                                {/* MEDIUM SCREEN */}
                                <div className="md:block hidden md:w-full py-4">
                                    <div className="">
                                        <h4 className="text-[10px] text-end mb-2">
                                            Information and Communications Technology Office
                                        </h4>
                                    </div>
                                    <div className="flex">
                                        <div className="p-6 h-6 w-6 bg-blue-950 rounded-3xl">
                                        </div>
                                        <div className="flex-col w-full ml-2">
                                            <div className="flex justify-between">
                                                <h1 className="">
                                                    Kent John Liloc
                                                </h1>
                                                <h1 className="">
                                                    4th Year
                                                </h1>
                                            </div>
                                            <div className="flex justify-between">
                                                <h1 className="">
                                                    Student Assistant
                                                </h1>
                                                <h1 className="">
                                                    Cluster 1
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* FOR MOBILE     */}
                                <div className="flex-col md:hidden block">
                                    <div className="p-6 h-6 w-6 bg-blue-950 rounded-3xl">
                                    </div>
                                    <div className="ml-14 -mt-12">
                                        <h1 className="">
                                            Kent John Liloc
                                        </h1>
                                        <h1 className="">
                                            Student Assistant
                                        </h1>
                                        <div className="pt-2 pb-2 flex justify-between">
                                            <h1 className="">
                                                4th Year
                                            </h1>
                                            <h1 className="">
                                                Cluster 1
                                            </h1>
                                        </div>    
                                    </div>
                                    <div className="">
                                        <h4 className="text-[10px] text-end">
                                            Information and Communications Technology Office
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-2 text-blue-950 font-montserrat">
                            <h1 className="">
                                Month of December
                            </h1>
                            <div className="flex flex-col md:flex-row">
                                <div className="flex p-2">
                                    <div className="rounded-xl shadow-lg md:h-32 md:w-32 h-40 w-40 bg-gradient-to-t from-[#172554] to-[#4B5B8F]">
                                        <div className="p-5 md:p-2 md:ml-2">
                                            <h1 className="text-white">
                                                Total
                                            </h1>
                                        </div>
                                        <div className="px-5 flex">
                                            <h1 className="border-2 border-white w-1 bg-white">
                                            </h1>   
                                            <h1 className="text-white text-5xl ml-2">
                                                30
                                            </h1>
                                        </div>
                                        <div className="p-2 mr-2">
                                            <p className="text-end text-white text-[12px]">
                                                Days
                                            </p>    
                                        </div>
                                    </div>
                                    <div className="ml-4 rounded-xl md:h-32 md:w-32 shadow-lg h-40 w-40 ">
                                        <div className="p-5 md:p-2 md:ml-2">
                                            <h1 className="text-blue-950">
                                                Present
                                            </h1>
                                        </div>
                                        <div className="px-5 flex">
                                            <h1 className="border-2 border-blue-950 w-1 bg-blue-950">
                                            </h1>   
                                            <h1 className="text-blue-950 text-5xl ml-2">
                                                25
                                            </h1>
                                        </div>
                                        <div className="p-2 mr-2">
                                            <p className="text-end text-blue-950 text-[12px]">
                                                Days
                                            </p>    
                                        </div>
                                    </div>
                                </div>
                                <div className="flex p-2">
                                    <div className="rounded-xl md:h-32 md:w-32 shadow-lg h-40 w-40">
                                        <div className="p-5 md:p-2 md:ml-2">
                                            <h1 className="text-blue-950">
                                                Absent
                                            </h1>
                                        </div>
                                        <div className="px-5 flex">
                                            <h1 className="border-2 border-blue-950 w-1 bg-blue-950">
                                            </h1>   
                                            <h1 className="text-blue-950 text-5xl ml-2">
                                                5
                                            </h1>
                                        </div>
                                        <div className="p-2 mr-2">
                                            <p className="text-end text-blue-950 text-[12px]">
                                                Days
                                            </p>    
                                        </div>
                                    </div>
                                    <div className="ml-4 rounded-xl md:h-32 md:w-32 shadow-lg h-40 w-40 ">
                                        <div className="p-5 md:p-2 md:ml-2">
                                            <h1 className="text-blue-950">
                                                Total Late
                                            </h1>
                                        </div>
                                        <div className="px-5 flex">
                                            <h1 className="border-2 border-blue-950 w-1 bg-blue-950">
                                            </h1>   
                                            <h1 className="text-blue-950 text-5xl ml-2">
                                                125
                                            </h1>
                                        </div>
                                        <div className="p-2 mr-2">
                                            <p className="text-end text-blue-950 text-[12px]">
                                                Minutes
                                            </p>    
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:flex">
                        <div className="h-full w-full p-2">
                            <div className="flex-col text-blue-950 font-montserrat p-2 rounded-xl shadow-lg bg-white">
                                <h1 className="text-lg">Duties</h1>
                                <div className="rounded-xl shadow-lg bg-gradient-to-t from-[#172554] to-[#4B5B8F] text-white p-2 mb-2">
                                    <h1 className="">
                                        Monday
                                    </h1>
                                    <p className="mt-1 text-gray-300 text-[12px]">
                                        8:00AM - 5:00PM
                                    </p>
                                </div> 
                                <div className="rounded-xl shadow-lg bg-gradient-to-t from-[#172554] to-[#4B5B8F] text-white p-2 mb-2">
                                    <h1 className="">
                                        TTH
                                    </h1>
                                    <p className="mt-1 text-gray-300 text-[12px]">
                                        8:00AM - 5:00PM
                                    </p>
                                </div>   
                                <div className="rounded-xl shadow-lg bg-gradient-to-t from-[#172554] to-[#4B5B8F] text-white p-2 mb-2">
                                    <h1 className="">
                                        WF
                                    </h1>
                                    <p className="mt-1 text-gray-300 text-[12px]">
                                        8:00AM - 5:00PM
                                    </p>
                                </div>     
                                <div className="rounded-xl shadow-lg bg-gradient-to-t from-[#172554] to-[#4B5B8F] text-white p-2">
                                    <h1 className="">
                                        Saturday
                                    </h1>
                                    <p className="mt-1 text-gray-300 text-[12px]">
                                        8:00AM - 5:00PM
                                    </p>
                                </div>             
                            </div>    
                        </div>
                        <div className="w-full h-full p-2 text-blue-950 font-montserrat">
                            <h1 className="">
                                Daily Time Record
                            </h1>
                            <div className=" border-2 shadow-lg bg-white border-blue-950 rounded-xl">
                                <div className="bg-blue-950 rounded-t-lg p-2 flex justify-between">
                                    <h1 className="text-white">
                                        Date
                                    </h1>
                                    <h1 className="text-white">
                                        Time In
                                    </h1>
                                    <h1 className="text-white">
                                        Time Out
                                    </h1>
                                </div>
                                <div className="h-60">
                                </div>        
                            </div>
                        </div>
                        <div className="w-full h-full p-2 text-blue-950 font-montserrat">
                            <h1 className="">
                                Events
                            </h1>
                            <div className=" border-2 shadow-lg bg-white border-blue-950 rounded-xl">
                                <div className="bg-blue-950 rounded-t-lg p-2 px-14 flex justify-between">
                                    <h1 className="text-white">
                                        Event
                                    </h1>
                                    <h1 className="text-white">
                                        Status
                                    </h1>
                                </div>
                                <div className="h-60">
                                </div>        
                            </div>
                        </div>   
                    </div>     
                </div>
            </div>    
        </div>
    )
}

export default Profile;