require('dotenv').config()
const process = require('process')
const neo4j = require('neo4j-driver')

const driver = neo4j.driver(
  process.env.NEO4J_DATABASE_URL,
  neo4j.auth.basic(process.env.NEO4J_DATABASE_USER, process.env.NEO4J_DATABASE_PASSWORD)
)

const session = driver.session({ database: process.env.NEO4J_DATABASE })

module.exports = session