const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const analyzeBtn = document.getElementById("analyze");

const timerDisplay = document.getElementById("timer");
const status = document.getElementById("status");

const audioPlayer = document.getElementById("audioPlayback");
const result = document.getElementById("result");

let mediaRecorder;
let audioChunks = [];
let audioBlob;

let countdown;
let seconds = 20;

/* ===========================
   START RECORDING
=========================== */

startBtn.addEventListener("click", async () => {

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });

        mediaRecorder = new MediaRecorder(stream);

        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {

            audioChunks.push(event.data);

        };

        mediaRecorder.onstop = () => {

            audioBlob = new Blob(audioChunks, {
                type: "audio/webm"
            });

            const audioURL =
                URL.createObjectURL(audioBlob);

            audioPlayer.src = audioURL;

            analyzeBtn.disabled = false;

            status.innerHTML =
                "✅ Recording completed successfully.";

        };

        mediaRecorder.start();

        startBtn.disabled = true;
        stopBtn.disabled = false;
        analyzeBtn.disabled = true;

        status.innerHTML =
            "🎤 Recording... Please read naturally.";

        startTimer();

    } 
    catch (error) {
        console.error("The real error is:", error);
        alert("Error: " + error.message);
    }
});

/* ===========================
   STOP RECORDING
=========================== */

stopBtn.addEventListener("click", () => {

    stopRecording();

});

/* ===========================
   TIMER
=========================== */

function startTimer() {

    seconds = 20;

    updateTimer();

    countdown = setInterval(() => {

        seconds--;

        updateTimer();

        if (seconds <= 0) {

            stopRecording();

        }

    }, 1000);

}

function updateTimer() {

    timerDisplay.innerHTML =
        "00:" +
        String(seconds).padStart(2, "0");

}

function stopRecording() {

    clearInterval(countdown);

    if (
        mediaRecorder &&
        mediaRecorder.state !== "inactive"
    ) {

        mediaRecorder.stop();

    }

    startBtn.disabled = false;
    stopBtn.disabled = true;

}

/* ===========================
   ANALYZE SPEECH
=========================== */

analyzeBtn.addEventListener("click", () => {

    analyzeBtn.disabled = true;

    status.innerHTML =
        "🧠 AI is analyzing speech patterns...";

    result.innerHTML =
        "<h3 style='text-align:center;'>Analyzing...</h3>";

    setTimeout(() => {

        showResult();

        analyzeBtn.disabled = false;

        status.innerHTML =
            "Analysis completed.";

    }, 3000);

});

/* ===========================
   RANDOM RESULT
=========================== */

function showResult() {

    const confidence =
        randomNumber(85, 98);

    const speechRate = randomItem([

        "Normal",

        "Stable",

        "Slightly Slow"

    ]);

    const pausePattern = randomItem([

        "Normal",

        "Within Expected Range",

        "Mild Variation"

    ]);

    const vocabulary = randomItem([

        "Good Diversity",

        "Normal",

        "Consistent"

    ]);

    const fluency = randomItem([

        "Excellent",

        "Good",

        "Natural"

    ]);

    const recommendation = randomItem([

        "No significant speech abnormalities detected.",

        "Speech characteristics are within healthy limits.",

        "The analyzed speech pattern appears normal."

    ]);

    result.innerHTML =

        `
        <div class="ai-result">

            <div class="low-risk">

                🟢 LOW RISK

            </div>

            <p>

                <strong>Confidence Score</strong>

                : ${confidence}%

            </p>

            <p>

                <strong>Speech Rate</strong>

                : ${speechRate}

            </p>

            <p>

                <strong>Pause Pattern</strong>

                : ${pausePattern}

            </p>

            <p>

                <strong>Vocabulary Diversity</strong>

                : ${vocabulary}

            </p>

            <p>

                <strong>Speech Fluency</strong>

                : ${fluency}

            </p>

            <hr>

            <p>

                ${recommendation}

            </p>

            <br>

            <p>

                <strong>

                Recommendation

                </strong>

            </p>

            <p>

                Continue maintaining a healthy lifestyle,
                exercise regularly, stay socially active,
                and engage in activities that stimulate
                cognitive function.

            </p>

            <br>

            <small>

                This AI result is generated for
                demonstration and educational purposes
                only and should not be interpreted as
                a medical diagnosis.

            </small>

        </div>

        `;

}

/* ===========================
   UTILITIES
=========================== */

function randomNumber(min, max) {

    return Math.floor(

        Math.random() *

        (max - min + 1)

    ) + min;

}

function randomItem(array) {

    return array[

        Math.floor(

            Math.random() *

            array.length

        )

    ];

}