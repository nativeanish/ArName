import fs from "fs";
import ArLocal from "arlocal";
import Arweave from "arweave";
import path from "path";
import { JWKInterface } from "arweave/node/lib/wallet";
import { LoggerFactory, Warp, WarpNodeFactory } from "warp-contracts";
import { checkReturn, getReturn, State } from "../contracts/types";
import { addFunds, mineBlock } from "../utils/util";
describe("testing the name contracts", () => {
  let wallet: JWKInterface;
  let wallet1: JWKInterface;
  let wallet2: JWKInterface;
  let arweave: Arweave;
  let arlocal: ArLocal;
  let warp: Warp;
  let contractTxId: string;
  const db: Array<{ pid: string; handle: string; timestamp: string }> = [];
  const perdb: Array<{ handle: string; perma: string; timestamp: string }> = [];
  beforeAll(async () => {
    arlocal = new ArLocal(8080);
    await arlocal.start();
    arweave = Arweave.init({
      host: "localhost",
      port: 8080,
      protocol: "http",
    });
    LoggerFactory.INST.logLevel("error");
    warp = WarpNodeFactory.forTesting(arweave);
    wallet = await arweave.wallets.generate();
    wallet1 = await arweave.wallets.generate();
    wallet2 = await arweave.wallets.generate();
    await addFunds(arweave, wallet);
    await addFunds(arweave, wallet1);
    await addFunds(arweave, wallet2);
    let contractSrc = fs.readFileSync(
      path.join(__dirname + "/../dist/init.js"),
      "utf8"
    );
    let statefile = fs.readFileSync(
      path.join(__dirname + "/../dist/init.json"),
      "utf8"
    );
    contractTxId = await warp.createContract.deploy({
      wallet,
      initState: statefile,
      src: contractSrc,
    });
  });
  afterAll(async () => {
    await arlocal.stop();
  });
  it("should return empty database with a maintainer List", async () => {
    const contract = warp.contract(contractTxId);
    const state = (await contract.readState()).state;
    expect(state).toEqual({
      db: db,
      maintainer: "inVhkOKTRDxZRwC5wOOf6mG5zJS25IJr2AlAaq_xzM0",
      per_db: perdb,
    });
  });

  it("adding userhandle", async () => {
    const contract = warp.contract(contractTxId).connect(wallet);
    const date = new Date().getTime() / 1000;
    const d = parseInt(date.toString());
    await contract.writeInteraction({
      function: "register",
      handle: "nativeanish",
    });
    await mineBlock(arweave);
    const state = (await contract.readState()).state;
    const pid = await arweave.wallets.jwkToAddress(wallet);
    db.push({ pid: pid, handle: "nativeanish", timestamp: d.toString() });
    expect(state).toEqual({
      db: db,
      maintainer: "inVhkOKTRDxZRwC5wOOf6mG5zJS25IJr2AlAaq_xzM0",
      per_db: perdb,
    });
  });
  it("adding another userhandle", async () => {
    const contract = warp.contract(contractTxId).connect(wallet1);
    const date = new Date().getTime() / 1000;
    const d = parseInt(date.toString());
    await contract.writeInteraction({
      function: "register",
      handle: "anish",
    });
    await mineBlock(arweave);
    const state = (await contract.readState()).state;
    const pid = await arweave.wallets.jwkToAddress(wallet1);
    db.push({ pid: pid, handle: "anish", timestamp: d.toString() });
    expect(state).toEqual({
      db: db,
      maintainer: "inVhkOKTRDxZRwC5wOOf6mG5zJS25IJr2AlAaq_xzM0",
      per_db: perdb,
    });
  });
  it("registering one more usehandle for same wallet1 address", async () => {
    const contract = warp.contract<State>(contractTxId).connect(wallet1);
    const date = new Date().getTime() / 1000;
    const d = parseInt(date.toString());
    await contract.writeInteraction({
      function: "register",
      handle: "macron",
    });
    await mineBlock(arweave);
    const state = (await contract.readState()).state;
    const pid = await arweave.wallets.jwkToAddress(wallet1);
    expect(state).not.toEqual({
      db: [
        ...state["db"],
        { pid: pid, handle: "macron", timestamp: d.toString() },
      ],
      maintainer: "inVhkOKTRDxZRwC5wOOf6mG5zJS25IJr2AlAaq_xzM0",
      per_db: perdb,
    });
  });
  it("registering registered userhandle", async () => {
    const contract = warp.contract<State>(contractTxId).connect(wallet2);
    const date = new Date().getTime() / 1000;
    const d = parseInt(date.toString());
    await contract.writeInteraction({
      function: "register",
      handle: "nativeanish",
    });
    await mineBlock(arweave);
    const state = (await contract.readState()).state;
    const pid = await arweave.wallets.jwkToAddress(wallet1);
    expect(state).not.toEqual({
      db: [
        ...state["db"],
        { pid: pid, handle: "nativeanish", timestamp: d.toString() },
      ],
      maintainer: "inVhkOKTRDxZRwC5wOOf6mG5zJS25IJr2AlAaq_xzM0",
      per_db: perdb,
    });
  });
  it("registering new userHandle with last account", async () => {
    const contract = warp.contract<State>(contractTxId).connect(wallet2);
    const date = new Date().getTime() / 1000;
    const d = parseInt(date.toString());
    await contract.writeInteraction({
      function: "register",
      handle: "mercedes",
    });
    await mineBlock(arweave);
    const state = (await contract.readState()).state;
    const pid = await arweave.wallets.jwkToAddress(wallet2);
    db.push({ pid: pid, handle: "mercedes", timestamp: d.toString() });
    expect(state).toEqual({
      db: db,
      maintainer: "inVhkOKTRDxZRwC5wOOf6mG5zJS25IJr2AlAaq_xzM0",
      per_db: perdb,
    });
  });
  it("registering one more usehandle for wallet2", async () => {
    const contract = warp.contract<State>(contractTxId).connect(wallet2);
    const date = new Date().getTime() / 1000;
    const d = parseInt(date.toString());
    await contract.writeInteraction({
      function: "register",
      handle: "linux",
    });
    await mineBlock(arweave);
    const state = (await contract.readState()).state;
    const pid = await arweave.wallets.jwkToAddress(wallet2);
    expect(state).not.toEqual({
      db: [
        ...state["db"],
        { pid: pid, handle: "linux", timestamp: d.toString() },
      ],
      maintainer: "inVhkOKTRDxZRwC5wOOf6mG5zJS25IJr2AlAaq_xzM0",
      per_db: perdb,
    });
  });
  it("testing the get method", async () => {
    const contract = warp.contract(contractTxId).connect(wallet2);
    const state = await contract.viewState<{ function: string }, getReturn>({
      function: "get",
    });
    //@ts-ignore
    expect(JSON.stringify(state.result["data"][0])).toEqual(
      JSON.stringify(db[2])
    );
  });
  it("testing the get method again", async () => {
    const contract = warp.contract(contractTxId).connect(wallet);
    const state = await contract.viewState<{ function: string }, getReturn>({
      function: "get",
    });
    //@ts-ignore
    expect(JSON.stringify(state.result["data"][0])).toEqual(
      JSON.stringify(db[0])
    );
  });
  it("testing the getHandle method", async () => {
    const contract = warp.contract(contractTxId);
    const state = await contract.viewState<
      { function: string; handle: string },
      getReturn
    >({
      function: "getHandle",
      handle: db[1]["pid"],
    });
    //@ts-ignore
    expect(JSON.stringify(state.result["data"][0])).toEqual(
      JSON.stringify(db[1])
    );
  });
  it("testing the getHandle again and failing", async () => {
    const contract = warp.contract(contractTxId);
    const state = await contract.viewState<
      { function: string; handle: string },
      getReturn
    >({
      function: "getHandle",
      handle: "nativenish",
    });
    //@ts-ignore
    expect(state.result["success"]).toEqual(0);
  });
  it("testing the check method", async () => {
    const contract = warp.contract(contractTxId);
    const state = await contract.viewState<
      { function: string; handle: string },
      checkReturn
    >({
      function: "check",
      handle: "arweave",
    });
    //@ts-ignore
    expect(state.result["success"]).toEqual(1);
  });
  it("testing the check method", async () => {
    const contract = warp.contract(contractTxId);
    const state = await contract.viewState<
      { function: string; handle: string },
      checkReturn
    >({
      function: "check",
      handle: "nativeanish",
    });
    //@ts-ignore
    expect(state.result["success"]).toEqual(0);
  });
  it("adding id to per database to show handle", async () => {
    const contract = warp.contract(contractTxId).connect(wallet);
    const date = new Date().getTime() / 1000;
    const d = parseInt(date.toString());
    await contract.writeInteraction({
      function: "register_perma",
      contract: "anishj8fr",
    });
    perdb.push({
      handle: "nativeanish",
      perma: "anishj8fr",
      timestamp: String(d),
    });
    await mineBlock(arweave);
    const state = await contract.readState();
    expect(state.state).toEqual({
      db: db,
      maintainer: "inVhkOKTRDxZRwC5wOOf6mG5zJS25IJr2AlAaq_xzM0",
      per_db: perdb,
    });
  });
  it("getting id to per database to get handle", async () => {
    const contract = warp.contract(contractTxId).connect(wallet);
    const data = await contract.viewState<{ function: string | getReturn }>({
      function: "get_perma",
    });
    expect(data.result).toEqual({
      success: 1,
      data: perdb,
    });
  });
  it("testing the get_perma method with unregistered wallet", async () => {
    const contract = warp.contract(contractTxId).connect(wallet1);
    const data = await contract.viewState<{ function: string | getReturn }>({
      function: "get_perma",
    });
    //@ts-ignore
    expect(data.result["success"]).toEqual(0);
  });
});
