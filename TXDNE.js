/*
Copyright 2020 Said Achmiz

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// coiped in 2022 by Spencer Paulmark and chopped up real good
// i don't really know how this license stuff works but MIT allows modification so here we are B)

/*****************/
/* MISC. HELPERS */
/*****************/

/*	Returns the passed object if it’s truthy, or a newly created HTMLElement.
	Æ(x) is the element analogue of (x||{}).
	*/
function Æ(x) {
  return x || document.createElement(null);
}

/*********/
/* TXDNE */
/*********/

//	This function is called when a waifu box needs to be loaded.
function loadWaifu(waifuLink) {
  waifuLink.dataset.id = getRandomWaifuID().toString();

  waifuLink.href = `${TXDNE.waifuSourceURLBase}${waifuLink.dataset.id}.${TXDNE.waifuSourceURLFileExtension}`;
  waifuLink.querySelector("img").src = waifuLink.href;
}

function rollDie(dieSize) {
  return 1 + Math.floor(Math.random() * dieSize);
}
function getRandomWaifuID() {
  // TODO: this is where we would prevent recent duplicates
  return rollDie(TXDNE.waifuSetSize) - 1;
}
function adjustGridOffsetBy(xOffset, yOffset, waifuQuilt) {
  waifuQuilt.offsetX += xOffset;
  waifuQuilt.offsetY += yOffset;
  waifuQuilt.style.transform = `translate(${waifuQuilt.offsetX + "px"}, ${
    waifuQuilt.offsetY + "px"
  })`;
}

//	Recompute grid parameters.
function recomputeWaifuQuiltParameters() {
  let waifusAcross = Math.floor(1 / TXDNE.waifuX) + 1;
  let waifusDown = Math.floor(window.innerHeight / TXDNE.waifuY) + 2;

  TXDNE.waifusAcross = Math.max(TXDNE.waifusAcross || 0, waifusAcross);
  TXDNE.waifusDown = Math.max(TXDNE.waifusDown || 0, waifusDown);

  TXDNE.avgWaifusPerFullGridStep =
    (waifusAcross * 2 + waifusDown * 2 + (waifusAcross + waifusDown - 1) * 4) /
    8;

  let waifuGridStepsPerSecond =
    TXDNE.waifusPerSecond / TXDNE.avgWaifusPerFullGridStep;
  let pixelsPerSecond = waifuGridStepsPerSecond * TXDNE.waifuY;
  TXDNE.panTickDistance = (TXDNE.panTickInterval / 1000) * pixelsPerSecond;
}
// Create and return a new waifu link cell.
function createWaifu() {
  let newWaifu = document.createElement("img");
  newWaifu.classList.add("waifu");

  let newWaifuLink = document.createElement("a");
  newWaifuLink.classList.add("waifu-link");
  newWaifuLink.target = "_blank";
  newWaifuLink.appendChild(newWaifu);
  return newWaifuLink;
}

function populateGrid(waifuQuilt) {
  /*	Each waifu box is an <img> tag wrapped in an <a> tag.
		Here we create the boxes and place them on the grid.
		*/
  let totalWaifus = TXDNE.waifusAcross * TXDNE.waifusDown;
  for (var i = 0; i < totalWaifus; i++) {
    let gridPositionX = Math.floor(i % TXDNE.waifusAcross);
    let gridPositionY = Math.floor(i / TXDNE.waifusAcross);
    if (
      !waifuQuilt.querySelector(
        `[data-grid-position-x='${gridPositionX}'][data-grid-position-y='${gridPositionY}']`
      )
    ) {
      if (gridPositionX !== 0) continue; // this fixes the initial 2 column bug
      let newWaifuLink = createWaifu();
      newWaifuLink.dataset.gridPositionX = gridPositionX;
      newWaifuLink.dataset.gridPositionY = gridPositionY;
      newWaifuLink.style.left =
        newWaifuLink.dataset.gridPositionX * (TXDNE.waifuX + 1) + "px";
      newWaifuLink.style.top =
        newWaifuLink.dataset.gridPositionY * (TXDNE.waifuY + 1) + "px";
      waifuQuilt.appendChild(newWaifuLink);
      loadWaifu(newWaifuLink);
    }
  }
}

function addRow(where, waifuQuilt) {
  for (var j = 0; j < TXDNE.waifusAcross; j++) {
    let newWaifuLink = createWaifu();
    newWaifuLink.dataset.gridPositionX = j + waifuQuilt.gridXOrigin;
    newWaifuLink.dataset.gridPositionY =
      where == "bottom"
        ? waifuQuilt.gridYOrigin + TXDNE.waifusDown
        : waifuQuilt.gridYOrigin - 1;
    newWaifuLink.style.left =
      newWaifuLink.dataset.gridPositionX * (TXDNE.waifuX + 1) + "px";
    newWaifuLink.style.top =
      newWaifuLink.dataset.gridPositionY * (TXDNE.waifuY + 1) + "px";
    loadWaifu(newWaifuLink);
    waifuQuilt.appendChild(newWaifuLink);
  }
  TXDNE.waifusDown++;
  if (where == "top") waifuQuilt.gridYOrigin--;
}

function addColumn(where, waifuQuilt) {
  for (var k = 0; k < TXDNE.waifusDown; k++) {
    let newWaifuLink = createWaifu();
    newWaifuLink.dataset.gridPositionX =
      where == "right"
        ? waifuQuilt.gridXOrigin + TXDNE.waifusAcross
        : waifuQuilt.gridXOrigin - 1;
    if (newWaifuLink.dataset.gridPositionX !== 0) continue;
    newWaifuLink.dataset.gridPositionY = k + waifuQuilt.gridYOrigin;
    newWaifuLink.style.left =
      newWaifuLink.dataset.gridPositionX * (TXDNE.waifuX + 1) + "px";
    newWaifuLink.style.top =
      newWaifuLink.dataset.gridPositionY * (TXDNE.waifuY + 1) + "px";
    // TODO: not that createWaifu might not actually create the waifu it might die early, so loadWaifu needs to specify who got created in the no repeats list
    loadWaifu(newWaifuLink);
    waifuQuilt.appendChild(newWaifuLink);
  }
  TXDNE.waifusAcross++;
  if (where == "left") waifuQuilt.gridXOrigin--;
}

function removeRow(where) {
  let rowYPosition =
    where == "top"
      ? TXDNE.waifuQuilt.gridYOrigin
      : TXDNE.waifuQuilt.gridYOrigin + TXDNE.waifusDown;
  TXDNE.waifuQuilt
    .querySelectorAll(`.waifu-link[data-grid-position-y='${rowYPosition}']`)
    .forEach((waifuLink) => {
      waifuLink.remove();
    });
  TXDNE.waifusDown--;
  if (where == "top") TXDNE.waifuQuilt.gridYOrigin++;
}

function removeColumn(where) {
  let columnXPosition =
    where == "left"
      ? TXDNE.waifuQuilt.gridXOrigin
      : TXDNE.waifuQuilt.gridXOrigin + TXDNE.waifusAcross;
  TXDNE.waifuQuilt
    .querySelectorAll(`.waifu-link[data-grid-position-x='${columnXPosition}']`)
    .forEach((waifuLink) => {
      waifuLink.remove();
    });
  TXDNE.waifusAcross--;
  if (where == "left") TXDNE.waifuQuilt.gridXOrigin++;
}

function updateGrid(waifuQuilt) {
  let leftOfGrid = waifuQuilt
    .querySelector(
      `.waifu-link[data-grid-position-x='${waifuQuilt.gridXOrigin}']`
    )
    .getBoundingClientRect().left;
  let rightOfGrid = leftOfGrid + TXDNE.waifusAcross * (TXDNE.waifuX + 1);
  let topOfGrid = waifuQuilt
    .querySelector(
      `.waifu-link[data-grid-position-y='${waifuQuilt.gridYOrigin}']`
    )
    .getBoundingClientRect().top;
  let bottomOfGrid = topOfGrid + TXDNE.waifusDown * (TXDNE.waifuY + 1);

  let gridBounds = {
    left: leftOfGrid,
    right: rightOfGrid,
    top: topOfGrid,
    bottom: bottomOfGrid,
  };

  // TODO: window stuff may not nessecarily be the same as the quilt
  gridNeedsUpdating =
    gridBounds.left > 0 - TXDNE.waifuX ||
    gridBounds.right < 1 + TXDNE.waifuX ||
    gridBounds.top > 0 - TXDNE.waifuY ||
    gridBounds.bottom < window.innerHeight + TXDNE.waifuY ||
    gridBounds.left < 0 - 2 * TXDNE.waifuX ||
    gridBounds.right > 1 + 2 * TXDNE.waifuX ||
    gridBounds.top < 0 - 2 * TXDNE.waifuY ||
    gridBounds.bottom > window.innerHeight + 2 * TXDNE.waifuY;

  if (gridNeedsUpdating) {
    // Add column, if needed.
    if (gridBounds.left > 0 - TXDNE.waifuX) {
      addColumn("left", waifuQuilt);
    } else if (gridBounds.right < 1 + TXDNE.waifuX) {
      addColumn("right", waifuQuilt);
    }

    // Add row, if needed.
    if (gridBounds.top > 0 - TXDNE.waifuY) {
      addRow("top", waifuQuilt);
    } else if (gridBounds.bottom < window.innerHeight + TXDNE.waifuY) {
      addRow("bottom", waifuQuilt);
    }

    // Remove column, if needed.
    if (gridBounds.left < 0 - 2 * TXDNE.waifuX) {
      removeColumn("left");
    } else if (gridBounds.right > 1 + 2 * TXDNE.waifuX) {
      removeColumn("right");
    }

    // Remove row, if needed.
    if (gridBounds.top < 0 - 2 * TXDNE.waifuY) {
      removeRow("top");
    } else if (gridBounds.bottom > window.innerHeight + 2 * TXDNE.waifuY) {
      removeRow("bottom");
    }
  }

  return gridNeedsUpdating;
}

function waifuSetup() {
  TXDNE.waifuQuilt = document.querySelector(TXDNE.waifuQuiltSelector);

  /*	Create a number of waifu boxes such that there are just enough to
		fully tile the window (possibly exceeding the window’s dimensions,
		as the window width and height are almost certainly not going to be
		integer multiples of the width of a box - plus 1 more row & column.
		This is done so that we can give the grid a negative offset (to
		create the illusion of an infinite grid), while still ensuring that
		the window is fully tiled, with no black areas along the right and
		lower edges.
		*/
  TXDNE.waifuQuilt.gridXOrigin = 0;
  TXDNE.waifuQuilt.gridYOrigin = 0;

  recomputeWaifuQuiltParameters();

  populateGrid(TXDNE.waifuQuilt);

  TXDNE.waifuQuilt.offsetX = 0;
  TXDNE.waifuQuilt.offsetY = 0;
  /* unlike TWDNE, offset is not random since i only want one row*/

  let offsetX = 129; // this is exactly right
  let offsetY = 200; // this is good enough, it doesn't matter
  adjustGridOffsetBy(offsetX, offsetY, TXDNE.waifuQuilt);

  document
    .querySelector("head")
    .insertAdjacentHTML(
      "beforeend",
      "<style id='waifu-hover-adjust-style'></style>"
    );

  TXDNE.pendingXMovement = 0;
  TXDNE.pendingYMovement = 0;

  window.waifuQuiltPanTickFunction = () => {
    var direction;
    // 2 is up
    // 6 is  down

    direction = (Math.PI * (6 * 45)) / 180.0;

    TXDNE.waifuQuilt.direction = direction;

    TXDNE.pendingXMovement +=
      TXDNE.panTickDistance * Math.round(Math.cos(direction));
    TXDNE.pendingYMovement +=
      TXDNE.panTickDistance * Math.round(Math.sin(direction));

    var xMovement = Math.floor(TXDNE.pendingXMovement);
    var yMovement = Math.floor(TXDNE.pendingYMovement);

    TXDNE.pendingXMovement -= xMovement;
    TXDNE.pendingYMovement -= yMovement;

    updateGrid(TXDNE.waifuQuilt);

    adjustGridOffsetBy(xMovement, yMovement, TXDNE.waifuQuilt);
  };

  TXDNE.dragging = false;

  window.waifuQuiltPanTickTock = setInterval(
    window.waifuQuiltPanTickFunction,
    TXDNE.panTickInterval
  );
}
//	Set up the grid.
waifuSetup();
//	Add the ‘hidden’ class to the headings, so they’ll fade out slowly. TODO: probably not tbh
setTimeout(() => {
  // removed h2 temporarily
  document
    .querySelectorAll("h1, h2, #controls button.full-screen")
    .forEach((heading) => {
      heading.classList.add("hidden");
    });
}, 0);

/************/
/* CONTROLS */
/************/

function toggleFullScreen(on) {
  if (typeof on == "undefined") {
    toggleFullScreen(!isFullScreen());
    return;
  }
  if (on) {
    let body = document.querySelector("body");
    [
      "requestFullscreen",
      "webkitRequestFullscreen",
      "mozRequestFullscreen",
    ].forEach((f) => {
      if (body[f] && !isFullScreen()) body[f]();
      else return;
    });
  } else {
    ["exitFullscreen", "webkitExitFullscreen", "mozExitFullscreen"].forEach(
      (f) => {
        if (document[f] && isFullScreen()) document[f]();
        else return;
      }
    );
  }
}
Æ(document.querySelector("#controls button.full-screen")).addEventListener(
  "click",
  (_event) => {
    toggleFullScreen();
  }
);
document.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "f":
      toggleFullScreen();
      break;
    case "0":
      clearInterval(window.waifuQuiltPanTickTock);
      window.waifuQuiltPanTickTock = null;
      break;
    case " ":
    case "Spacebar":
      if (window.waifuQuiltPanTickTock) {
        clearInterval(window.waifuQuiltPanTickTock);
        window.waifuQuiltPanTickTock = null;
      } else {
        window.waifuQuiltPanTickTock = setInterval(
          window.waifuQuiltPanTickFunction,
          TXDNE.panTickInterval
        );
      }
      break;
    case "PageDown":
      adjustGridOffsetBy(
        0,
        -1 * (TXDNE.waifuY * (TXDNE.waifusDown - 3)),
        TXDNE.waifuQuilt
      );
      while (updateGrid(TXDNE.waifuQuilt));
      break;
    case "PageUp":
      adjustGridOffsetBy(
        0,
        TXDNE.waifuY * (TXDNE.waifusDown - 3),
        TXDNE.waifuQuilt
      );
      while (updateGrid(TXDNE.waifuQuilt));
      break;
    default:
      if (parseInt(event.key)) {
        let speeds = {
          1: 1,
          2: 3,
          3: 5,
          4: 7,
          5: 9,
          6: 10,
          7: 12,
          8: 15,
          9: 18,
        };
        TXDNE.waifusPerSecond = speeds[event.key];
        recomputeWaifuQuiltParameters();
        if (!window.waifuQuiltPanTickTock)
          window.waifuQuiltPanTickTock = setInterval(
            window.waifuQuiltPanTickFunction,
            TXDNE.panTickInterval
          );
      }
      break;
  }
});

window.addEventListener("wheel", (event) => {
  event.preventDefault();

  let scrollX =
    event.deltaX == 0
      ? 0
      : Math.min(Math.abs(event.deltaX), TXDNE.waifusAcross) *
        (Math.abs(event.deltaX) / event.deltaX);
  let scrollY =
    event.deltaY == 0
      ? 0
      : Math.min(Math.abs(event.deltaY), TXDNE.waifusDown) *
        (Math.abs(event.deltaY) / event.deltaY);

  adjustGridOffsetBy(
    scrollX * TXDNE.waifuX * -0.0625,
    scrollY * TXDNE.waifuY * -0.0625,
    TXDNE.waifuQuilt
  );
  updateGrid(TXDNE.waifuQuilt);
});

function flashFadingElement(element) {
  element.classList.toggle("hidden");
  setTimeout(() => {
    element.classList.toggle("hidden");
  }, 50);
}
function updateFullScreenButton() {
  let fullScreenButton = Æ(
    document.querySelector("#controls button.full-screen")
  );
  flashFadingElement(fullScreenButton);
  if (isFullScreen()) {
    fullScreenButton.classList.add("engaged");
    fullScreenButton.innerHTML = "&#xf326;";
  } else {
    fullScreenButton.classList.remove("engaged");
    fullScreenButton.innerHTML = "&#xf320;";
  }
}
function isFullScreen() {
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullscreenElement
  );
}
window.addEventListener("resize", (_event) => {
  updateFullScreenButton();
  let gridWasScrolling = window.waifuQuiltPanTickTock != null;
  clearInterval(window.waifuQuiltPanTickTock);
  recomputeWaifuQuiltParameters();
  populateGrid(TXDNE.waifuQuilt);
  if (gridWasScrolling) {
    clearInterval(window.waifuQuiltPanTickTock);
    window.waifuQuiltPanTickTock = setInterval(
      window.waifuQuiltPanTickFunction,
      TXDNE.panTickInterval
    );
  }
});
