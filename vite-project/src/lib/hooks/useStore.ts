import { useContext } from "react";
import { storeContext } from "../stores/store";

export function useStore() {
    return useContext(storeContext);
}