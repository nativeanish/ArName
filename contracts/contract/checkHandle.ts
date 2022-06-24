import { Action, checkReturn, State } from "../types";

async function check(state: State, action: Action): Promise<checkReturn> {
  const data = state.db.filter((e) => e.handle === action.input.handle);
  if (data.length) {
    return { result: { success: 0, msg: "Handle is registered" } };
  } else {
    return {
      result: { success: 1, msg: "Handle is available for registration" },
    };
  }
}
export default check;
