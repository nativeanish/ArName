import fs from "fs";
import Arweave from "arweave";
import { WarpNodeFactory } from "warp-contracts";
import path from "path";
(async () => {
  const arweave = Arweave.init({
    host: "testnet.redstone.tools",
    port: 443,
    protocol: "https",
  });
  const wallet = JSON.parse(
    fs.readFileSync(path.join(__dirname + "/../main.json"), "utf8")
  );
  const warp = WarpNodeFactory.forTesting(arweave);
  const contract = fs.readFileSync(
    path.join(__dirname + "/../dist/init.js"),
    "utf8"
  );
  const state = fs.readFileSync(
    path.join(__dirname + "/../dist/init.json"),
    "utf8"
  );
  const contractsrx = await warp.createContract.deploy({
    wallet,
    initState: state,
    src: contract,
  });
  console.log(contractsrx);
})();
