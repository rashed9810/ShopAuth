const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const localUri = "mongodb://localhost:27017/shopauth";
const atlasUri = process.env.MONGODB_URI;

async function migrateData() {
  try {
    // Connect to both databases
    const localClient = await MongoClient.connect(localUri);
    const atlasClient = await MongoClient.connect(atlasUri);

    // Get database references
    const localDb = localClient.db();
    const atlasDb = atlasClient.db();

    // Get all collections
    const collections = await localDb.listCollections().toArray();

    // Migrate each collection
    for (const collection of collections) {
      console.log(`Migrating collection: ${collection.name}`);

      // Get all documents from local
      const docs = await localDb.collection(collection.name).find({}).toArray();

      if (docs.length > 0) {
        // Insert into Atlas
        await atlasDb.collection(collection.name).insertMany(docs);
        console.log(
          `✓ Migrated ${docs.length} documents from ${collection.name}`
        );
      }
    }

    console.log("Migration completed successfully!");

    // Close connections
    await localClient.close();
    await atlasClient.close();
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateData();
