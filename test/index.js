import { Application } from 'spectron'
import { expect } from 'chai'
// import { electron } from 'electron-prebuilt-compile/lib/main'
import * as path from 'path'

const electron = require.resolve('electron-prebuilt-compile/lib/cli')
// eslint-disable-next-line func-names, prefer-arrow-functions
describe('application launch', function () {
  this.timeout(30000)
  let app

  before(() => {
    app = new Application({
      path: './out/lobster-telephone-darwin-x64/lobster-telephone.app/Contents/MacOS/lobster-telephone',
      // path: electron,
      // args: [
      //   path.join(__dirname, '../src'),
      // ],
      // startTimeout: this.timeout,
    })
    return app.start()
  })

  after(() => {
    if (app && app.isRunning()) {
      return app.stop()
    }
    return null
  })

  it('opens a window', async () => {
    const browserWindow = app.client.browserWindow
    expect(await app.client.getWindowCount()).to.be.above(0)
    expect(await browserWindow.isMinimized()).to.be.false
    expect(await browserWindow.isDevToolsOpened()).to.be.false
    expect(await browserWindow.isVisible()).to.be.true
    expect(await browserWindow.isFocused()).to.be.true
    expect(await browserWindow.getBounds()).to.have.property('width').and.be.above(0)
    expect(await browserWindow.getBounds()).to.have.property('height').and.be.above(0)
  })
})
