function updateTime() {
  document.getElementById("time").innerText = new Date().toLocaleTimeString();
}

updateTime();
setInterval(updateTime, 1000);


var biggestIndex = 1;
var selectedIcon = undefined;

var welcomeScreen = document.querySelector("#welcome");
var welcomeScreenClose = document.querySelector("#welcomeclose");
var welcomeScreenOpen = document.querySelector("#welcomeopen");

var missionScreen = document.querySelector("#mission");
var missionClose = document.querySelector("#missionclose");
var missionIcon = document.querySelector("#missionIcon");

var launchScreen = document.querySelector("#launch");
var launchClose = document.querySelector("#launchclose");
var launchIcon = document.querySelector("#launchIcon");


function closeWindow(element) {
  element.style.display = "none";
}

function openWindow(element) {
  element.style.display = "block";
  bringToFront(element);
}

function bringToFront(element) {
  biggestIndex = biggestIndex + 1;
  element.style.zIndex = biggestIndex;
}

function selectIcon(icon) {
  if (selectedIcon !== undefined) {
    selectedIcon.classList.remove("selected");
  }

  selectedIcon = icon;
  icon.classList.add("selected");
}


welcomeScreenClose.addEventListener("click", function() {
  closeWindow(welcomeScreen);
});

welcomeScreenOpen.addEventListener("click", function() {
  openWindow(welcomeScreen);
});

missionClose.addEventListener("click", function() {
  closeWindow(missionScreen);
});

missionIcon.addEventListener("click", function() {
  selectIcon(missionIcon);
  openWindow(missionScreen);
});

launchClose.addEventListener("click", function() {
  closeWindow(launchScreen);
});

launchIcon.addEventListener("click", function() {
  selectIcon(launchIcon);
  openWindow(launchScreen);
});


welcomeScreen.addEventListener("mousedown", function() {
  bringToFront(welcomeScreen);
});

missionScreen.addEventListener("mousedown", function() {
  bringToFront(missionScreen);
});

launchScreen.addEventListener("mousedown", function() {
  bringToFront(launchScreen);
});


dragElement(welcomeScreen);
dragElement(missionScreen);
dragElement(launchScreen);


function dragElement(element) {
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  document.getElementById(element.id + "header").onmousedown = startDragging;

  function startDragging(e) {
    e.preventDefault();

    initialX = e.clientX;
    initialY = e.clientY;

    document.onmouseup = stopDragging;
    document.onmousemove = moveElement;
  }

  function moveElement(e) {
    e.preventDefault();

    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;

    initialX = e.clientX;
    initialY = e.clientY;

    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


var missions = [
  {
    title: "OrbitOS Boot",
    date: "Day 1",
    text: "The control center is online. Nobody pressed the launch button yet, which is honestly a miracle."
  },
  {
    title: "Signal Found",
    date: "Day 2",
    text: "A weird signal appeared on the radar. It might be deep space noise. It might also be someone microwaving noodles next to the antenna."
  },
  {
    title: "Artemis Warning",
    date: "Day 3",
    text: "Artemis V is armed, but the safety team placed a sticky note on the launch button. Mission control considers this secure."
  },
  {
    title: "Artemis Launch",
    date: "Day 4",
    text: "The sticky note was ignored. The rocket launched!"
  },
  {
    title: "Mun Landing",
    date: "Day 5",
    text: "The space probe successfully landed on the Mun!"
  },
  {
    title: "Hack Club on the Mun",
    date: "Day 6",
    text: "The whole team arrived safely, except Jack, who tripped on a crater. He is unharmed."
  }
];

function showMission(index) {
  var mission = missions[index];

  document.querySelector("#missionText").innerHTML =
    "<h2>" + mission.title + "</h2>" +
    "<p><strong>" + mission.date + "</strong></p>" +
    "<p>" + mission.text + "</p>";
}

function loadMissionList() {
  var list = document.querySelector("#missionList");
  list.innerHTML = "";

  for (var i = 0; i < missions.length; i++) {
    var item = document.createElement("div");
    item.className = "missionItem";
    item.innerHTML = "<strong>" + missions[i].title + "</strong><br>" + missions[i].date;

    let missionNumber = i;

    item.addEventListener("click", function() {
      showMission(missionNumber);
    });

    list.appendChild(item);
  }

  showMission(0);
}

loadMissionList();


var fuel = 0;
var armed = false;
var launched = false;


var BuildButton = document.querySelector("#buildButton");
var fuelButton = document.querySelector("#fuelButton");
var armButton = document.querySelector("#armButton");
var launchButton = document.querySelector("#launchButton");
var abortButton = document.querySelector("#abortButton");

function updateLaunchPanel() {
  document.querySelector("#fuelBar").style.width = fuel + "%";
  document.querySelector("#fuelText").innerText = fuel + "%";

  if (launched === true) {
    document.querySelector("#launchStatus").innerText = "Launched";
  } else if (armed === true) {
    document.querySelector("#launchStatus").innerText = "Armed";
  } else if (fuel >= 100) {
    document.querySelector("#launchStatus").innerText = "Fueled";
  } else {
    document.querySelector("#launchStatus").innerText = "Not ready";
  }
}

function addLaunchLog(text) {
  var log = document.querySelector("#launchLog");
  log.innerHTML = "<p>" + text + "</p>" + log.innerHTML;
}

fuelButton.addEventListener("click", function() {
  if (launched === true) {
    addLaunchLog("The rocket is already gone.");
    return;
  }

  fuel = fuel + 20;

  if (fuel > 100) {
    fuel = 100;
  }

  addLaunchLog("Fuel loaded: " + fuel + "%");
  updateLaunchPanel();
});

armButton.addEventListener("click", function() {
  if (fuel < 100) {
    addLaunchLog("Cannot arm. Fuel is not full.");
    return;
  }

  armed = true;
  addLaunchLog("Rocket armed. Please do not sneeze near the red button.");
  updateLaunchPanel();
});

launchButton.addEventListener("click", function() {
  if (armed === false) {
    addLaunchLog("Launch denied. Rocket is not armed.");
    return;
  }

  launched = true;
  addLaunchLog("Artemis V launched. OrbitOS is now slightly more dangerous.");
  updateLaunchPanel();
});

abortButton.addEventListener("click", function() {
  if (launched === true) {
    addLaunchLog("Abort denied. Rocket is already launched.");
    return;
  }

  armed = false;
  fuel = 0;
  addLaunchLog("Launch aborted. Rocket is now safe.");
  updateLaunchPanel();
});
BuildButton.addEventListener("click", function() {
  armed = false;
  launched = false;
  fuel = 0;
  addLaunchLog("Rocket rebuilt. Artemis V is now safe.");
  updateLaunchPanel();
});
