//MONGOOSE
const DB = {
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    auth: {
      authSource: process.env.DB_AUTHSOURCE,
    },
    user: process.env.DB_ROOT,
    pass: process.env.DB_PASS,
  },
};

export default DB;
