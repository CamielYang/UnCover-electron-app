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
import "./Containers/settingsPage.js";

// Modal
Modal.setModalId("myModal");
Modal.setBaseTemplatePath("templates/");

const applications = await api.getApplications();

applications.forEach(app => {
    console.log('%c ', `padding: 25px; background: url("data:image/png;base64,${app.base64}") no-repeat;`);
});