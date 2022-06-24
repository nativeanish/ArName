import { State, getReturn } from "../types";
async function get(state: State): Promise<getReturn> {
  //@ts-ignore
  const target = SmartWeave.transaction.owner;
  const data = state.db.filter((e) => e.pid == String(target));
  if (data.length) {
    return { result: { success: 1, data: data } };
  } else {
    return { result: { success: 0, Error: "No User Handle found" } };
  }
}
export default get;
