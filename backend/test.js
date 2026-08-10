const dns = require("dns");

dns.resolveSrv("_mongodb._tcp.cluster0.kofnfep.mongodb.net", (err, records) => {
  console.log("Error:", err);
  console.log("Records:", records);
});