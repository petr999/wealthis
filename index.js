"use strict"
const expressenClass = require("./lib/expressen.js")
const dbClass = require("./lib/db-class.js")
const fetcherClass = require("./lib/fetcher.js")

const env = process.env
const port = 3000
const interval = 60 * 1000

const expressen = new expressenClass(port)
const app = expressen.app

const dbObj = new dbClass(
  `mariadb`,
  ...[`MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`].map((envKey) => {
    const rv = env[envKey]
    return rv
  })
)
const fetcher = new fetcherClass(interval, dbObj)

// Define request response in root URL (/)
app.get("/api/v0/health-check", function (req, res) {
  res.send("OK")
})

// get people lists
app.get("/api/v0/persons", function (req, res) {
  ;(async () => {
    try {
      let searchString = ""
      const query = req.query
      if ("searchString" in query) {
        searchString = query.searchString
      }
      const data = await dbObj.retrievePersons(searchString)
      res.json({
        status: 200,
        data,
        message: "Persons list retrieved successfully",
      })
    } catch (err) {
      throw err
    }
  })()
})

// Launch listening server on port 3000
expressen.listen()

fetcher.run()
