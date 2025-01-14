import { useEffect, useState } from 'react';
import { Button } from '@extension/ui';
import { useStorage } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import { ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';


export default function App() {
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const { width, height } = useWindowSize()
  const [toastShown, setToastShown] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(true)
  /////////////////////////////////////////////////////////////////////
  const messages: string[] = [
    "You're doing amazing! Each small step counts towards success.",
    "Remember, debugging is twice as hard as writing the code.",
    "Tip: Try other possible methods to solve the problem before jumping into the next",
    "Don't let one failure define your progress. Keep trying!",
    "Tip: Try explaining your solutions to someone to gain confidence in your problem solving skills!",
    "Tip: Break down complex problems into smaller, manageable tasks.",
    "Every bug you fix is a step closer to becoming a better developer.",
    "Don't be afraid to ask for help. Collaboration leads to better solutions.",
    "Tip: Keep learning new technologies to stay ahead in the field.",
    "Remember, every expert was once a beginner. Keep pushing forward.",
    "Celebrate your progress, no matter how small. It all adds up.",
    "Tip: Write tests for your code to ensure it works as expected.",
    "Stay curious and keep exploring new ways to solve problems.",
    "Practice makes perfect, but learning from mistakes is the real key.",
    "Tip: Always break down problems into smaller parts.",
    "Take a deep breath. Coding is a marathon, not a sprint.",
    "Consistency is the key. A little effort every day makes a big difference.",
    "Tip: Use meaningful variable names for better readability.",
    "A failed attempt is just another step closer to success.",
    "Tip: Always test edge cases in your code.",
    "Your only competition is yourself—keep improving daily.",
    "Tip: Comment your code; future you will thank you.",
    "Rest is productivity's best friend. Take short breaks often.",
    "Tip: Before starting to code, write pseudocode to clarify your approach.",
    "It's not about being the best; it's about being better than yesterday.",
    "Tip: Befor Jumping into the solution, try to use the hints provided!",
    "Celebrate small wins—they build momentum for bigger achievements.",
    "Tip: Read the problem statement carefully before jumping into coding.",
    "Success is the sum of small efforts repeated day in and day out.",
    "Tip: Use pen and paper to visualize your approach before coding.",
  ];

  const [currentMessage, setCurrentMessage] = useState(messages[Math.floor(Math.random() * messages.length)]);
  
  useEffect(() => {
    // Function to pick the next message
    const updateMessage = () => {
      setCurrentMessage(messages[Math.floor(Math.random() * messages.length)]);
    };    

    // Set interval for 10 minutes (600,000 ms)
    const interval = setInterval(updateMessage, 120000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);
  
  // Function to trigger the confetti logic
  function triggerConfetti() {
    console.log("Element appeared in the DOM");
    setShowConfetti(true);

    setTimeout(() => {
      setShowConfetti(false); // Reset state after 10 seconds
    }, 10000);
  }

  const submitButton = document.querySelector('button[data-e2e-locator="console-submit-button"]');
  console.log(submitButton); // Logs the <button> element

  if(submitButton){
    submitButton.addEventListener('click', () => {
      console.log('Submit button clicked');
      pollSubmissionResult();
      setTimeout(() => {
        pollWrongSubmissionResult();
      }, 7000);
    })
  }else{
    console.log("Submit Button Not Found");
  }


  function pollSubmissionResult(maxPollingTime=20000, interval=1000) {
    const startTime = Date.now();
    const intervalId = setInterval(() => {
      const submissionResult = document.querySelector('span[data-e2e-locator="submission-result"]');

      if(submissionResult && submissionResult.textContent==='Accepted'){
        let timeSpan = document.querySelector("span.max-w-full.truncate");
        if(timeSpan != null){
          let timeText = timeSpan.textContent!.trim(); // e.g., "Jan 01, 2025 11:39"

          // Parse the extracted time into a Date object
          let extractedTime = new Date(timeText); // Convert the text into a Date object
          let currentTime = new Date(); // Get the current time

          let timeDifference:number = Math.abs(currentTime.getTime() - extractedTime.getTime()) / (1000 * 60); // Difference in minutes

          if (timeDifference >= 0 && timeDifference <= 1 && !toastShown) {
            console.log("Time difference is within 0-1 minutes. Trigger your logic here.");
            console.log('Submission Accepted');
            triggerConfetti();
            toast.success("🎉 Let's go! 🚀 You're on fire! 🔥", {
              position: "top-right",
              toastId: "success-toast"
            });

            // toast.success("🎉 You're awesome! 🚀", {
            //   position: "top-right",
            //   toastId: "success-toast",
            //   style: {
            //     backgroundColor: isLight ? '#f9f9f9' : '#282130', // Light or dark background
            //     color: isLight ? '#333' : '#d9d4d4', // Light or dark text color
            //     padding: '10px',
            //     borderRadius: '10px', // Rounded corners
            //     boxShadow: isLight
            //       ? '0 2px 5px rgba(0, 0, 0, 0.2)' // Subtle shadow for light mode
            //       : '0 2px 5px rgba(255, 255, 255, 0.1)', // Subtle shadow for dark mode
            //     border: isLight ? '1px solid #ccc' : '1px solid #444', // Light or dark border
            //   },
            // });

            setToastShown(true);
            clearInterval(intervalId);
          } else {
            console.log("Time difference is outside the range of 0-1 minutes.");
          }
        }
      }
      if(Date.now() - startTime > maxPollingTime){
        console.log('Max polling time reached');
        clearInterval(intervalId);
      }
    }, interval);
  }

  function pollWrongSubmissionResult(maxPollingTime=30000, interval=1000) {
    let startTime = Date.now();
    console.log('Polling for wrong submission');

    const intervalId = setInterval(() => {
      const submissionResult = document.querySelector('span[data-e2e-locator="submission-result"]');
      const consoleResult = document.querySelector('span[data-e2e-locator="console-result"]');
      const element = document.querySelector('h3.flex.items-center.text-xl.font-semibold.text-red-60.dark\\:text-red-60');

      let hasToastShown : boolean = false;

      if((!hasToastShown && submissionResult && submissionResult.textContent!=='Accepted') || ( !hasToastShown && consoleResult != null) || (!hasToastShown && element != null)){
        console.log('Submission Result is not Accepted! Inside wrong submission');
        toast.warning("Don't Give Up! Try Again ⚡", {
          position: "top-right",
          toastId: "success-toast"
        });
        hasToastShown = true;
        clearInterval(intervalId);
      }

      if(Date.now() - startTime > maxPollingTime){
        console.log('Max polling time reached');
        clearInterval(intervalId);
      }
    }, interval);
  }




  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';

  useEffect(() => {
    console.log('content ui loaded');
    console.log(Date.now());
    console.log(new Date(Date.now()).toISOString());
  }, []);

  return (
    <>
    {displayMessage && <span style={{display: 'flex', backgroundColor: isLight ? '#f9f9f9' : '#282130'}}>
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          backgroundColor: isLight ? '#f9f9f9' : '#282130',
          color: isLight ? '#333' : '#d9d4d4',
          padding: 0,
          textAlign: 'center',
          zIndex: 1000,
          boxShadow: '0px -2px 5px rgba(0,0,0,0.1)',
        }}
      >
        {currentMessage}
      </div>
      <button style={{position:'fixed', bottom:0, right:0, paddingLeft: '10px', paddingRight: '10px', zIndex:1001, color: isLight ? '#333' : '#d9d4d4'}} onClick={() => setDisplayMessage(false)}>
        X
      </button>
    </span>}

    {showConfetti && (
        <Confetti numberOfPieces={1000} width={width} height={height} recycle={false}  tweenDuration={12000} style={{ zIndex: 9999 }}/>
      )}
    <ToastContainer
      toastClassName={isLight ? "toast-light" : "toast-dark"}
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />

</>
    
  );
}
