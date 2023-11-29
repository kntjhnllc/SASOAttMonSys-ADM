function Birthday(){
    return (
        <div className="">
            <p className="text-end cursor-pointer">x</p>
            <img className="w-96" src="birthday.gif" alt="Birthday"></img>
            <audio autoplay muted>
                <source src="birthdaySong.mp3" type="audio/mp3" />
            </audio>
        </div>
            
    )
}
export default Birthday;