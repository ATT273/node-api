import { MongoClient, ServerApiVersion } from 'mongodb';

const MONGODB_URI='mongodb+srv://atuan95002:<db_password>@next-crm.edriz.mongodb.net/?retryWrites=true&w=majority&appName=next-crm'
const DB_NAME='next-crm'

let crmDatabaseInstance = null
const mongoClientInstance = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

export const CONNECT_DB = async () => {
  await mongoClientInstance.connect()
  crmDatabaseInstance = mongoClientInstance.db(DB_NAME)
}

export const GET_DB = () => {
  if(!crmDatabaseInstance) {
    throw new Error('Must connect to database first')
  }
  return crmDatabaseInstance
}