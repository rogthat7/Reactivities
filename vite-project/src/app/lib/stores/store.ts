import { createContext } from "react";
import CounterStore from "./counterStore";
import { UIStore } from "./UIStore";

interface Store {
    counterStore: CounterStore;
    UIStore : UIStore
}
export const store: Store = {
    counterStore: new CounterStore(),
    UIStore: new UIStore()
};
export const storeContext = createContext(store);
