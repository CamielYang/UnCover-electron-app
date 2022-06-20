import { PageHandler } from "../Helpers/pageHandler.js";
import { convertPathUrl } from "../Helpers/convertPathUrl.js";

const pageId = "applicationsPage";

const template = document.createElement('template');
template.innerHTML = /*html*/`
     <div class="page" id="${pageId}">
        <div class="flex-row flex-start header">
            <button id="returnOverlayBtn" class="material-icons icon-button">arrow_back</button>
            <h2 class="return-head">Applications</h2>
        </div>
        <div class="light-container page-container applications-container">
            <div class="file-input">
                <label for="applicationInput" class="button button-primary button-icon-left">
                    <strong>+</strong>
                    <strong>Add application</strong>
                </label>
                <input accept=".exe" type="file" id="applicationInput" />
            </div>   
            <div class="applications-list" id="applicationsList">
            </div>
        </div>
    </div>
`;

class Applications extends HTMLElement {
    constructor() {
        super()

        this.appendChild(template.content.cloneNode(true));

        this.applicationsContainer = this.children[0];

        this.applicationInput = this.applicationsContainer.querySelector("#applicationInput");
        this.applicationsListId = this.applicationsContainer.querySelector("#applicationsList");
        
        this.initializeApplications();

        this.addEvents();
    }

    async initializeApplications() {
        api.getApplications().then(applicationsList => {
            this.applicationsListId.innerHTML = "";

            applicationsList.data.forEach(app => {     
                this.applicationsListId.innerHTML += `
                <div onclick="api.openApplication('${app.path}')" class="app">
                    <img class="app-icon" src="${app.dataUrl}">
                    <span class="app-title">${app.name}</span>
                </div>
                `
            });
        });
    }

    addApplicationInputEvent() {
        this.applicationInput.addEventListener('change', function(e) {
            const path = convertPathUrl(e.target.files[0].path);

            api.addApplication(path).then(() => {
                this.initializeApplications();
            });
        }.bind(this));
    }

    addEvents() {
        document.getElementById("applicationBtn").addEventListener("click", () => {
            PageHandler.switchPage(pageId);
        });

        this.applicationsContainer.querySelector("#returnOverlayBtn").addEventListener("click", () => {
            PageHandler.switchToMainPage()
        });

        this.addApplicationInputEvent();
    }
}

window.customElements.define('applications-page', Applications);