import loggerMiddleware from './middleware/logger';
import monitorReducerEnhancer from './enhancers/monitorReducer';
import { $CombinedState, AnyAction, combineReducers, configureStore as _configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import { dashboardReducer } from './dashboard/reducer';
import { DashboardState } from './dashboard/types';

const combinedReducers = combineReducers({
    dashboard: dashboardReducer
});

const reducer = (state: ReturnType<typeof combinedReducers>, action: AnyAction) => {
    if(action.type === HYDRATE) {
        // We don't need to hydrate these
        delete action.payload.teams;

        const nextState = {
            ...state,
            ...(action.payload as typeof state)
        }
        return nextState;
    }
    return combinedReducers(state, action) as typeof state;
}

function configureStore() {
    const middlewares = process.env.NODE_ENV !== 'production' ? [loggerMiddleware] : [];
    const enhancers = process.env.NODE_ENV !== 'production' ? [monitorReducerEnhancer] : [];

    const store = _configureStore({
        reducer: reducer as any,
        middleware: defaultMiddleware => [
            ...middlewares,
            ...defaultMiddleware()
        ],
        enhancers: defaultEnhancers => [
            ...enhancers,
            ...defaultEnhancers,
        ],
        devTools: true,
    })

    return store;
}
export const store = configureStore();
export const wrapper = createWrapper(() => store);

// Types based on store
export type RootState = {
    readonly [$CombinedState]?: undefined;
} & {
    dashboard: DashboardState;
}

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = ReturnType<typeof configureStore>['dispatch'];

// Use throughout your app instead of plain `useDispatch` and `useSelector`
type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;