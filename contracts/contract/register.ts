declare const ContractError: any;
import { State, Action, registerReturn } from "../types";
async function register(state: State, action: Action): Promise<registerReturn> {
  let regex = /^[a-z0-9]+$/;
  if (!regex.test(action.input.handle)) {
    throw new ContractError("Input String is not valid for handle");
  }
  //@ts-ignore
  const owner = SmartWeave.transaction.owner;
  const name = state.db.filter((e) => e.handle == action.input.handle);
  const id = state.db.filter((e) => e.pid == String(owner));
  if (name.length) {
    throw new ContractError("User handle is already registered");
  }
  if (id.length) {
    throw new ContractError(
      "Public Id is already registered with a User Handle"
    );
  }
  if (name.length === 0 && id.length === 0) {
    //@ts-ignore
    const time = SmartWeave.block.timestamp;
    state.db = [
      ...state.db,
      {
        pid: String(owner),
        handle: String(action.input.handle),
        timestamp: String(time),
      },
    ];
    return { state: state };
  }
  return { state: state };
}
export default register;
