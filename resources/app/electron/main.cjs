const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false // Simplified for this quick setup
    },
    title: "Provencesa Invoice System",
    autoHideMenuBar: true,
  });

  // Check if we are in development mode
  const isDev = !app.isPackaged;

  if (isDev) {
    win.loadURL('http://localhost:1422');
    // win.webContents.openDevTools();
  } else {
    // In production, load the index.html from the dist folder
    // Adjust the path to where dist is relative to this file
    // If this file is in Electron/main.cjs and dist is ../dist
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
