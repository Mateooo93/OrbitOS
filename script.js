function updateTime() {
  document.getElementById("time").innerText = new Date().toLocaleTimeString();
}

updateTime();
setInterval(updateTime, 1000);


var biggestIndex = 1;
var selectedIcon = undefined;


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

function setupWindow(windowId, closeId, openIconId) {
  var windowElement = document.querySelector("#" + windowId);
  var closeButton = document.querySelector("#" + closeId);
  var openIcon = document.querySelector("#" + openIconId);

  closeButton.addEventListener("click", function() {
    closeWindow(windowElement);
  });

  openIcon.addEventListener("click", function() {
    selectIcon(openIcon);
    openWindow(windowElement);
  });

  windowElement.addEventListener("mousedown", function() {
    bringToFront(windowElement);
  });

  dragElement(windowElement);
}


document.querySelector("#welcomeclose").addEventListener("click", function() {
  closeWindow(document.querySelector("#welcome"));
});

document.querySelector("#welcomeopen").addEventListener("click", function() {
  openWindow(document.querySelector("#welcome"));
});

document.querySelector("#welcome").addEventListener("mousedown", function() {
  bringToFront(document.querySelector("#welcome"));
});

dragElement(document.querySelector("#welcome"));

setupWindow("mission", "missionclose", "missionIcon");
setupWindow("launch", "launchclose", "launchIcon");
setupWindow("rocket", "rocketclose", "rocketIcon");
setupWindow("game", "gameclose", "gameIcon");

function dragElement(element) {
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  var header = document.getElementById(element.id + "header");

  header.onmousedown = startDragging;

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


/* Mission Log */

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


/* Launch Control */

var fuel = 0;
var armed = false;
var launched = false;

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

document.querySelector("#fuelButton").addEventListener("click", function() {
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

document.querySelector("#armButton").addEventListener("click", function() {
  if (fuel < 100) {
    addLaunchLog("Cannot arm. Fuel is not full.");
    return;
  }

  if (launched === true) {
    addLaunchLog("Cannot arm. Rocket already launched.");
    return;
  }

  armed = true;
  addLaunchLog("Rocket armed. Please do not sneeze near the red button.");
  updateLaunchPanel();
});

document.querySelector("#launchButton").addEventListener("click", function() {
  if (armed === false) {
    addLaunchLog("Launch denied. Rocket is not armed.");
    return;
  }

  if (launched === true) {
    addLaunchLog("Rocket already launched.");
    return;
  }

  launched = true;
  addLaunchLog("Artemis V launched. OrbitOS is now slightly more dangerous.");
  updateLaunchPanel();
});

document.querySelector("#abortButton").addEventListener("click", function() {
  armed = false;
  launched = false;
  addLaunchLog("Launch aborted. Everyone can breathe again.");
  updateLaunchPanel();
});

document.querySelector("#buildButton").addEventListener("click", function() {
  fuel = 0;
  armed = false;
  launched = false;
  addLaunchLog("Rocket rebuilt. Fuel reset to 0%.");
  updateLaunchPanel();
});

updateLaunchPanel();


/* Rocket Builder */

var rocketParts = [];

function addRocketPart(name, emoji) {
  rocketParts.push({
    name: name,
    emoji: emoji
  });

  updateRocketPreview();
}

function hasRocketPart(name) {
  for (var i = 0; i < rocketParts.length; i++) {
    if (rocketParts[i].name === name) {
      return true;
    }
  }

  return false;
}

function updateRocketPreview() {
  var preview = document.querySelector("#rocketPreview");
  preview.innerHTML = "";

  for (var i = 0; i < rocketParts.length; i++) {
    var part = document.createElement("div");
    part.className = "rocketPart";
    part.innerHTML = rocketParts[i].emoji + " " + rocketParts[i].name;

    preview.appendChild(part);
  }

  if (rocketParts.length === 0) {
    document.querySelector("#rocketStatus").innerText = "Not ready";
  } else if (hasRocketPart("Pod") && hasRocketPart("Fuselage") && hasRocketPart("Engine")) {
    document.querySelector("#rocketStatus").innerText = "Rocket ready";
  } else {
    document.querySelector("#rocketStatus").innerText = "Missing parts";
  }
}

document.querySelector("#fuselageButton").addEventListener("click", function() {
  addRocketPart("Fuselage", "🟦");
});

document.querySelector("#engineButton").addEventListener("click", function() {
  addRocketPart("Engine", "🔥");
});

document.querySelector("#parachuteButton").addEventListener("click", function() {
  addRocketPart("Parachute", "🪂");
});

document.querySelector("#podButton").addEventListener("click", function() {
  addRocketPart("Pod", "👨‍🚀");
});

document.querySelector("#clearRocketButton").addEventListener("click", function() {
  rocketParts = [];
  updateRocketPreview();
});

document.querySelector("#saveButton").addEventListener("click", function() {
  if (hasRocketPart("Pod") && hasRocketPart("Fuselage") && hasRocketPart("Engine")) {
    document.querySelector("#rocketStatus").innerText = "Saved!";
  } else {
    document.querySelector("#rocketStatus").innerText = "Cannot save. Missing important parts.";
  }
});

updateRocketPreview();
var stardust = 0;
var minePower = 1;

function updateGame() {
  document.querySelector("#stardustCount").innerText = stardust;
  document.querySelector("#minePower").innerText = minePower;
}

document.querySelector("#mineButton").addEventListener("click", function() {
  stardust = stardust + minePower;
  document.querySelector("#gameMessage").innerText = "You mined " + minePower + " Stardust!";
  updateGame();
});

document.querySelector("#upgradeButton").addEventListener("click", function() {
  if (stardust >= 10) {
    stardust = stardust - 10;
    minePower = minePower + 1;
    document.querySelector("#gameMessage").innerText = "Drill upgraded!";
  } else {
    document.querySelector("#gameMessage").innerText = "Not enough Stardust.";
  }

  updateGame();
});

updateGame();