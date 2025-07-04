import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
//The main concept of the Project is using React fetching the information form API and displaying it in the screen 
function App() {
  const [word, setword] = useState("");
  const [getData, setData] = useState(null);
  const [afterButtonClicked, setafterButtonClicked] = useState(false);
  const [error, seterror] = useState("");

//To update the input word to the use state named as word
  const handleChange = (e) => {
    setword(e.target.value);
  };
//whenever the afterButtonClicked is changed the useEffect will start work
  useEffect(() => {
    async function handle() {
      try {
        const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);//fetching the data
        setData(res.data); //setting the data to the variable
        console.log(res.data)
      } catch (error) {
        seterror("Sorry word is not in our dictionary"); //to handle error initailly make  the error as null after once error came it will update the error
      }
    }

    if (word) handle(); // check word available and call again 
  }, [afterButtonClicked]);

  return (
    <>
      <h1 className="container text-center mt-5 top-txt">Dictionary App</h1>
      {!afterButtonClicked && ( // first one always be true in &&  so we meake true by  !
        <div className="container text-center">
          <label className="txt text-center mb-4"> Enter the Word </label>
          <br/>
          <input
            className="input-box text-center mb-4 "
            onChange={handleChange}
            value={word}
            placeholder="Enter the word here... "
          />
          <br/>
          <button
            className="btns"
            onClick={() => {
              if (word.trim() === "" || /\d/.test(word)) { //If user enter number or no word it will generate alert 
                alert("Please Enter a Word!");
                return;
              }
              setafterButtonClicked(true); //it update the afterButtonclicked to true then only the another part will execute
            }}
          >
            Fetch Information
          </button>
        </div>
      )}
      {/* Error handling */}
      <h2 className="text-center">{error}</h2> 
      {/* // this will null until error generate and state update  */}
      {/*  -----------------------------------------------------------another part after button is clicked------------------------------------------------- */}
      {afterButtonClicked && (
        <div className="container text-center ">
          {getData && getData[0] && ( //checking the data is available
            <>
              <h1>
                <strong>
                  {getData[0].word.charAt(0).toUpperCase() +   // making first letter capital
                    getData[0].word.slice(1)}
                </strong>
              </h1>
               <h5>
                <strong>Definition:</strong>
                {getData[0].meanings[0]?.definitions[0]?.definition} 
                {/* // fetching data from api */}
              </h5>
            

              {(() => {
                const validAudio = getData[0].phonetics?.find((p) => p.audio); //api has array of audio so checking for audio here
                return validAudio ? (
                  <h5>
                    <strong>
                      <span className="">Pronunciation:</span>
                    </strong>
                    <audio
                      controls
                      autoPlay
                      className="mt-2"
                      style={{ height: "40px", width: "300px" }}
                    >
                      <source src={validAudio.audio} type="audio/mpeg" />
                    </audio>
                  </h5>
                ) : (
                  
                  <h5>
                    <strong>Pronunciation:</strong> Not available
                  </h5>
                
                );
              })()} 
              {/* //Immediately Invoked Function Expression is used so that a variable can create near and checked simultaneously and called immediate after a function is happen*/}

              {/* //Part of speech */}
           
              {getData[0]?.meanings ? ( //ternary operator is used to handle if data is not available 
                <div>
                  <h5>
                    <strong>Part of Speech:</strong>
                    {getData[0].meanings[0]?.partOfSpeech}
                  </h5>
                </div>
              ) : (
                <h5>
                  <strong>Part of Speech:</strong> Not available
                </h5>
              )}
              {/* End of part of speech */}

{/* Antonyms */}
              {(() => {
                const antony = getData[0]?.meanings?.find(
                  (m) => m.antonyms?.length > 0  //  to avoid returning empty we put length >0
                );
              
                return antony ? (
                  <>
                    <h5>
                      <strong>
                        <span className="">Antonyms:</span>
                      </strong>
                      {antony.antonyms.join(", ")} 
                      {/* //display by join , */}
                    </h5>
                  </>
                ) : (
                  <h5>
                    <strong>Antonyms:</strong>
                    Not available
                  </h5>
                );
              })()} 
              {/* In the above function also IIFE is used */}
             {/* In the below button all are reset to initial state so that process start from first  */}
              <button
                className="btns-1"
                onClick={() => {
                  setafterButtonClicked(false);
                  setword("");
                  setData(null);
                  seterror("");
                }}
              >
                Back
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default App;
