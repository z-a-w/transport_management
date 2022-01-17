module.exports = {
  accessOptions: [
    {
      name: "Access-Control-Allow-Origin",
      val: "http://localhost:8080",
    },
    {
      name: "Access-Control-Allow-Credentials",
      val: "true",
    },
    {
      name: "Access-Control-Allow-Methods",
      val: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    },
    {
      name: "Access-Control-Allow-Headers",
      val: "Origin, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,Content-Type, Date, X-Api-Version",
    },
  ],
};
