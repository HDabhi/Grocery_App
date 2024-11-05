import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSelectors} from '../stores/selector';
import {useMutation} from '@tanstack/react-query';
import {queryClient} from '../utils/query-client';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

type AuthState = {
  token: string;
  hasHydrated: Promise<boolean>;
  userId: string;
  hasHydratedSync: boolean;
  addressId: string;
  cartId: string;
  eKartId: string;
  cartCount: number;
  fcmToken: string;
  roleType: string;
  storeClosingMsg: string;
  actions: {
    hydrate: () => void;
    changeToken: (t: string | undefined) => void;
    changeAddressId: (t: string | undefined) => void;
    changeUserId: (id: string) => void;
    changeCartId: (t: string | undefined) => void;
    changeEKartId: (t: string | undefined) => void;
    changeCartCount: (t: number) => void;
    clearAuth: () => void;
    changeFcmToken: (fcmToken: string) => void;
    changeRoleType: (type: string) => void;
    changeStoreClosingMsg: (type: string) => void;
    /**
     * @deprecated Use only if you're syncing this state with the server
     */
  };
};

let resolveHydrationValue: (value: boolean) => void;
const hasHydrated = new Promise<boolean>(res => {
  resolveHydrationValue = res;
});

const defaultState: Omit<AuthState, 'actions'> = {
  hasHydrated,
  hasHydratedSync: false,
  token: '',
  userId: '',
  addressId: '',
  cartId: '',
  eKartId:'',
  storeClosingMsg:''
};

export const useAuth = createSelectors(
  create<AuthState>()(
    persist(
      set => ({
        ...defaultState,
        actions: {
          changeToken(t) {
            set({token: t});
          },
          changeAddressId(t) {
            set({addressId: t});
          },
          changeCartId(t) {
            set({cartId: t});
          },
          changeEKartId(t) {
            set({eKartId: t});
          },
          changeUserId(id) {
            set({userId: id});
          },
          changeCartCount(count) {
            set({cartCount: count});
          },
          changeFcmToken(tokenFcm) {
            set({fcmToken: tokenFcm});
          },
          changeRoleType(type) {
            set({roleType: type});
          },
          changeStoreClosingMsg(msg) {
            set({storeClosingMsg:msg})
          },
          hydrate() {
            resolveHydrationValue(true);
            set({hasHydratedSync: true});
          },
          clearAuth() {
            set({
              token: '',
              userId: '',
              addressId: '',
              cartId: '',
              cartCount: 0,
              eKartId:'',
              storeClosingMsg:''
            });
          },
        },
      }),
      {
        name: 'auth',
        onRehydrateStorage: () => state => {
          if (!state) {
            return;
          }
          // we're going to store this store in local storage so we must make sure that hydration succeeds
          state.actions.hydrate();
        },
        storage: createJSONStorage(() => AsyncStorage),
        partialize(state) {
          // ignore actions since functions are not serializable for localStorage
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const {actions, ...rest} = state;
          return rest;
        },
      },
    ),
  ),
);

/**
 * To use directly in components
 */
export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      // Clear auth state
      useAuth.getState().actions.clearAuth();

      // Clear AsyncStorage and reset queries
      await AsyncStorage.clear();
      queryClient.invalidateQueries();
      queryClient.removeQueries();
    },
    onSettled: () => {
      console.log('User logged out and data cleared.');
    },
  });
};
