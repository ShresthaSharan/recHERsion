import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, updateDoc, type DocumentData} from 'firebase/firestore';
import {requireFirebase} from './firebase';
import type {JournalEntry, PeriodEntry} from './services';

const userCollection=(uid:string,name:string)=>{const {db}=requireFirebase();return collection(db,'users',uid,name)};
const userDoc=(uid:string,name:string)=>{const {db}=requireFirebase();return doc(db,'users',uid,name)};
function clean<T extends Record<string,unknown>>(value:T):T { return Object.fromEntries(Object.entries(value).filter(([,v])=>v!==undefined)) as T; }

export type StoredPeriod=PeriodEntry & {id:string};
export type StoredJournal=JournalEntry & {id:string};

export async function saveProfile(uid:string,data:{displayName?:string;email?:string;dateOfBirth?:string;language?:string;timeZone?:string}) {
  const {db}=requireFirebase(); await setDoc(doc(db,'users',uid),clean({...data,updatedAt:serverTimestamp()}),{merge:true});
}
export async function getProfile(uid:string) { const {db}=requireFirebase(); const snap=await getDoc(doc(db,'users',uid)); return snap.exists()?snap.data() as DocumentData:null; }
export async function savePreferences(uid:string,data:Record<string,unknown>) {
  const {db}=requireFirebase(); await setDoc(doc(db,'users',uid,'settings','preferences'),clean({...data,updatedAt:serverTimestamp()}),{merge:true});
}
export async function getPreferences(uid:string) { const {db}=requireFirebase(); const snap=await getDoc(doc(db,'users',uid,'settings','preferences')); return snap.exists()?snap.data():null; }
export async function listPeriods(uid:string):Promise<StoredPeriod[]> {
  const snap=await getDocs(query(userCollection(uid,'cycles'),orderBy('start','desc'))); return snap.docs.map(d=>({id:d.id,...d.data()} as StoredPeriod));
}
export async function createPeriod(uid:string,value:PeriodEntry) {
  const {db}=requireFirebase(); const ref=await addDoc(userCollection(uid,'cycles'),clean({...value,createdAt:serverTimestamp(),updatedAt:serverTimestamp()})); return {id:ref.id,...value};
}
export async function updatePeriod(uid:string,id:string,value:PeriodEntry) {
  const {db}=requireFirebase(); await updateDoc(doc(db,'users',uid,'cycles',id),clean({...value,updatedAt:serverTimestamp()}));
}
export async function deletePeriod(uid:string,id:string) { const {db}=requireFirebase(); await deleteDoc(doc(db,'users',uid,'cycles',id)); }
export async function listJournal(uid:string):Promise<StoredJournal[]> {
  const snap=await getDocs(query(userCollection(uid,'journal'),orderBy('date','desc'))); return snap.docs.map(d=>({id:d.id,...d.data()} as StoredJournal));
}
export async function saveJournal(uid:string,value:JournalEntry,id?:string) {
  const {db}=requireFirebase();
  if(id){await updateDoc(doc(db,'users',uid,'journal',id),clean({...value,updatedAt:serverTimestamp()}));return {id,...value}}
  const ref=await addDoc(userCollection(uid,'journal'),clean({...value,createdAt:serverTimestamp(),updatedAt:serverTimestamp()}));return {id:ref.id,...value};
}
export async function deleteJournal(uid:string,id:string) { const {db}=requireFirebase(); await deleteDoc(doc(db,'users',uid,'journal',id)); }
export async function getSavedArticles(uid:string):Promise<string[]> {
  const snap=await getDocs(userCollection(uid,'savedArticles')); return snap.docs.map(d=>d.id);
}
export async function setSavedArticle(uid:string,articleId:string,saved:boolean) {
  const {db}=requireFirebase(); const ref=doc(db,'users',uid,'savedArticles',articleId);
  if(saved) await setDoc(ref,{savedAt:serverTimestamp()}); else await deleteDoc(ref);
}
