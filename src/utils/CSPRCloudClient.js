const https = require("https");

class CSPRCloudClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseHost = "api.cspr.cloud";
  }

  async queryContractEntryPoint(contractHash, entryPoint) {
    const path = "/v1/contracts/" + contractHash + "/entry-points/" + entryPoint;
    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.baseHost,
        path: path,
        method: "GET",
        headers: {
          "Authorization": "Bearer " + this.apiKey,
          "Content-Type": "application/json"
        }
      };
      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", chunk => data += chunk);
        res.on("end", () => {
          try { resolve(JSON.parse(data)); }
          catch (e) { reject(new Error("Invalid JSON from CSPR.cloud")); }
        });
      });
      req.on("error", reject);
      req.end();
    });
  }

  async getLatestRisk(contractHash) {
    try {
      const result = await this.queryContractEntryPoint(contractHash, "get_latest_risk");
      console.log("   📡 CSPR.cloud — Latest Risk:", JSON.stringify(result));
      return result;
    } catch (error) {
      console.error("   ⚠️  CSPR.cloud query failed:", error.message);
      return null;
    }
  }

  async getState(contractHash) {
    try {
      const result = await this.queryContractEntryPoint(contractHash, "get_state");
      console.log("   📡 CSPR.cloud — State:", JSON.stringify(result));
      return result;
    } catch (error) {
      console.error("   ⚠️  CSPR.cloud query failed:", error.message);
      return null;
    }
  }
}

module.exports = CSPRCloudClient;
