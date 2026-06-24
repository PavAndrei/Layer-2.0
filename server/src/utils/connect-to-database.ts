import mongoose from 'mongoose';
import { MONGO_URI } from '../constants/env';

const connectToDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB successfully ✅');
    console.log(mongoose.connection.db?.databaseName);
  } catch (err) {
    console.log('Could not connect to DB ❌: ', err);
    process.exit(1);
  }
};

export default connectToDB;
