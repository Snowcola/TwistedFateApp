const { app, BrowserWindow } = require("electron");
const path = require("path");
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const PY_DIST_FOLDER = "backend";
const PY_FOLDER = "twisted_fate";
const PY_MODULE = "twisted_fate"; // without .py suffix

let pyProc = null;

const getPyPath = () => {
  return path.join(__dirname, PY_DIST_FOLDER, PY_FOLDER, PY_MODULE + ".exe");
};

const spawnPyProcess = () => {
  let script = getPyPath();

  pyProc = require("child_process").execFile(script);

  if (pyProc != null) {
    console.log("Client backend successfully spawned");
  }
};

const exitPyProc = () => {
  pyProc.kill();
  pyProc = null;
};
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 600
  });

  // and load the index.html of the app.
  mainWindow.loadURL("http://localhost:8080/index.html");

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", spawnPyProcess);
app.on("will-quit", exitPyProc);
app.on("ready", createWindow);
// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
