import { Action, contractReturn, State } from "../types";

async function register_per(
  state: State,
  action: Action
): Promise<contractReturn> {
  //@ts-ignore
  const target = SmartWeave.transaction.owner;
  const data = state.db.filter((e) => e.pid === target);
  if (data.length) {
    const m_data = state.per_db.filter((e) => e.handle === data[0].handle);
    if (m_data.length) {
      state.per_db = state.per_db.filter((e) => e.handle !== data[0].handle);
      //@ts-ignore
      const time = SmartWeave.block.timestamp;
      state.per_db.push({
        handle: data[0].handle,
        perma: action.input.contract,
        timestamp: String(time),
      });
      return { state };
    } else {
      //@ts-ignore
      const time = SmartWeave.block.timestamp;
      state.per_db.push({
        handle: data[0].handle,
        perma: action.input.contract,
        timestamp: String(time),
      });
      return { state };
    }
  } else {
    throw new ContractError("You are not register with your handle");
  }
}
export default register_per;
declare const ContractError: any;
