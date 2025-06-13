const whitelist = [
  "http://localhost:3000",
  "https://mysengger.bieda.it",
];

const corsOptions = {
  origin: whitelist,
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  credentials: true,
};

export default corsOptions;
