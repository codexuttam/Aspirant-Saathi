const dns = require("dns").promises;
async function test() {
  console.log("Checking gmail.com");
  const res = await dns.resolveMx("gmail.com");
  console.log("Result:", res);
}
test().catch(console.error);
