import React from "react";
import ActivityStore from "./activityStore";

interface Store {
    activityStore: ActivityStore;
}

export const store: Store = {
    activityStore: new ActivityStore()
}

export const StoreContext = React.createContext(store);
export const useStore = () => React.useContext(StoreContext);