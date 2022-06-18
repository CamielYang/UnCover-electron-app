import { PageHandler } from "../Helpers/pageHandler.js";

const pageId = "applicationsPage";

const template = document.createElement('template');
template.innerHTML = `
     <div class="page" id="${pageId}">
        <div class="flex-row flex-start header">
            <button id="returnOverlayBtn" class="material-icons icon-button">arrow_back</button>
            <h2 class="return-head">Applications</h2>
        </div>
        <div id="applicationsList">
    </div>
`;

class Applications extends HTMLElement {
    constructor() {
        super()

        this.appendChild(template.content.cloneNode(true));

        this.applicationsContainer = this.children[0];

        this.applicationsListId = this.applicationsContainer.querySelector("#applicationsList");

        this.initializeApplications();

        this.addEvents();   
    }

    async initializeApplications() {
        this.applicationsList = await api.getApplications();

        this.applicationsList.forEach(app => {
            console.log('%c ', `padding: 25px; background: url("data:image/png;base64,${app.base64}") no-repeat;`);
        
            this.applicationsListId.innerHTML += `
            <div style="width: 50px;
                    height: 50px;
                    background: url('data:image/png;base64,${app.base64}');
                    background-size: contain">
            </div>
            `
        });
    }

    addEvents() {
        document.getElementById("applicationBtn").addEventListener("click", () => {
            PageHandler.switchPage(pageId);
        });

        this.applicationsContainer.querySelector("#returnOverlayBtn").addEventListener("click", () => {
            PageHandler.switchToMainPage()
        });
    }
}

window.customElements.define('applications-page', Applications);