import { State, Action, getReturn } from "../types";
async function getHandle(state: State, action: Action): Promise<getReturn> {
  const data = state.db.filter((e) => e.pid == action.input.handle);
  if (data.length) {
    return { result: { success: 1, data: data } };
  } else {
    return { result: { success: 0, Error: "No User Handle Found" } };
  }
}
export default getHandle;
