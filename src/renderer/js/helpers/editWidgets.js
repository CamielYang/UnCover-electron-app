import { createWidgetNode } from "./createWidgetNode.js";
import { widgetsTags } from "../constants/widgetsTags.js";
import { Modal } from "../widgets/modal.js";

import Performance from "../../images/widgets/Performance.png";
import Notepad from "../../images/widgets/Notepad.png";
import Stopwatch from "../../images/widgets/Stopwatch.png";
import Clipboard from "../../images/widgets/Clipboard.png";
import ScreenRecorder from "../../images/widgets/ScreenRecorder.png";

const widgets = [
    // These do not work properly yet.
    // {
    //     widgetTag: widgetsTags.SystemVolume,
    //     src: "images/widgets/SystemVolume.png"
    // },
    // {
    //     widgetTag: widgetsTags.TimeDate,
    //     src: "images/widgets/TimeDate.png"
    // },
    // {
    //     widgetTag: widgetsTags.Weather,
    //     src: "images/widgets/Weather.png"
    // },
    {
        widgetTag: widgetsTags.Performance,
        src: Performance
    },
    {
        widgetTag: widgetsTags.Notepad,
        src: Notepad
    },
    {
        widgetTag: widgetsTags.Stopwatch,
        src: Stopwatch
    },
    {
        widgetTag: widgetsTags.Clipboard,
        src: Clipboard
    },
    {
        widgetTag: widgetsTags.ScreenRecorder,
        src: ScreenRecorder
    }
];

let editMode = false;
const editWidgetButton = document.getElementById('editWidgetBtn');

// Edit container
const editContainer = document.createElement("div");
const editButton = document.createElement("button");

editContainer.className = "edit-container";
editButton.className = "material-icons icon-button";
editButton.innerHTML = "edit";
editContainer.appendChild(editButton);

function createSelectWidgetItemNode(widgetData) {
    const widgetContainer = document.createElement("div");
    const image = document.createElement("img");

    widgetContainer.className = "select-widget-item";
    image.src = widgetData.src;
    widgetContainer.appendChild(image);

    return widgetContainer;
}

function renderEditMode() {
    document.querySelectorAll(".middle-container .light-container").forEach(widget => {
        if (!widget.querySelector(".edit-container")) {
            const cloneEditContainer = editContainer.cloneNode(true);

            cloneEditContainer.onclick = function() {
                Modal.loadModal("selectWidgetModal.html").then(() => {
                    const modal = document.getElementById("selectWidgetModal");

                    widgets.forEach(widgetData => {
                        const widgetNode = createSelectWidgetItemNode(widgetData);

                        widgetNode.onclick = function() {
                            const newWidget = createWidgetNode(widgetData.widgetTag);
                            widget.parentElement.replaceWith(newWidget);
                            renderEditMode();
                            Modal.unsetModal();
                        };
                        modal.appendChild(widgetNode);
                    });
                });
            };
            widget.appendChild(cloneEditContainer);
        }
    });
}

editWidgetButton.addEventListener('click', () => {
    editMode = !editMode;

    if (editMode) {
        renderEditMode();
    }
    else {
        document.querySelectorAll(".edit-container").forEach(editContainer => {
            editContainer.remove();
        });
    }
});
