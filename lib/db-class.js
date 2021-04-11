"use strict"
const mariadb = require("mariadb")

module.exports = function (host, user, password, database) {
  this.pool = mariadb.createPool({
    host,
    user,
    password,
    database,
    connectionLimit: 15,
  })

  this.existPersonByRow = async (dbh, row) => {
    let rv = false

    const [
      reqresId,
      email,
      first_name,
      last_name,
      avatar,
    ] = `reqresId email first_name last_name avatar`.split(/ +/).map((val) => {
      const rv = row[val]
      return rv
    })
    const sql = "select count(id) as cnt from reqresUsers where email=?"
    const data = await dbh.query(sql, [email])
    const cnt = data[0].cnt
    rv = 0 < cnt

    return rv
  }

  this.updatePerson = async (dbh, row) => {
    const [
      reqresId,
      email,
      first_name,
      last_name,
      avatar,
    ] = `reqresId email first_name last_name avatar`.split(/ +/).map((val) => {
      const rv = row[val]
      return rv
    })
    const sql =
      "update reqresUsers set " +
      "reqresId first_name last_name avatar"
        .split(/ +/)
        .map((val) => {
          const rv = val + " = ? "
          return rv
        })
        .join(", ") +
      " where email = ?"
    await dbh.query(sql, [reqresId, first_name, last_name, avatar, email])
  }

  this.insertPerson = async (dbh, row) => {
    const [
      reqresId,
      email,
      first_name,
      last_name,
      avatar,
    ] = `reqresId email first_name last_name avatar`.split(/ +/).map((val) => {
      const rv = row[val]
      return rv
    })
    const sql =
      "insert into reqresUsers  ( " +
      `reqresId email first_name last_name avatar`.split(/ +/).join(", ") +
      " ) values ( " +
      `reqresId email first_name last_name avatar`
        .split(/ +/)
        .map((val) => {
          const rv = " ? "
          return rv
        })
        .join(", ") +
      " )"
    await dbh.query(sql, [reqresId, email, first_name, last_name, avatar])
  }

  this.tryCatchWithDbh = async (sub) => {
    const pool = this.pool
    const dbh = await pool.getConnection()
    try {
      await sub(dbh)
    } catch ($e) {
      throw $e
    } finally {
      if (dbh) {
        return dbh.end()
      }
    }
  }

  this.upsertPersonRow = async (row) => {
    await this.tryCatchWithDbh(async (dbh) => {
      const exist = await this.existPersonByRow(dbh, row)
      if (exist) {
        await this.updatePerson(dbh, row)
      } else {
        await this.insertPerson(dbh, row)
      }
    })
  }

  this.upsertDataByReqres = async (data) => {
    data.forEach((row) => {
      ;(async (row) => {
        row.reqresId = row.id
        delete row.id

        await this.upsertPersonRow(row)
      })(row)
    })
  }

  this.retrievePersons = async (searchString) => {
    let [rv, values] = [[], []]

    let sql = "select * from reqresUsers "
    if (searchString.length) {
      values.push(searchString)
      sql +=
        " where match( first_name, last_name ) " +
        " against ( ? in boolean mode ) "
    }
    await this.tryCatchWithDbh(async (dbh) => {
      rv = await dbh.query(sql, values)
    })

    return rv
  }
}
