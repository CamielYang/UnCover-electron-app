// Widgets
import { Modal } from "./widgets/modal.js";
import "./widgets/timeDate.js";
import "./widgets/systemVolume.js";
import "./widgets/weather.js";
import "./widgets/notepad.js";
import "./widgets/clipboard.js";
import "./widgets/stopwatch.js";
import "./widgets/performance.js";

// Containers
import "./containers/applicationsPage.js";
import "./containers/settingsPage.js";

// Modal
Modal.setModalId("myModal");
Modal.setBaseTemplatePath("templates/");

// Code Logic
import "./helpers/editWidgets.js";
