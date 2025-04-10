import { makeAutoObservable } from 'mobx';
export default class CounterStore {
    count: number = 0;
    title: string = 'Counter Store';
    constructor() {
        makeAutoObservable(this, 
        );
    }

    increment = (amount = 1) => {
        // this.count = this.count + 1; 
        this.count+= amount; // Increment by the specified amount
    }

    decrement = (amount = 1) => {
this.count-= amount; // Decrement by the specified amount
    }
}
