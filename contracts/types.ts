export interface State {
  db: Array<{ pid: string; handle: string; timestamp: string }>;
  maintainer: string;
}
export interface Action {
  input: {
    function: getF;
    handle: string;
  };
}
type getF = "get" | "register" | "getHandle" | "check";
export type registerReturn = { state: State };
export type getReturn = {
  result: { success: 1; data: State["db"] } | { success: 0; Error: string };
};
export type checkReturn = {
  result: { success: 1 | 0; msg: string };
};
export type contractReturn = registerReturn | getReturn | checkReturn;
