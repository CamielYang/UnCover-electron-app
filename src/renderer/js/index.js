import { Modal } from "./widgets/modal.js";
import { TimeDate } from  "./widgets/timeDate.js";
import { SystemVolume } from  "./widgets/systemVolume.js";
import { Weather } from "./widgets/weather.js";
import { Notepad } from "./widgets/notepad.js";
import { Clipboard } from "./widgets/clipboard.js";

// Modal
Modal.setModalId("myModal");
Modal.setBaseTemplatePath("templates/")

// TimeDate
const timeDate = new TimeDate();

// Volume
const systemVolume = new SystemVolume();

// Weather
const weather = new Weather();

// Notepad
const notepad = new Notepad();

// Clipboard
const clipboard = new Clipboard();