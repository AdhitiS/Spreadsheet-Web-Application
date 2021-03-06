const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ejs = require("ejs-electron");

ejs.data({
  title: "SpreadSheet Web Application"
})

function createWindow () {
  // Create the browser window.
 
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
    }
  })
  // and load the index.html of the app.
  win.loadFile('index.ejs').then(() => {
      // win.webContents.openDevTools();
      win.removeMenu();
      win.show();
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