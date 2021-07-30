const button = document.getElementById("button");
// Joke api, this one uses setup: && delivery: else just joke:
// const url = "https://sv443.net/jokeapi/v2/joke/Any?blacklistFlags=nsfw,religious,racist,sexist";
// const url = "https://sv443.net/jokeapi/v2/joke/Any";

// Another joke api, uses setup: and punchline:
const url = "https://official-joke-api.appspot.com/random_joke";
const selector = document.getElementById("select-voice");
const textArea = document.getElementById("text-area");
var voices = [];
const selectVoices = [];

loadVoices();

// // Timeout needed to retrieve voices
function loadVoices() {
  voices = window.speechSynthesis.getVoices();

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
function tellMe(joke) {
  const utterance = new SpeechSynthesisUtterance(joke);
  utterance.voice = selectVoices[selector.selectedIndex];
  window.speechSynthesis.speak(utterance);
  textArea.textContent = joke;
  utterance.addEventListener("end", e => {
    disableButton(false);
  });
  // tablets and phones with no voice, use this
  setInterval(() => {
    disableButton(false);
  }, 3000);
}

// get jokes from jokes api
async function getJokes() {
  let joke = "";
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.setup) {
      // for const url = "https://official-joke-api.appspot.com/random_joke";
      joke = `${data.setup} ... ${data.punchline}`;

      // for const url = "https://sv443.net/jokeapi/v2/joke/Any?blacklistFlags=nsfw,religious,racist,sexist";
      // joke = `${data.setup} ... ${data.delivery}`;
    } else {
      joke = data.joke;
    }
    tellMe(joke);
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
