function Birthday({bdayName,onClose}){

    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });


    function getRandomBirthdayMessage() {
        const birthdayMessages = [
            "Happy Birthday! Wishing you a day filled with love, laughter, and all your heart desires.",
            "May your birthday be the start of a year filled with good luck, good health, and much happiness.",
            "Cheers to another year of amazing adventures and memories. Happy Birthday!",
            "Wishing you a day that's as sweet and special as you are. Happy Birthday!",
            "On your birthday, I hope you're surrounded by love, joy, and your favorite treats. Enjoy every moment!",
            "May this year be the best one yet, filled with exciting opportunities and beautiful moments. Happy Birthday!",
            "Sending you warm wishes and a big birthday hug! May your day be as wonderful as you are.",
            "Celebrate your day with laughter, fun, and the people who mean the most to you. Happy Birthday!",
            "As you blow out the candles, may all your wishes come true. Happy Birthday!",
            "Wishing you a year ahead filled with success, prosperity, and all the things that bring you happiness. Happy Birthday!",
            "Another year older, but also another year wiser. May this year bring you new adventures and growth. Happy Birthday!",
            "To the world, you may be one person, but to me, you are the world. Happy Birthday!",
            "May your day be as bright as your smile and as wonderful as you are. Happy Birthday!",
            "On your special day, may you be surrounded by love, joy, and the people who make your life truly special. Happy Birthday!",
            "Here's to the next chapter of your life being even more amazing than the last. Happy Birthday!",
            "Wishing you health, happiness, and all the success in the world. Happy Birthday!",
            "May your birthday be the beginning of a year filled with happy moments and incredible memories. Enjoy your special day!",
        ];
      
        // Generate a random index to select a message from the array
        const randomIndex = Math.floor(Math.random() * birthdayMessages.length);
      
        // Return the randomly selected birthday message
        return birthdayMessages[randomIndex];
      }

      const randomBirthdayMessage = getRandomBirthdayMessage();

    return (
        <div className="w-96">
            <p className="text-end cursor-pointer" onClick={()=> onClose()}>x</p>
            <div className="border-solid text-center flex flex-col justify-center items-center  border-s-4 border-e-4 border-blue-950 bg-white text-blue-950">
                <img className="w-96 border-solid border-b-4 border-blue-950" src="birthday.gif" alt="Birthday"></img>
                <div className="pb-4 w-60 ">
                    <div className="text-red-800 pt-2 text-sm">{formattedDate}</div>
                    <div className="font-bold pt-1">{bdayName}, {randomBirthdayMessage}</div>
                </div>
                <audio autoplay muted>
                    <source src="birthdaySong.mp3" type="audio/mp3" />
                </audio>
            </div>
        </div>
            
    )
}
export default Birthday;