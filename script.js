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
var rocketParts = [];

function addRocketPart(name, emoji) {
  rocketParts.push({
    name: name,
    emoji: emoji
  });

  updateRocketPreview();
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
  } else {
    document.querySelector("#rocketStatus").innerText = "Building...";
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
  document.querySelector("#rocketStatus").innerText = "Saved!";
});

updateRocketPreview();