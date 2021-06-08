const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ejs = require("ejs-electron");

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // webPreferences: {
    //   preload: path.join(__dirname, 'preload.js')
    // }
  })
  // and load the index.html of the app.
  win.loadFile('index.ejs').then(() => {
      win.webContents.openDevTools();
      win.maximize();
  })
}


app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})