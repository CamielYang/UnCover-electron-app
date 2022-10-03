const { ipcRenderer } = require('electron');
const child = require('child_process').exec;
const storage = require('electron-json-storage');

const emptyApplicationStorage = {
    data: []
};

let applications;

function getApplications() {
    if (!applications) {
        applications = storage.getSync("applications");
    }

    if (!applications.data) {
        applications = JSON.parse(JSON.stringify(emptyApplicationStorage));

        Promise.resolve(JSON.parse(JSON.stringify(emptyApplicationStorage)));
    }

    if (!applications.data.every(app => Object.values(app).length == 3)) {
        applications.data.forEach((app, index) => {
            setApplicationData(index, app.path);
        });
    }

    return new Promise(function (resolve) {
        (function waitForCompletion(){

            if (applications.data.every(app => Object.values(app).length == 3)) {
                resolve(applications);
            } else {
                setTimeout(waitForCompletion, 300);
            }
        })();
    });
}

function extractAppFileName(path) {
    return path.match(/(?<process>[\w.-]*)\.exe/i)[1];
}

function addApplication(path) {
    return getApplications().then(applications => {
        applications.data.push({
            path: path
        });
        saveApplications(applications);
    });
}

function deleteApplication(index) {
    return getApplications().then(applications => {
        applications.data.splice(index, 1);
        saveApplications(applications);
    });
}

function renameApplication(index, name) {
    return getApplications().then(applications => {
        applications.data[index].name = name;
        saveApplications(applications);
    });
}

function saveApplications(applications) {
    const storageList = JSON.parse(JSON.stringify(emptyApplicationStorage));

    applications.data.forEach(app => {
    storageList.data.push({
            name: app.name,
            path: app.path
        });
    });

    storage.set("applications", storageList);
}

function setApplicationData(index, path) {
    if (!applications.data[index].name) {
        applications.data[index].name = extractAppFileName(path);
    }
    ipcRenderer.invoke('get-file-icon', path).then(dataUrl => {
        applications.data[index].dataUrl = dataUrl;
    });
}

const contextBridge = {
    getApplications: () => getApplications(),
    addApplication: (path) => addApplication(path),
    deleteApplication: (index) => deleteApplication(index),
    renameApplication: (index, name) => renameApplication(index, name),
    openApplication: (path) => {
        ipcRenderer.invoke('close-window', '');

        child(`"${path}"`, (err, stdout) => {
            if(err){
               console.error(err);
               return;
            }

            console.log(stdout);
        });
    },
};

module.exports = {
    applications: contextBridge
};
