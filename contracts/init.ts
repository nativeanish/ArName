declare const ContractError: any;
import { State, Action, contractReturn } from "./types";
import register from "./contract/register";
import get from "./contract/get";
import getHandle from "./contract/getId";
import check from "./contract/checkHandle";
import register_per from "./contract/register_per";
import get_perma from "./contract/get_perma";
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
    case "register_perma":
      return register_per(state, action);
    case "get_perma":
      return get_perma(state);
    default:
      throw new ContractError("Undefined Method Called");
  }
}
