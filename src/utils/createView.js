export const createView = (db, nameView, callback) => {
  db.db.listCollections({ name: nameView }).next((err, collInfo) => {
    !collInfo ? callback() : null;
  });
};
