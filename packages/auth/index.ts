import consola from "consola";
import { FirebaseOptions, initializeApp, FirebaseApp } from "firebase/app";
import {
  Auth as FirebaseAuth,
  AuthProvider,
  getAdditionalUserInfo,
  getAuth,
  getRedirectResult,
  isSignInWithEmailLink,
  onAuthStateChanged,
  Unsubscribe,
  UserCredential,
} from "firebase/auth";
import localForage from "localforage";
import { useAuthStore } from "./store";
import { IAuth } from "./types";

const TOKEN_REFRESH_TIME_IN_MILLISECONDS: number = 300000; // 5 minutes
const LOCALFORAGE_INSTANCE_STORE_NAME: string = "auth";

export class Auth {
  private static instance: Auth;
  private firebaseApp?: FirebaseApp;
  private firebaseOptions: FirebaseOptions;
  private state: IAuth.State = {
    idToken: null,
    isVerified: false,
    isLoading: true,
    user: null,
  };
  private loginEvent: IAuth.LoginEvent | null = null;
  private store: LocalForage;
  private firebaseListenerUnsubscriber: Unsubscribe | null = null;
  private tokenRefreshTimer?: ReturnType<typeof setInterval>;
  private isIdTokenLoading: boolean = false;

  public onStateUpdate?: (state: IAuth.State) => void | undefined;

  constructor({ firebaseOptions, storeNamespace }: IAuth.InstanceOptions) {
    this.firebaseOptions = firebaseOptions;
    this.store = this.createStoreInstance(storeNamespace);
  }

  public static getInstance(options: IAuth.InstanceOptions): Auth {
    if (!Auth.instance) {
      Auth.instance = new Auth(options);
    }

    return Auth.instance;
  }

  init() {
    this.firebaseApp = initializeApp(this.firebaseOptions);

    this.setState(Auth.getInitialState());

    setTimeout(() => {
      this.initializeFirebaseListeners();
    }, 3000);
  }

  async initializeFirebaseListeners() {
    try {
      const auth = getAuth(this.firebaseApp);

      if (isSignInWithEmailLink(auth, window.location.href)) {
        this.signInWithEmailLink(auth);
      } else {
        await this.getRedirectResult(auth);
      }

      this.onAuthStateChanged(auth);
    } catch (error) {
      consola.error(error);
    }
  }

  signInWithEmailLink(auth: FirebaseAuth) {}

  async getRedirectResult(auth: FirebaseAuth): Promise<UserCredential | null> {
    try {
      const userCredential = await getRedirectResult(auth);

      if (userCredential) {
        this.loginEvent = {
          isNewUser: !!getAdditionalUserInfo(userCredential)?.isNewUser,
          signInMethod: userCredential.providerId || "",
        };
      }

      return userCredential;
    } catch (error) {
      consola.error(error);
    }

    return null;
  }

  onAuthStateChanged(auth: FirebaseAuth) {
    if (!!this.firebaseListenerUnsubscriber || this.state.isVerified) {
      return;
    }

    this.firebaseListenerUnsubscriber = onAuthStateChanged(auth, (user) => {
      this.setState({
        isVerified: true,
        user: user?.uid ? user : null,
      });

      if (!user?.uid) {
        this.setState({
          isLoading: false,
        });

        return;
      }

      this.refreshIdToken();
      this.createIdTokenInterval();
    });
  }

  createIdTokenInterval() {
    if (this.tokenRefreshTimer) {
      clearInterval(this.tokenRefreshTimer);
    }

    this.tokenRefreshTimer = setInterval(
      this.refreshIdToken,
      TOKEN_REFRESH_TIME_IN_MILLISECONDS
    );
  }

  async refreshIdToken(idToken?: IAuth.IdToken) {
    if (!this.state?.user?.uid || this.isIdTokenLoading) {
      return;
    }

    let hasError: boolean = false;
    this.isIdTokenLoading = true;

    if (!idToken) {
      const auth = getAuth();

      try {
        idToken = await auth.currentUser?.getIdToken();
      } catch {
        hasError = true;
      }
    }

    if (idToken) {
      try {
        // const { data } = await this.$axios.get<IProfileResponse>('auth', {
        //   headers: {
        //     'X-API-KEY': idToken,
        //   },
        // });

        // fetch profile
        // set cookies
        this.setState({
          idToken,
          isLoading: false,
        });
      } catch {
        hasError = true;
      }
    }

    this.isIdTokenLoading = false;

    if (this.loginEvent) {
      // Metrics

      this.loginEvent = null;
    }

    if (!hasError) {
      return;
    }

    if (this.state.isLoading) {
      // id token error toast
    }

    setTimeout(() => {
      this.refreshIdToken();
    }, 3000);
  }

  destroy() {}

  /**
   * Create the store instance.
   * @returns Returns a LocalForage instance.
   */
  private createStoreInstance(name: string): LocalForage {
    if (this.store) {
      return this.store;
    }

    return localForage.createInstance({
      name,
      storeName: LOCALFORAGE_INSTANCE_STORE_NAME,
    });
  }

  async signInWithGoogle() {
    try {
      const { GoogleAuthProvider } = await import("firebase/auth");

      this.signInWithRedirect(new GoogleAuthProvider());
    } catch (error) {
      consola.error(error);
    }
  }

  async signInWithRedirect(authProvider: AuthProvider) {
    try {
      // localStorage('@sabido:isSigningWithRedirect', authProvider.providerId);
      // dispatch('updateFirebaseOptions');

      const auth = getAuth();
      const { signInWithRedirect } = await import("firebase/auth");

      await signInWithRedirect(auth, authProvider);
    } catch (error) {
      // localStorage('@sabido:isSigningWithRedirect', null);
      consola.error(error);
    }
  }

  async signOut() {
    try {
      const auth = getAuth();
      const { signOut } = await import("firebase/auth");

      await signOut(auth);

      this.setState({
        isLoading: false,
        idToken: null,
        isVerified: true,
        user: null,
      });
    } catch (error) {
      consola.error(error);
    }
  }

  setState(state: Partial<IAuth.State>) {
    this.state = {
      ...this.state,
      ...state,
    };

    if (this.onStateUpdate) {
      this.onStateUpdate(this.state);
    }
  }

  static getInitialState(): IAuth.State {
    return {
      idToken: "",
      isLoading: true,
      isVerified: false,
      user: null,
    };
  }
}

export { useAuthStore };
