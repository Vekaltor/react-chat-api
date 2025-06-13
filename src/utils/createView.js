import mongoose from "mongoose";

export const createView = (nameView, callback) => {
  const db = mongoose.connection.db;
  db?.listCollections({ name: nameView }).next((err, collInfo) => {
    !collInfo ? callback(db) : null;
  });
};
