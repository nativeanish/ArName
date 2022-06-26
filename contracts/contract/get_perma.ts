import { getReturn, State } from "../types";

async function get_perma(state: State): Promise<getReturn> {
  //@ts-ignore
  const owner = SmartWeave.transaction.owner;
  const data = state.db.filter((e) => e.pid === String(owner));
  if (data.length) {
    const m_data = state.per_db.filter((e) => e.handle === data[0].handle);
    if (m_data.length) {
      return { result: { success: 1, data: m_data } };
    } else {
      return {
        result: {
          success: 0,
          Error: "You Are not id is not assigned on your handle.",
        },
      };
    }
  } else {
    return {
      result: {
        success: 0,
        Error: "You Are not register with Handle. First Register your handle.",
      },
    };
  }
}
declare const ContractError: any;
export default get_perma;
