// Usage: node scripts/encrypt-vault.mjs <password> <source-folder-with-source-en.json etc> <lessonIndex> <out>
// Encrypts the ORIGINAL textbook text with AES-256-GCM (key from PBKDF2-SHA256). Only the encrypted file is published.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';import {webcrypto as c} from 'node:crypto';
const [pw,src,idx='0',out]=process.argv.slice(2);if(!pw||!src||!out){console.error('missing args');process.exit(1)}
const data={};for(const l of ['en','fr','ar']){const f=`${src}/source-${l}.json`;if(existsSync(f))data[l]=JSON.parse(readFileSync(f,'utf8'))[+idx]}
const salt=c.getRandomValues(new Uint8Array(16)),iv=c.getRandomValues(new Uint8Array(12)),iter=200000;
const km=await c.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveKey']);
const key=await c.subtle.deriveKey({name:'PBKDF2',salt,iterations:iter,hash:'SHA-256'},km,{name:'AES-GCM',length:256},false,['encrypt']);
const ct=new Uint8Array(await c.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(JSON.stringify(data))));
const b=u=>Buffer.from(u).toString('base64');writeFileSync(out,JSON.stringify({v:1,iter,salt:b(salt),iv:b(iv),data:b(ct)}));console.log('encrypted',Object.keys(data).join(','),'->',out);
