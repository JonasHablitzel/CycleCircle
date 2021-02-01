const WHISTLE = new Audio("sounds/gymnasium.wav");

const COLORMIN = getComputedStyle(document.querySelector(":root"))
  .getPropertyValue("--intensitymin")
  .replace("#", "")
  .trim();
const COLORMID = getComputedStyle(document.querySelector(":root"))
  .getPropertyValue("--intensitymid")
  .replace("#", "")
  .trim();
const COLORMAX = getComputedStyle(document.querySelector(":root"))
  .getPropertyValue("--intensitymax")
  .replace("#", "")
  .trim();
const EFFORTSBINS = 10;

// ---------------
// Initialaztion
// ---------------

//Connext links to file Uploads, Downloads

initspreadsheet();

document.getElementById("DownldTrainLink").addEventListener("click",downloadtable,false);
document.getElementById("OpenPopupLink").addEventListener("click",openpopup,false);
document.getElementById("OpenExampleLink").addEventListener("click",settesttraining,false);
document.getElementById("ResetTraining").addEventListener("click",function(e){
  if(INTERVALTIMER){
    INTERVALTIMER.resettime();
  }
  e.preventDefault();
},false);

const VIDEO = document.querySelector("VIDEO");
const HDCONSTRAINTS = {
  video: { width: { exact: 640 }, height: { exact: 480 } },
  audio: false,
};

navigator.mediaDevices.getUserMedia(HDCONSTRAINTS).then((stream) => {
  VIDEO.srcObject = stream;
});




function createemty(maxrows = 80) {
  const currentlen = document.getElementById("spreadsheet").jexcel.rows.length;
  document.getElementById("spreadsheet").jexcel.insertRow(maxrows - currentlen);
}

function initspreadsheet() {
  let array = [{ duartion: "", intensity: "", cadence: "" }];
  jexcel(document.getElementById("spreadsheet"), {
    data: array,
    defaultColWidth: 220,
    tableOverflow: true,
    tableHeight:'360px',
    columns: [
      {
        type: "numeric",
        name: "duartion",
        title: "Time in min",
      },
      {
        type: "numeric",
        name: "intensity",
        title: "Intensity 0-10",
      },
      {
        type: "numeric",
        name: "cadence",
        title: "Cadence",
      },
    ],
    minDimensions: [3, 80],
  });
}

function enableAll(){
  const table = document.getElementById("spreadsheet").jexcel;
  let ncol = table.getHeaders().split(",").length;
  let nrows = table.rows.length;
  for (let i = 0; i < ncol; i++) {
    for (let j = 0; j < nrows; j++) {
      const colchar = String.fromCharCode(i + 65);
      const cellidx = `${colchar}${j + 1}`;
      table.setReadOnly(cellidx, false);
    }
  }
}


function disableRow(idxrow) {
  const table = document.getElementById("spreadsheet").jexcel;
  let ncol = table.getHeaders().split(",").length;
  for (let i = 0; i < ncol; i++) {
    const colchar = String.fromCharCode(i + 65);
    const cellidx = `${colchar}${idxrow + 1}`;
    table.setReadOnly(cellidx, true);
  }
}

function settableata(array){
  console.log(array);
  if (array.length > 0) {      
    INTERVALTIMER.resettime();
    document.getElementById("spreadsheet").jexcel.setData(array);      
  }
}

function settesttraining(){
  // Example Traing Data from 30\30 
  const testtraining = [
  {duartion: 10, intensity: 3, cadence: 100},
  {duartion: 7, intensity: 6, cadence: 100},
  {duartion: 5, intensity: 3, cadence: 90},
  {duartion: 0.5, intensity: 8, cadence: 90},
  {duartion: 0.5, intensity: 2, cadence: 110},
  {duartion: 0.5, intensity: 8, cadence: 90},
  {duartion: 0.5, intensity: 2, cadence: 110},
  {duartion: 0.5, intensity: 8, cadence: 90} , 
  {duartion: 0.5, intensity: 2, cadence: 110},
  {duartion: 0.5, intensity: 8, cadence: 90},
  {duartion: 5, intensity: 3, cadence: 90},
  {duartion: 0.5, intensity: 8, cadence: 90},
  {duartion: 0.5, intensity: 2, cadence: 110},
  {duartion: 0.5, intensity: 8, cadence: 90},
  {duartion: 0.5, intensity: 2, cadence: 110},
  {duartion: 0.5, intensity: 8, cadence: 90},
  {duartion: 0.5, intensity: 2, cadence: 110},
  {duartion: 0.5, intensity: 8, cadence: 90},
  {duartion: 0.5, intensity: 2, cadence: 110},
  {duartion: 0.5, intensity: 8, cadence: 90},
  {duartion: 5, intensity: 3, cadence: 90},
  {duartion: 0.5, intensity: 8, cadence: 90},
  {duartion: 0.5, intensity: 2, cadence: 110},
  {duartion: 0.5, intensity: 8, cadence: 90},
  {duartion: 0.5, intensity: 2, cadence: 110},
  {duartion: 0.5, intensity: 8, cadence: 90},
  {duartion: 0.5, intensity: 2, cadence: 110},
  {duartion: 0.5, intensity: 8, cadence: 90},
  {duartion: 0.5, intensity: 2, cadence: 110},
  {duartion: 0.5, intensity: 8, cadence: 90},
  {duartion: 0.5, intensity: 2, cadence: 110},
  {duartion: 0.5, intensity: 8, cadence: 90},
  {duartion: 7, intensity: 3, cadence: 90},
  {duartion: 0.5, intensity: 8, cadence: 90},
  {duartion: 0.5, intensity: 2, cadence: 110},
  {duartion: 0.5, intensity: 8, cadence: 90},
  {duartion: 0.5, intensity: 2, cadence: 110},
  {duartion: 0.5, intensity: 8, cadence: 90},
  {duartion: 0.5, intensity: 2, cadence: 110},
  {duartion: 0.5, intensity: 8, cadence: 90},
  {duartion: 0.5, intensity: 2, cadence: 110},
  {duartion: 0.5, intensity: 8, cadence: 90},
  {duartion: 0.5, intensity: 2, cadence: 110},
  {duartion: 0.5, intensity: 8, cadence: 90},
  {duartion: 12, intensity: 3, cadence: 110},
  ];
  settableata(testtraining);
}


function handleuploadtrain(files) {
  let reader = new FileReader();
  reader.onload = function () {
    let csv = reader.result;
    settableata(csvstrtoarray(csv));
  };
  reader.readAsText(files[0]);
};




function strtolist(lineStr) {
  return lineStr.split(",").map(parseFloat);
}

function listtotrainingobj(ls) {
  return { duartion: ls[0], intensity: ls[1], cadence: ls[2] };
}

function csvstrtoarray(csvstr) {
  return csvstr
    .split(/\n/)
    .map(strtolist)
    .map(listtotrainingobj)
    .slice(1)
    .filter((element) => !isNaN(element.duartion));
}

function pickHex(gradientratio) {
  let color1;
  let color2;
  let ratio = 0;

  if (gradientratio >= 0.5) {
    color1 = COLORMID;
    color2 = COLORMAX;
    ratio = (gradientratio - 0.5) * 2;
  } else {
    color1 = COLORMIN;
    color2 = COLORMID;
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

function changeintensity(intensityzone) {
  const root = document.querySelector(":root");
  const fraction = intensityzone / EFFORTSBINS;
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

function playsound() {
  WHISTLE.play();
  WHISTLE.currentTime = 0;
}

function showcountdown(rest_s) {
  if (rest_s <= 5 && rest_s >= 0)  {
    document.getElementById("lastseconds").innerHTML = rest_s;
  } else {
    document.getElementById("lastseconds").innerHTML = "";
  }
}

function getinterval(idx) {
  const interval = listtotrainingobj(
    document.getElementById("spreadsheet").jexcel.getRowData(idx)
  );
  return [interval, interval.duartion * 60, ++idx, 0];
}

function changegauges(intensity, cadence) {
  changeintensity(intensity);
  changerpm(cadence);
}


class Intervaltimer{
  constructor() {    
    this.totaltime_s = 0;
    this.intervaltime_s = 0;
    this.totalduration = 0;
    this.interval_idx = 0;
    this.resttotal_s = 0;
    this.restinterval_s = -1;
    this.paused = true;
    this.interval = {};
    this.timer = null;
  }

  updateInterval(){
    let ls = document.getElementById("spreadsheet").jexcel.getRowData(this.interval_idx);    
    this.interval = { duartion: ls[0] * 60, intensity: ls[1], cadence: ls[2] };
    disableRow(this.interval_idx);
    this.intervaltime_s = 0;
  }
  updateTotal(){
    this.totalduration = (
      document
        .getElementById("spreadsheet")
        .jexcel.getColumnData(0)
        .filter(Boolean)
        .map(parseFloat)
        .reduce((pv, cv) => pv + cv, 0) * 60
    );
  }

  updatetime(){
    this.resttotal_s = this.totalduration - this.totaltime_s;
    this.restinterval_s = this.interval.duartion - this.intervaltime_s;  
    if (this.restinterval_s === 0 ) {
      this.interval_idx = this.interval_idx + 1
      this.updateInterval();
    }else if(isNaN(this.restinterval_s)){
      this.updateTotal();
      this.updateInterval();
      this.resttotal_s = this.totalduration - this.totaltime_s;
      this.restinterval_s = this.interval.duartion - this.intervaltime_s;  
    }
    if (this.restinterval_s % 10 === 0){
      this.updateTotal();
    }
    if(this.resttotal_s === 0){
      this.resettime();
    }
  }

  draw(){
    if (this.restinterval_s === 0) {
      this.interval_idx = this.interval_idx + 1;   
      this.drawgauges();
    }
    this.drawclocks();
  }

  increasetime(){    
    this.updatetime();
    this.draw();
    this.intervaltime_s = this.intervaltime_s + 1;
    this.totaltime_s =  this.totaltime_s + 1;   
  }

  drawgauges(){
    changegauges(this.interval.intensity, this.interval.cadence);
    playsound();
  }


  drawclocks(){
    showclocks(this.resttotal_s, this.restinterval_s);
    showcountdown(this.restinterval_s);
    try {
      sendtopopup();
    } catch (error) {
      console.error(error);
    }    
  }


  start(){
    this.updateTotal(); 
    if(this.totalduration > 0){
      document.getElementById("StartStopTraining").classList.add("paused");
      document.getElementById("informationpopup").style.visibility = "hidden";
      this.paused = false;
      this.updatetime();
      this.drawclocks();
      this.drawgauges();
      this.timer = setInterval(() => this.increasetime(),1000);
    }    
  }

  stop(){
    clearInterval(this.timer);
    changegauges(0,0);
    document.getElementById("StartStopTraining").classList.remove("paused");
    document.getElementById("informationpopup").style.visibility = "visible";
    this.paused = true;
  } 

  resettime(){
    this.stop();
    enableAll();
    this.totaltime_s = 0;
    this.intervaltime_s = 0;
    this.totalduration = 0;
    this.interval_idx = 0;
    this.resttotal_s = 0;
    this.restinterval_s = -1;
    this.interval = {};
    this.drawclocks();
  }
}

let INTERVALTIMER = new Intervaltimer();

function stoptraining() { 
  INTERVALTIMER.stop();
}


document.getElementById("StartStopTraining").onclick = (e) => {
  if (INTERVALTIMER.paused) {
    INTERVALTIMER.start();    
  } else {
    INTERVALTIMER.stop();    
  }
};


document.getElementById("UploadTrainLink").addEventListener("click",function(e){
  const fileElem = document.getElementById("UploadTrain");
  if(!INTERVALTIMER.paused){
    alert("not possible while Training is active");
  }else if(fileElem){
    fileElem.click();
  }
  e.preventDefault();
},false);

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

function InsertRow(tableref, textlist = ["a", "", ""]) {
  let newRow = tableref.insertRow();
  const ncoloumns = tableref.rows[0].cells.length;
  for (let j = 0; j < ncoloumns; j++) {
    let cell = newRow.insertCell(j);
    let cellText = document.createTextNode(textlist[j]);
    cell.setAttribute("contentEditable", "true");
    cell.appendChild(cellText);
  }
}

function InsertRows(tableref, textarray) {
  const nrows = textarray.length;
  for (let i = 0; i < nrows; i++) {
    InsertRow(tableref, textarray[i]);
  }
}

function DeleteAllRows(tableref, fheader = false) {
  const nrows = tableref.rows.length - 1;
  const minrow = fheader ? 0 : 1;
  for (let i = nrows; i >= minrow; i--) {
    tableref.deleteRow(i);
  }
}

function downloadtable() {
  const table = document.getElementById("spreadsheet").jexcel; 
  const nrows = table.getColumnData(0).filter(Boolean).length;
  let csvContent = "data:text/csv;charset=utf-8," 
  csvContent = csvContent.concat(table.getHeaders());
  for(let i = 0;i < nrows;i++){
    csvContent = csvContent.concat(`\n${table.getRowData(i)}`);
  }
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "TrainingData.csv");
  document.body.appendChild(link);
  link.click();
};

// ---------------
// Audiocontrols
// ---------------

const MUSICPLAYER = document.getElementById("MusicPlayer");

document.getElementById("SongInputLink").addEventListener("click",function(e){
  const fileElem = document.getElementById("SongInput");
  if(fileElem){
    fileElem.click();
  }
  e.preventDefault();
},false);

MUSICPLAYER.addEventListener("ended", nextsong, false);
document.getElementById("NextTrack").addEventListener("click", nextsong, false);
document.getElementById("PrevTrack").addEventListener("click", prevsong, false);
document.getElementById("SongList").addEventListener("change", changesong, false);

function handlesonginput(files) {
  if (files.length > 0) {
    createPlaylist(files);
    const songlist = document.getElementById("SongList");
    songlist.value = 0;
    MUSICPLAYER.pause();
    songlist.dispatchEvent(new Event("change"));
  }
};

function createPlaylist(files) {
  const songlist = document.getElementById("SongList");
  songlist.innerHTML = "";  
  for (let i = 0; i < files.length; i++) {
    // Create the list item:
    let opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = files[i].name;
    
    songlist.appendChild(opt);
  }
}

function changesong() {
  const songlist = document.getElementById("SongList");
  const songinput = document.getElementById("SongInput");
  MUSICPLAYER.src = URL.createObjectURL(songinput.files[songlist.selectedIndex]);
  MUSICPLAYER.play();
}



function nextsong() {
  const songlist = document.getElementById("SongList");
  let i = songlist.selectedIndex;
  const songinputlen = document.getElementById("SongInput").files.length;
  if (i === songinputlen - 1) {
    i = 0;
  } else {
    i++;
  }
  songlist.value = i;
  songlist.dispatchEvent(new Event("change"));
}

function prevsong() {
  const songlist = document.getElementById("SongList");
  let i = songlist.selectedIndex;
  if (i - 1 < 0) {
    i = 0;
  } else {
    i--;
  }
  songlist.value = i;
  songlist.dispatchEvent(new Event("change"));
}

function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

function formattominsec(time) {
  const correcttime = time < 0 ? 0 : time 
  const min = pad(Math.floor(correcttime / 60), 2);
  const sec = pad(Math.floor(correcttime % 60), 2);
  return `${min}:${sec}`;
}

document.getElementById("PlayPause").onclick = (e) => {
  if (MUSICPLAYER.paused) {
    MUSICPLAYER.play();
  } else {
    MUSICPLAYER.pause();
  }
};

MUSICPLAYER.onplay = (e) => {
  document.getElementById("PlayPause").classList.add("paused");
};

MUSICPLAYER.onpause = (e) => {
  document.getElementById("PlayPause").classList.remove("paused");
};

document
  .getElementById("PlayProgressBar")
  .addEventListener("click", function (e) {
    let percent = e.offsetX / this.offsetWidth;
    MUSICPLAYER.currentTime = parseFloat(percent) * MUSICPLAYER.duration;
    this.value = percent / 100;
  });

MUSICPLAYER.addEventListener("timeupdate", function () {
  const currenttime = MUSICPLAYER.currentTime;
  const duration = MUSICPLAYER.duration;
  let percent = (currenttime / duration) * 100;
  document.getElementById("MusicTime").innerText = formattominsec(currenttime);
  const playprogressbar = document.getElementById("PlayProgressBar");
  const musicduration = document.getElementById("MusicDuration");
  if (isNaN(parseFloat(duration)) || duration === 0) {
    playprogressbar.value = 0;
  } else {
    playprogressbar.value = percent.toFixed(1);
    musicduration.innerText = formattominsec(duration);
  }
});

document
  .getElementById("volume-control")
  .addEventListener("input", function (e) {
    MUSICPLAYER.volume = e.currentTarget.value / 100;
  });

// ---------------
// Popupwindow
// ---------------
let POPUPWIN = null;

function openpopup() {
  const popupwinpara =
  "resizable=0,status=0,location=0,toolbar=0,menubar=0,width=620,height=160";
  POPUPWIN = window.open("popup.html", "PopUpTimer", popupwinpara);
  console.log(POPUPWIN);
}

function sendtopopup() {  
  if (POPUPWIN != null && !POPUPWIN.closed) {
    const Popcurtime = POPUPWIN.document.getElementById("PopTotalcountdown");
    const Popintensity = POPUPWIN.document.getElementById(
      "PopIntervalcountdown"
    );
    const PopIntenstitle = POPUPWIN.document.getElementById("PopIntenstitle");
    const PopCadencetitle = POPUPWIN.document.getElementById("PopCadencetitle");
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
