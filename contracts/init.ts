declare const ContractError: any;
import { State, Action, contractReturn } from "./types";
import register from "./contract/register";
import get from "./contract/get";
import getHandle from "./contract/getId";
import check from "./contract/checkHandle";
export function handle(state: State, action: Action): Promise<contractReturn> {
  switch (action.input.function) {
    case "register":
      return register(state, action);
    case "get":
      return get(state);
    case "getHandle":
      return getHandle(state, action);
    case "check":
      return check(state, action);
    default:
      throw new ContractError("Undefined Method Called");
  }
}
