const button = document.getElementById("button");
const proxyURL = "https://quicors.herokuapp.com/";
// Joke api, this one uses setup: && delivery: else just joke:
// const url = proxyURL + "https://sv443.net/jokeapi/v2/joke/Any?blacklistFlags=nsfw,religious,racist,sexist";
// const url = "https://sv443.net/jokeapi/v2/joke/Any";

const url = proxyURL + "https://sv443.net/jokeapi/v2/joke/Any?safe-mode";
// const url = proxyURL + "https://icanhazdadjoke.com";

const headers = {
  headers: {
  'Accept': 'application/json',
  }
};

// Another joke api, uses setup: and punchline:
// const url = proxyURL + "https://official-joke-api.appspot.com/random_joke";

const selector = document.getElementById("select-voice");
var textAreaJokeSetup = document.getElementById("text-area-joke-setup");
var textAreaJokeDelivery = document.getElementById("text-area-joke-delivery");
var voices = [];
const selectVoices = [];

loadVoices();

// // Timeout needed to retrieve voices
async function loadVoices() {
  voices = await window.speechSynthesis.getVoices();

  if (voices.length !== 0) {
    voices.forEach(voice => {
      const langCode = /en/;
      const isEnglish = langCode.test(voice.lang);

      if (isEnglish) {
        selectVoices.push(voice);
        const opt = document.createElement("option");
        opt.textContent = voice.name;
        selector.appendChild(opt);
      }
    });
  } else {
    setTimeout(function () {
      loadVoices();
    }, 10);
  }
}

// Selected User
function tellMe(jokeSetup, jokeDelivery) {

    let utterance = new SpeechSynthesisUtterance(jokeSetup);
    
    utterance.voice = selectVoices[selector.selectedIndex];
    window.speechSynthesis.speak(utterance);
    textAreaJokeSetup.textContent = jokeSetup;

    // utterance.addEventListener("end", () => {
    //     // check if there is second part to joke
    //     if(jokeDelivery) {
    //         utterance = new SpeechSynthesisUtterance(jokeDelivery);
    //         setTimeout(() => {
    //             window.speechSynthesis.speak(utterance);
    //             textAreaJokeDelivery.textContent = jokeDelivery;
    //             disableButton(false);
    //         }, 1500);
    //     } else {
    //         disableButton(false);
    //     }
    // });

    // check if there is second part to joke
    if(jokeDelivery) {
        utterance = new SpeechSynthesisUtterance(jokeDelivery);
        setTimeout(() => {
            window.speechSynthesis.speak(utterance);
            textAreaJokeDelivery.textContent = jokeDelivery;
            disableButton(false);
        }, 1500);
    } else {
        disableButton(false);
    }

    // tablets and phones with no voice, use this
    // setTimeout(() => {
    //     disableButton(false);
    // }, 5000);
}

// get jokes from jokes api
async function getJokes() {

  let jokeSetup = "";
  let jokeDelivery = "";
  textAreaJokeSetup.textContent = "";
  textAreaJokeDelivery.textContent = "";

  try {
    const response = await fetch(url, headers);
    const data = await response.json();
    console.log(data);

    if (data.setup) {
        // two part joke
        jokeSetup = data.setup;
        jokeDelivery = data.delivery;
    } else {
        // single part joke
        jokeSetup = data.joke;
    }
    
    tellMe(jokeSetup, jokeDelivery);
  } catch (e) {
    console.log("getJokes error: " + e);
  }
}

function disableButton(bool) {
  button.disabled = bool;
}

// Event Listeners
function keyEventHandler(event) {
  if (event.keyCode === 13 || event.keyCode === 32) {
    disableButton(true);
    getJokes();
  }
}

button.addEventListener("click", e => {
  disableButton(true);
  getJokes();
});

document.addEventListener("keyup", keyEventHandler);
