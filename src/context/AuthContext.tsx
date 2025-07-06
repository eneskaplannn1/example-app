import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabase';
import { loginWithEmail, signupWithEmail } from '../services/authService';
import { User } from '../types/user';
import { queryClient } from '../utils/queryClient';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; user: User }
  | { type: 'LOGIN_ERROR'; error: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; user: User };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { user: action.user, isLoading: false, error: null };
    case 'LOGIN_ERROR':
      return { ...state, isLoading: false, error: action.error };
    case 'LOGOUT':
      return { ...initialState };
    case 'UPDATE_USER':
      return { ...state, user: action.user };
    default:
      return state;
  }
}

interface AuthContextProps extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const session = supabase.auth.getSession();
    session.then(({ data }) => {
      if (data.session?.user) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          user: {
            id: data.session.user.id,
            email: data.session.user.email || '',
            name: data.session.user.user_metadata?.name,
            surname: data.session.user.user_metadata?.surname,
            profile_photo: data.session.user.user_metadata?.profile_photo,
          },
        });
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          user: {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name,
            surname: session.user.user_metadata?.surname,
            profile_photo: session.user.user_metadata?.profile_photo,
          },
        });
      } else {
        dispatch({ type: 'LOGOUT' });
        queryClient.clear();
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function login(email: string, password: string) {
    dispatch({ type: 'LOGIN_START' });
    const { data, error } = await loginWithEmail(email, password);
    if (error || !data?.user) {
      dispatch({ type: 'LOGIN_ERROR', error: error?.message || 'Login failed' });
      return;
    }
    dispatch({
      type: 'LOGIN_SUCCESS',
      user: {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name,
        surname: data.user.user_metadata?.surname,
        profile_photo: data.user.user_metadata?.profile_photo,
      },
    });
  }

  async function signup(email: string, password: string) {
    dispatch({ type: 'LOGIN_START' });
    const { data, error } = await signupWithEmail(email, password);
    if (error || !data?.user) {
      dispatch({ type: 'LOGIN_ERROR', error: error?.message || 'Signup failed' });
      return;
    }
    dispatch({
      type: 'LOGIN_SUCCESS',
      user: {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name,
        surname: data.user.user_metadata?.surname,
        profile_photo: data.user.user_metadata?.profile_photo,
      },
    });
  }

  async function logout() {
    await supabase.auth.signOut();
    dispatch({ type: 'LOGOUT' });
    queryClient.clear();
  }

  function updateUser(user: User) {
    dispatch({ type: 'UPDATE_USER', user });
  }

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
