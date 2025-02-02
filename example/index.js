const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const sqlite = require('sqlite-electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}
app.enableSandbox()
app.whenReady().then(() => {
  sqlite.dbPath = 'test.db';
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('potd', (event, dbPath) => {
  sqlite.dbPath = dbPath
  return true
})

ipcMain.handle('executeQuery', async (event, query, fetch, value) => {
  try {
    return await sqlite.executeQuery(query, fetch, value);
  } catch (error) {
    return error
  }
})

ipcMain.handle('executeMany', async (event, query, values) => {
  try {
    return await sqlite.executeMany(query, values)
  } catch (error) {
    return error
  }
})

ipcMain.handle('executeScript', async (event, scriptpath) => {
  try {
    return await sqlite.executeScript(scriptpath);
  } catch (error) {
    return error
  }
})
