const whitelist = [
  "http://localhost",
  "https://localhost",
  "http://localhost:3000",
];
const corsOptions = {
  origin: whitelist,
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  credentials: true,
};

export default corsOptions;
