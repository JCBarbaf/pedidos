const neo4jDb = require('../models/neo4j')

module.exports = class GraphService {
  createNode = async (entity, data) => {
    try {
      const entityCamelCase = entity.charAt(0).toLowerCase() + entity.slice(1)

      const setString = Object.entries(data).map(([key, value]) => {
        return `${entityCamelCase}.${key} = $${key}`
      }).join(',')

      const node = await neo4jDb.run(
        `MERGE (${entityCamelCase}:${entity} {id: $id})
        SET ${setString}
        RETURN ${entityCamelCase}`,
        data
      )

      return node
    } catch (err) {
      return false
    }
  }

  createRelation = async (entity, relation, relatedEntity, data) => {
    try {
      const entityCamelCase = entity.charAt(0).toLowerCase() + entity.slice(1)
      const relatedEntityCamelCase = relatedEntity.charAt(0).toLowerCase() + relatedEntity.slice(1)

      let queryString = `
        MATCH (${entityCamelCase}:${entity} {id: ${data.entityId}})
        MATCH (${relatedEntityCamelCase}:${relatedEntity} {id: ${data.relatedEntityId}})
        MERGE (${entityCamelCase})-[r:${relation}]->(${relatedEntityCamelCase})
      `

      if (data.properties) {
        const createPropertiesString = Object.entries(data.properties).map(([key, value]) => {
          return `r.${key} = ${value}`
        }).join(',')

        const updatePropertiesString = Object.entries(data.properties).map(([key, value]) => {
          return `r.${key} = r.${key} + ${value}`
        }).join(',')

        queryString += `ON CREATE SET ${createPropertiesString} ON MATCH SET ${updatePropertiesString}`
      }

      const nodeRelation = await neo4jDb.run(
        `${queryString}`
      )

      return nodeRelation
    } catch (err) {
      return false
    }
  }
}