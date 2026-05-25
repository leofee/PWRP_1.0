import PocketBase from "pocketbase";

const PB_URL = import.meta.env.POCKETBASE_URL || "http://127.0.0.1:8090";

let pb: PocketBase;

export function getPb(): PocketBase {
  if (!pb) {
    pb = new PocketBase(PB_URL);
  }
  return pb;
}
