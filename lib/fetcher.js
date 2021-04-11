"use strict"
const needle = require("needle")

const retrieveUrl = `https://reqres.in/api/users`

module.exports = function (interval, dbObj) {
  const retrieve = async () => {
    const firstPage = await needle("get", retrieveUrl)
    const firstPageBody = firstPage.body
    const pagesCount = firstPageBody.total_pages
    if (0 < pagesCount) {
      const firstPageData = firstPageBody.data

      await dbObj.upsertDataByReqres(firstPageData)
      for (let i = 1; i < pagesCount; i++) {
        const pageNo = i + 1
        const url = `${retrieveUrl}?page=${pageNo}`
        const page = await needle("get", url)
        const data = page.body.data

        await dbObj.upsertDataByReqres(data)
      }
    }
  }

  this.run = () => {
    ;(function runOnce() {
      console.log(`Run in interval: ${interval}`)
      ;(async () => {
        await retrieve()
      })()

      setTimeout(runOnce, interval)
    })()
  }
}
