import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import type {User} from 'firebase/auth';
import {authService} from './firebase-auth';
import {firebaseConfigured} from './firebase';

type AuthState={user:User|null;loading:boolean;configured:boolean;error:string};
const Context=createContext<AuthState>({user:null,loading:true,configured:firebaseConfigured,error:''});
export function AuthProvider({children}:{children:ReactNode}){
  const [state,setState]=useState<AuthState>({user:null,loading:true,configured:firebaseConfigured,error:''});
  useEffect(()=>{
    let active=true;
    const timeout=window.setTimeout(()=>setState(current=>current.loading?{...current,loading:false,error:'Firebase could not finish checking your sign-in. Check your connection and try again.'}:current),15000);
    const unsubscribe=authService.subscribe(
      user=>{if(!active)return;window.clearTimeout(timeout);setState({user,loading:false,configured:firebaseConfigured,error:''});},
      error=>{if(!active)return;window.clearTimeout(timeout);setState({user:null,loading:false,configured:firebaseConfigured,error:error.message||'Could not check your Firebase sign-in status.'});},
    );
    return ()=>{active=false;window.clearTimeout(timeout);unsubscribe();};
  },[]);
  return <Context.Provider value={state}>{children}</Context.Provider>;
}
export function useAuth(){return useContext(Context)}
