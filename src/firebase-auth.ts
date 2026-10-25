import {createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile, type User} from 'firebase/auth';
import {requireFirebase} from './firebase';
import {saveProfile} from './firestore';

export const authService = {
  subscribe(callback:(user:User|null)=>void, onError?:(error:Error)=>void) {
    try { const {auth}=requireFirebase(); return onAuthStateChanged(auth, callback, error=>onError?.(error)); }
    catch (error) { onError?.(error as Error); return () => {}; }
  },
  async signUp(name:string,email:string,password:string) {
    const {auth}=requireFirebase();
    const credential=await createUserWithEmailAndPassword(auth,email,password);
    let profileTimer:ReturnType<typeof setTimeout>|undefined;
    const profileSetup=Promise.race([
      Promise.all([
        updateProfile(credential.user,{displayName:name}),
        saveProfile(credential.user.uid,{displayName:name,email:credential.user.email||email}),
      ]),
      new Promise<never>((_,reject)=>{profileTimer=setTimeout(()=>reject(new Error('Profile setup timed out. Your account is active; check your connection and try again from Profile & Settings.')),15000);}),
    ]).finally(()=>{if(profileTimer)clearTimeout(profileTimer);});
    return {user:credential.user,profileSetup};
  },
  async signIn(email:string,password:string) { const {auth}=requireFirebase(); return (await signInWithEmailAndPassword(auth,email,password)).user; },
  async signOut() { const {auth}=requireFirebase(); await signOut(auth); },
  async reset(email:string) { const {auth}=requireFirebase(); await sendPasswordResetEmail(auth,email); },
  async updateProfileData(uid:string,data:{displayName:string;email:string;dateOfBirth?:string}) {
    const {auth}=requireFirebase();
    if(!auth.currentUser||auth.currentUser.uid!==uid) throw new Error('You must be signed in to update this profile.');
    await updateProfile(auth.currentUser,{displayName:data.displayName});
    await saveProfile(uid,data);
  },
};

export type AuthUser = User;
