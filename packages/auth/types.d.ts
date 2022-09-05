import { FirebaseOptions } from "firebase/app";
import { User } from "firebase/auth";

export namespace IAuth {
  export type IdToken = string | null;

  export interface LoginEvent {
    isNewUser: boolean;
    signInMethod?: string;
  }

  export interface InstanceOptions {
    firebaseOptions: FirebaseOptions;
    storeNamespace: string;
  }

  export interface State {
    idToken: IdToken;
    isVerified: boolean;
    isLoading: boolean;
    user: User | null;
  }
}
