
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Roboto&display=swap" rel="stylesheet"></link>


function Dashboard ({calendarSrc,scholars}) {
    const currentDateWithoutYear = new Date().toISOString().slice(5, 10); // Get current date without year in "MM-DD" format
    console.log(currentDateWithoutYear)
    const bdayScholars = scholars.filter((scholar) => {
        const scholarDateWithoutYear = scholar.birthdate?.slice(5, 10);
        return scholarDateWithoutYear === currentDateWithoutYear;
    });


      console.log("scholars",scholars)
    return (
        <div className="">
            <h1 className='text-2xl font-semibold font-montserrat text-blue-900'>
                    Dashboard
            </h1>
            <hr className="h-1 my-4 bg-gray-200 border-0 dark:bg-gray-700"/>
            <div className="bg-white p-2 shadow-lg rounded-xl font-montserrat w-full text-blue-900"> 
                <h1>NOTICE</h1>
                <div className="text-center p-5">
                    No Notice
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between w-full font-montserrat mt-3 text-blue-900">
                <div className="flex flex-col md:w-2/6 p-2 h-96 bg-white shadow-lg rounded-xl">
                    <h1>Birthdays Today:</h1>
                    {bdayScholars.length > 0?
                    <>
                    <div className="flex text-sm  font-bold bg-blue-950 text-center text-white  rounded-t-xl">
                    <div className="flex-1 p-2 text-left">Name</div>
                    <div className="flex-1 p-2">Organization</div>
                    </div>
                    <div className="w-full h-full overflow-y-auto border-s-2 border-e-2 border-b-2">
                    {bdayScholars.map((scholar) => (
                        <div
                        key={scholar.id}
                        className="flex items-center mb-2 hover:bg-gray-300 hover:bg-opacity-75  text-sm font-semibold p-2"
                        >
                        <div className="flex-1 truncate">{scholar.name}</div>
                        <div className="flex-1 truncate text-center uppercase">{scholar.organization}</div>
                        </div>
                    ))}
                    </div>
                    </>:
                    <div className='w-full h-full'>
                    <div className="flex text-sm   font-bold bg-blue-950 text-center text-white  rounded-t-xl">
                    <div className="flex-1 p-2 text-left">Name</div>
                    <div className="flex-1 p-2">Organization</div>
                    </div>
                    <div className='w-full h-full  pt-20  text-center text-sm  text-blue-950 font-bold'>
                    No Scholar has birthday today.<br/>•ω•
                    </div>
                </div>
                    }
                </div>
                <div className="md:w-4/6 w-full mt-3 h-[400px] md:h-[360px] md:mt-0 md:ps-3 ">
                    <h1>Calendar of Activities</h1>
                    <div className="p-2 bg-white shadow-lg rounded-xl w-full h-full ">
                    <iframe className="h-full w-full z-30" src={calendarSrc} frameborder="0" scrolling="no"></iframe>
                    </div>
                </div>
            </div>
        </div>
      
    )
}

export default Dashboard;