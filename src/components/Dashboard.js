
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Roboto&display=swap" rel="stylesheet"></link>


function Dashboard ({calendarSrc}) {

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
                <div className="md:w-2/6 p-2 h-96 bg-white shadow-lg rounded-xl">
                    <h1>Birthdays:</h1>
                    <div className="p-2 mt-2 text-sm">
                        No Scholar has birthday today.
                    </div>
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