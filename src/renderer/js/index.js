// Css
import "../css/style.css";

// Widgets
import { Modal } from "./widgets/modal.js";
import "./widgets.js";

// Containers
import "./containers/applicationsPage.js";
import "./containers/settingsPage.js";

// Modal
Modal.setModalId("myModal");
Modal.setBaseTemplatePath("templates/");

// Code Logic
import "./helpers/editWidgets.js";
