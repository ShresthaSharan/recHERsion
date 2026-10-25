export type PeriodEntry={start:string;end:string;flow:string;notes:string};
export type JournalEntry={date:string;symptoms:string[];severity:string;mood:string;energy:number;sleep:number;notes:string};
const key='cyclesense-demo-v1';
export const demoStore={read<T>(name:string,fallback:T):T{try{return JSON.parse(localStorage.getItem(`${key}:${name}`)||'null')??fallback}catch{return fallback}},write<T>(name:string,value:T){localStorage.setItem(`${key}:${name}`,JSON.stringify(value))}};
export const chatService={async send(_message:string):Promise<string>{throw new Error('The educational AI service is not connected yet. Your message was not sent to an AI provider.')}};
export const reportService={print(){window.print()},async download(){return {available:false,message:'PDF export is not connected yet. Use Print and choose “Save as PDF”.'}}};
