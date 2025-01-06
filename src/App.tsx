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
    <span style={{display: 'flex', backgroundColor: isLight ? '#f9f9f9' : '#282130'}}>
      <div
        style={{
          position: 'relative',
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
      <a style={{position:'relative', right:0, paddingLeft: '10px', paddingRight: '10px'}} href="/">💖</a>
    </span>

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



/*
<div class="my-8 inline-block min-w-full transform overflow-hidden rounded-[13px] p-5 text-left transition-all bg-overlay-3 dark:bg-dark-overlay-3 md:min-w-[420px] shadow-level4 dark:shadow-dark-level4 w-[480px] px-6 pb-8 pt-4 opacity-100 scale-100"><div class="flex items-center justify-between pb-4"><h3 class="text-lg font-medium"><div class="flex items-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="h-6 w-6 text-green-s dark:text-dark-green-s"><path fill-rule="evenodd" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1.219-8.94l-1.805-1.804a1 1 0 00-1.414 1.414l2.512 2.512a1 1 0 001.414 0l4.95-4.95a1 1 0 10-1.414-1.414l-4.243 4.243z" clip-rule="evenodd"></path></svg><span class="text-base font-medium">Daily Coding Challenge Completed!</span></div></h3><button class="cursor-pointer rounded transition-all hover:bg-fill-3 dark:hover:bg-dark-fill-3"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="text-gray-6 dark:text-dark-gray-6 h-6 w-6"><path fill-rule="evenodd" d="M13.414 12L19 17.586A1 1 0 0117.586 19L12 13.414 6.414 19A1 1 0 015 17.586L10.586 12 5 6.414A1 1 0 116.414 5L12 10.586 17.586 5A1 1 0 1119 6.414L13.414 12z" clip-rule="evenodd"></path></svg></button></div><div class="mt-4 flex flex-col items-center"><div class="flex space-x-2 text-lg font-medium"><span>Completion Streak: </span><span class="text-blue-s dark:text-dark-blue-s">2</span><span>Days</span></div><div class="mt-2 flex flex-col items-center space-y-2 text-xs text-label-2 dark:text-dark-label-2"><span>Consistency is key, see you tomorrow!</span></div><img src="https://leetcode.com/static/images/coin.gif" class="mt-8 h-[100px] w-[100px]" alt="leetcoin"></div></div>
*/



/*
<span data-e2e-locator="submission-result">Accepted</span>

<span class="max-w-full truncate">Mar 28, 2023 21:30</span>
*/

/*
<div className="flex items-center justify-between gap-2 rounded bg-blue-100 px-2 py-1">
      {/* <div className="flex gap-1 text-blue-500">
        Hey Aman jain here <strong className="text-blue-700">pages/content-ui/src/app.tsx</strong> and save to reload.
      </div>
      <Button theme={theme} onClick={exampleThemeStorage.toggle}>
        Toggle Theme
      </Button> }
      
    </div>








    <span class="mr-1 flex-1 whitespace-nowrap text-xl font-medium text-red-s dark:text-dark-red-s" data-e2e-locator="console-result">Compile Error</span>

*/

// fetch("https://leetcode.com/submissions/detail/1494660989/check/", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "en-US,en;q=0.9,hi;q=0.8",
//     "content-type": "application/json",
//     "priority": "u=1, i",
//     "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "x-csrftoken": "lJhdRoQwPziKm08JUxw3pgeZrU6OJW3U5O7ShSHZQ3dzW7oaaKVEaIHwZc6ftUNt"
//   },
//   "referrer": "https://leetcode.com/problems/maximum-score-after-splitting-a-string/?envType=daily-question&envId=2025-01-01",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": null,
//   "method": "GET",
//   "mode": "cors",
//   "credentials": "include"
// });


// {"status_code": 11, "lang": "cpp", "run_success": true, "status_runtime": "N/A", "memory": 9464000, "display_runtime": "0", "question_id": "1537", "elapsed_time": 18, "compare_result": "00000001000000010000010000000000000000000000000000000000000000000000000000000000000000000000000000000010", "code_output": "6", "std_output": "2\n4\n", "last_testcase": "\"011101\"", "expected_output": "5", "task_finish_time": 1735789309184, "task_name": "judger.judgetask.Judge", "finished": true, "total_correct": 4, "total_testcases": 104, "runtime_percentile": null, "status_memory": "N/A", "memory_percentile": null, "pretty_lang": "C++", "submission_id": "1494660989", "input_formatted": "\"011101\"", "input": "\"011101\"", "status_msg": "Wrong Answer", "state": "SUCCESS"}