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

        <div id="contextMenu" class="app-context-menu">
            <ul>
                <li>
                    <button id="deleteApp" class="text-button">Delete</button>
                </li>
                <li>
                    <button id="renameApp" class="text-button">Rename</button>
                </li>
            </ul>
        </div>
    </div>
`;

class Applications extends HTMLElement {
    constructor() {
        super()

        this.appendChild(template.content.cloneNode(true));

        this.applicationsContainer = this.children[0];

        this.applicationInput = this.applicationsContainer.querySelector("#applicationInput");
        this.applicationsList = this.applicationsContainer.querySelector("#applicationsList");
        this.contextMenu = this.applicationsContainer.querySelector("#contextMenu");
        this.selectedApp;

        this.applicationsContainer.addEventListener('mouseup', (e) => {
            this.hideMenu();
        });
        
        this.initializeApplications();
        
        this.addEvents();
        this.addContextMenuEvents();
        this.addApplicationInputEvent();
    }

    addEvents() {
        document.getElementById("applicationBtn").addEventListener("click", () => {
            PageHandler.switchPage(pageId);
        });

        this.applicationsContainer.querySelector("#returnOverlayBtn").addEventListener("click", () => {
            PageHandler.switchToMainPage()
        });
    }


    addContextMenuEvents() {
        this.contextMenu.querySelector("#deleteApp").addEventListener('click', (e) => {
            this.deleteApp();
        });

        this.contextMenu.querySelector("#renameApp").addEventListener('click', (e) => {
            this.renameApp();
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

    async initializeApplications() {
        api.getApplications().then(applicationsList => {
            this.applicationsList.innerHTML = "";

            applicationsList.data.forEach((app, key) => {     
                const appDiv = document.createElement("div");
                appDiv.classList = "app";
                appDiv.key = key;
                
                appDiv.onclick = function () {  
                    api.openApplication(app.path);
                };
                
                appDiv.oncontextmenu = function (e) {
                    this.openMenu(e);
                }.bind(this);
                
                const appImg = document.createElement("img");
                appImg.classList = "app-icon";
                appImg.src = app.dataUrl;

                const appSpan = document.createElement("span");
                appSpan.classList = "app-title";
                appSpan.textContent = app.name;

                appDiv.appendChild(appImg);
                appDiv.appendChild(appSpan);

                this.applicationsList.appendChild(appDiv);
            });
        });
    }

    hideMenu() { 
        this.contextMenu.style.display = "none" 
    } 
    
    openMenu(e) { 
        e.preventDefault(); 

        this.selectedApp = e.currentTarget.key;

        var menu = this.contextMenu;      
        menu.style.display = 'block'; 
        menu.style.left = e.pageX + "px"; 
        menu.style.top = e.pageY + "px"; 
    }

    deleteApp() {
        console.log("delete " + this.selectedApp);
    }

    renameApp() {
        console.log("rename " + this.selectedApp);
    }
}

window.customElements.define('applications-page', Applications);