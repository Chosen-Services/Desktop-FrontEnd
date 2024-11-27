let homeScreen = document.querySelector(".window");
let GUI = document.querySelector(".GUI");

const COLUMN_WIDTH = 100;
const ROW_HEIGHT = 120;
const GAP = 20;

window.addEventListener("keyup", (e) => {
  if (e.key == "f") {
    homeScreen.requestFullscreen();
  }
});

async function fetchJSONData() {
  try {
    const res = await fetch("apps.json");
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Unable to fetch data:", error);
  }
}

const loadApplications = () => {
  (async () => {
    const data = await fetchJSONData();
    if (data && data.Apps) {
      for (let i = 0; i < data.Apps.length; i++) {
        console.log(`App Name: ${data.Apps[i].name}`);

        let appContainer = document.createElement("div");
        appContainer.classList.add("app");

        let icon = document.createElement("img");
        icon.id = "icon";
        icon.src = `${data.Apps[i].details.icon}`;
        icon.draggable = false;

        let name = document.createElement("label");
        name.id = "name";
        name.textContent = data.Apps[i].details.name;

        appContainer.appendChild(icon);
        appContainer.appendChild(name);

        GUI.appendChild(appContainer);

        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let initialX = 0;
        let initialY = 0;

        appContainer.addEventListener("mousedown", (event) => {
          if (event) {
            isDragging = true;
            appContainer.style.position = "relative";

            startX = event.clientX;
            startY = event.clientY;
            initialX = parseInt(appContainer.style.left) || 0;
            initialY = parseInt(appContainer.style.top) || 0;
            appContainer.style.cursor = "grabbing";
          }
        });
        let selected;
        document.addEventListener("mousedown", (e) => {
          if (e.target.id == "icon") {
            selected = e.target.parentElement;
            console.log(e.target);
            console.log(selected);
          }
        });

        document.addEventListener("keydown", (e) => {
          if (selected) {
            if (e.key == "Backspace") {
              selected.remove();
            }
          }
        });

        document.addEventListener("mousemove", (event) => {
          if (isDragging) {
            const x = initialX + (event.clientX - startX);
            const y = initialY + (event.clientY - startY);
            appContainer.style.left = `${x}px`;
            appContainer.style.top = `${y}px`;
            console.log(`X: ${x}, Y: ${y}`);
          }
        });

        document.addEventListener("mouseup", (event) => {
          if (isDragging) {
            isDragging = false;

            // Snap to grid
            const x =
              Math.round(
                (initialX + (event.clientX - startX)) / (COLUMN_WIDTH + GAP)
              ) *
              (COLUMN_WIDTH + GAP);
            const y =
              Math.round(
                (initialY + (event.clientY - startY)) / (ROW_HEIGHT + GAP)
              ) *
              (ROW_HEIGHT + GAP);
            appContainer.style.left = `${x}px`;
            appContainer.style.top = `${y}px`;
            console.log(`Snapped to X: ${x}, Y: ${y}`);
          }
        });
      }
    }
  })();
};

loadApplications();
