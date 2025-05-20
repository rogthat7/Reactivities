import { createContext } from "react";
import CounterStore from "./counterStore";
import { UIStore } from "./UIStore";
import { ActivityStore } from "./activityStore";

interface Store {
  counterStore: CounterStore;
  UIStore: UIStore;
  activityStore: ActivityStore;
}
export const store: Store = {
  counterStore: new CounterStore(),
  UIStore: new UIStore(),
  activityStore: new ActivityStore(),
};
export const storeContext = createContext(store);
