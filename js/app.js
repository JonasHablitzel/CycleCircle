const whistle = new Audio("sounds/gymnasium.wav");
let training = [];

const colormin = getComputedStyle(document.querySelector(":root"))
  .getPropertyValue("--intensitymin")
  .replace("#", "")
  .trim();
const colormid = getComputedStyle(document.querySelector(":root"))
  .getPropertyValue("--intensitymid")
  .replace("#", "")
  .trim();
const colormax = getComputedStyle(document.querySelector(":root"))
  .getPropertyValue("--intensitymax")
  .replace("#", "")
  .trim();
const effortbins = 10;





let openFile = function (event) {
  let input = event.target;
  let reader = new FileReader();
  let csv;
  reader.onload = function () {
    csv = reader.result;  
    const array = csvstrtoarray(csv);
    if(array.length > 0){
      const tableref = document.getElementById("TrainingTable")
      DeleteAllRows(tableref,fheader=false);
      InsertRows(tableref,array);
    }    
  };

  reader.readAsText(input.files[0]);  
};

function csvstrtoarray(csvstr){
  const rows = csvstr
  .split(/\n/)
  .map(function (lineStr) {
    values = lineStr.split(",").map(parseFloat);
    return values;
  })
  .slice(1);
  const filtered = rows.filter(function (el) {
    return !isNaN(parseInt(el[0]));
  });
  return filtered;
}

function gettraining() {
  filtered = csvstrtoarray(data);
  filtered[0].starttime = 0;
  filtered[0].endtime = filtered[0].duration;
  for (let i = 1; i < filtered.length; i++) {
    filtered[i].starttime = filtered[i - 1].endtime;
    filtered[i].endtime = filtered[i].starttime + filtered[i].duration;
  }
  return filtered;
}

function gettrainingzone(duartion) {
  let m = duartion / 60;
  return training.find(function (element) {
    return element.endtime > m;
  });
}

function pickHex(gradientratio) {
  let color1;
  let color2;
  let ratio = 0;

  if (gradientratio >= 0.5) {
    color1 = colormid;
    color2 = colormax;
    ratio = (gradientratio - 0.5) * 2;
  } else {
    color1 = colormin;
    color2 = colormid;
    ratio = gradientratio * 2;
  }

  let r = Math.ceil(
    parseInt(color2.substring(0, 2), 16) * ratio +
      parseInt(color1.substring(0, 2), 16) * (1 - ratio)
  );
  let g = Math.ceil(
    parseInt(color2.substring(2, 4), 16) * ratio +
      parseInt(color1.substring(2, 4), 16) * (1 - ratio)
  );
  let b = Math.ceil(
    parseInt(color2.substring(4, 6), 16) * ratio +
      parseInt(color1.substring(4, 6), 16) * (1 - ratio)
  );

  return `rgb(${r},${g},${b})`;
}

function pad2(n) {
  return ("0" + n).slice(-2);
}

function changegauge(intensityzone) {
  const root = document.querySelector(":root");
  const fraction = intensityzone / effortbins;
  const degrees = Math.round(fraction * 180);
  document.getElementById("intenstitle").innerText = intensityzone;
  const color = pickHex(fraction);
  root.style.setProperty("--rotation", `${degrees}deg`);
  root.style.setProperty("--gaugecolor", `${color}`);
}

function changerpm(cadence) {
  const cadspeed = (60 / cadence) * 1000;
  const root = document.querySelector(":root");
  root.style.setProperty("--cadencespeed", `${cadspeed}ms`);
  document.getElementById("cadencetitle").innerText = cadence;
}

function showclocks(rest_s_ges, rest_s_interval) {
  document.getElementById("totalcountdown").innerHTML = formattominsec(
    rest_s_ges
  );
  document.getElementById("intervalcountdown").innerHTML = formattominsec(
    rest_s_interval
  );
}

function sound(intensity) {
  let root = document.querySelector(":root");
  whistle.play();
  whistle.currentTime = 0;
}

function setTrainingIterval(delay, duration_s) {
  let rest_s_ges = duration_s;
  let rest_s_interval = 0;
  let curInterval = {};
  let intervalID = window.setInterval(function () {
    if (curInterval !== gettrainingzone(duration_s - rest_s_ges)) {
      curInterval = gettrainingzone(duration_s - rest_s_ges);
      rest_s_interval = curInterval.duration * 60;
      changegauge(curInterval.intensity);
      changerpm(curInterval.cadence);
      document.getElementById("lastseconds").innerHTML = "";
      sound(curInterval.intensity);
    }

    if (rest_s_interval <= 5) {
      document.getElementById("lastseconds").innerHTML = rest_s_interval;
    }

    showclocks(rest_s_ges, rest_s_interval);
    sendtopopup();

    rest_s_ges--;
    rest_s_interval--;
    if (rest_s_ges === 0) {
      window.clearInterval(intervalID);
    }
  }, delay);
}

function starttraining() {
  training = gettraining();  
  duration_s = training[training.length - 1].endtime * 60;
  document.getElementById("butstart").style.visibility = "hidden";
  document.getElementById("informationpopup").style.visibility = "hidden";
  document.getElementById("CsvInput").style.visibility = "hidden";
  setTrainingIterval(1000, duration_s);
}

const video = document.querySelector("video");
const hdConstraints = {
  video: { width: { exact: 640 }, height: { exact: 480 } },
  audio: false,
};
navigator.mediaDevices.getUserMedia(hdConstraints).then((stream) => {
  video.srcObject = stream;
});

window.addEventListener(
  "keydown",
  function (event) {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }

    switch (event.key) {
      case "w":
        const wattvisible = getComputedStyle(
          document.querySelector(":root")
        ).getPropertyValue(`--show8000`);

        const showstate = wattvisible == "hidden" ? "visible" : "hidden";
        console.log(showstate, wattvisible);
        document
          .querySelector(":root")
          .style.setProperty("--show8000", showstate);
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }

    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
  },
  true
);

function InsertRow(tableref,textlist = ["a","",""]){
  let newRow = tableref.insertRow();
  const ncoloumns = tableref.rows[0].cells.length;
  for (let j = 0; j < ncoloumns; j++){
    let cell   = newRow.insertCell(j);
    let cellText  = document.createTextNode(textlist[j]);
    cell.setAttribute('contentEditable', 'true');    
    cell.appendChild(cellText);
  }  
}

function InsertRows(tableref,textarray){
  const nrows = textarray.length;
  console.log(nrows);
  for (let i = 0; i < nrows; i++){
    InsertRow(tableref,textarray[i]);
  }
}

function DeleteAllRows(tableref,fheader=false){
  const nrows = tableref.rows.length - 1;
  const minrow = fheader ? 0 : 1 ;
  for (let i = nrows; i >= minrow; i--){
    tableref.deleteRow(i);
  }
}

// ---------------
// Audiocontrols
// ---------------

const music_player = document.getElementById("MusicPlayer");
const song_list = document.getElementById("SongList");

let songfiles = [];

document.getElementById("SongInput").onchange = function (e) {
  if(this.files.length > 0){
    createPlaylist(this.files);
    songfiles = this.files;
    song_list.value = 0;
    music_player.pause();
    song_list.dispatchEvent(new Event("change"));
  }
};

function createPlaylist(array) {
  song_list.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    // Create the list item:
    let opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = array[i].name;
    song_list.appendChild(opt);
  }
}

function changesong() {
  music_player.src = URL.createObjectURL(songfiles[song_list.selectedIndex]);
  music_player.play();
}

song_list.addEventListener("change", changesong, false);
music_player.addEventListener("ended", nextsong, false);
document.getElementById("NextTrack").addEventListener("click", nextsong, false);
document.getElementById("PrevTrack").addEventListener("click", prevsong, false);

function nextsong() {
  let i = song_list.selectedIndex;
  if (i === songfiles.length - 1) {
    i = 0;
  } else {
    i++;
  }
  song_list.value = i;
  song_list.dispatchEvent(new Event("change"));
}

function prevsong() {
  let i = song_list.selectedIndex;
  if (i - 1 < 0) {
    i = 0;
  } else {
    i--;
  }
  song_list.value = i;
  song_list.dispatchEvent(new Event("change"));
}

function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

function formattominsec(time) {
  const min = pad(Math.floor(time / 60), 2);
  const sec = pad(Math.floor(time % 60), 2);
  return `${min}:${sec}`;
}

document.getElementById("PlayPause").onclick = (e) => {
  if (music_player.paused) {
    music_player.play();
  } else {
    music_player.pause();
  }
};

music_player.onplay = (e) => {
  document.getElementById("PlayPause").classList.add("paused");
};

music_player.onpause = (e) => {
  document.getElementById("PlayPause").classList.remove("paused");
};

document.getElementById("PlayProgressBar").addEventListener("click", function (e) {
  let percent = e.offsetX / this.offsetWidth;
  console.log(percent);
  console.log(this.offsetWidth);
  music_player.currentTime = parseFloat(percent) * music_player.duration;
  this.value = percent / 100;
});

music_player.addEventListener("timeupdate", function () {
  const currenttime = music_player.currentTime;
  const duration = music_player.duration;
  let percent = (currenttime / duration) * 100;
  document.getElementById("MusicTime").innerText = formattominsec(currenttime);
  const playprogressbar = document.getElementById("PlayProgressBar");
  const musicduration = document.getElementById("MusicDuration");
  if (isNaN(parseFloat(duration)) || duration === 0) {
    playprogressbar.value = 0;
  } else {
    playprogressbar.value = percent.toFixed(1);
    console.log(duration);
    console.log(formattominsec(duration));
    musicduration.innerText = formattominsec(
      duration
    );
  }
});

document
  .getElementById("volume-control")
  .addEventListener("input", function (e) {
    music_player.volume = e.currentTarget.value / 100;
});


// ---------------
// Popupwindow
// ---------------

let popupwin = null;

const popupwinpara =
  "resizable=0,status=0,location=0,toolbar=0,menubar=0,width=620,height=160";

function openpopup() { 
  popupwin = window.open("popup.html", "PopUpTimer", popupwinpara);
}

function sendtopopup() {
  if (popupwin != null && !popupwin.closed) {
    const Popcurtime = popupwin.document.getElementById("PopTotalcountdown");
    const Popintensity = popupwin.document.getElementById(
      "PopIntervalcountdown"
    );
    const PopIntenstitle = popupwin.document.getElementById("PopIntenstitle");
    const PopCadencetitle = popupwin.document.getElementById("PopCadencetitle");
    Popcurtime.innerHTML = document.getElementById("totalcountdown").innerHTML;
    Popintensity.innerHTML = document.getElementById(
      "intervalcountdown"
    ).innerHTML;
    PopIntenstitle.innerHTML = document.getElementById("intenstitle").innerHTML;
    PopCadencetitle.innerHTML = document.getElementById(
      "cadencetitle"
    ).innerHTML;
    
    const element = document.getElementById("intenstitle");
    const style = window.getComputedStyle(element);
    const color = style.getPropertyValue("color");
    PopIntenstitle.style.color = color;
  }
}
