import { AnyAction } from "redux";

// Utility functions
export function updateObject<T>(oldObject: T, newObject: Partial<T>): T {
    return Object.assign({}, oldObject, newObject);
}
export function updateItemInArray<T>(array: (T & { id: number })[], itemId: number, updateItemCallback: (item: T) => T) {
    const updatedItems = array.map(item => {
        if(item.id !== itemId) return item;

        const updatedItem = updateItemCallback(item);
        return updatedItem;
    })
    return updatedItems;
}

// Function to create reducer
export function createReducer<T>(initialState: T, handlers: {[key: string]: (state: T, action: AnyAction ) => T}) {
    return function reducer(state=initialState, action: AnyAction) {
        if(handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action);
        } else {
            return state;
        }
    }
}