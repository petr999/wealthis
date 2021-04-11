"use strict"
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

module.exports = function (port) {
  const app = express()

  app.use(cors())
  app.use(bodyParser.json())

  this.app = app
  this.port = port
  this.listen = () => {
    const [app, port] = [this.app, this.port]

    app.listen(port, () => {
      console.log(`listen: ${port}`)
    })
  }
}
