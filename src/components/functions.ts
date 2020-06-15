import '@/views/firebase.config'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

import { Friend } from './classes'

function randomString(i: number) {
   return [...Array(i)].map(i=>(~~(Math.random()*36)).toString(36)).join('')
}

function signinUser(email: string, password: string, callback: Function) {
   firebase.auth().signInWithEmailAndPassword(email, password)
   .then(() => callback(true))
   .catch(e => { console.log(e.message); callback(false) })
}

function authenticateUser(email: string, password: string, callback: Function) {
   firebase.auth().createUserWithEmailAndPassword(email, password)
   .then(() => callback(true))
   .catch(e => { console.log(e.message); callback(false) })
}

function addUserToFirebase(user: any, callback: Function) {
   firebase.firestore().collection('users').doc(user.email).set(user.getUser())
   .then(() => callback(true))
   .catch(e => { console.log(e.message); callback(false) })
}

function previewFile(fileP: any, qsImgSelector: any) {
   let preview = qsImgSelector
   let file    = fileP;
   let reader  = new FileReader();
 
   reader.onloadend = function () {
     preview.src = reader.result;
   }
 
   if (file) {
     reader.readAsDataURL(file);
   } else {
     preview.src = "";
   }
}

function uploadFile(file: File, progressDiv: HTMLDivElement, callback: Function) {
   var storageRef = firebase.storage().ref('photos/' + file.name)

   var task = storageRef.put(file)

   task.on('state_changed',
      function progress(snapshot) { 
         var perc = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
         progressDiv.style.opacity = '0.8'
         progressDiv.style.transform = `translateX(${perc}%)`
      },
      function error(error) {
         console.log(error)
      },
      function complete() {
         storageRef.getDownloadURL().then(url => {
            console.log(url)
            callback(url)
         })
         .then(() => {})
         .catch(e => console.log(e.message))
      })
}

const cipher = (salt: any) => {
   const textToChars = (text: any) => text.split('').map((c:any) => c.charCodeAt(0));
   const byteHex = (n: any) => ("0" + Number(n).toString(16)).substr(-2);
   const applySaltToChar = (code: any) => textToChars(salt).reduce((a:any,b:any) => a ^ b, code);

   return (text: string) => text.split('')
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join('');
}

const decipher = (salt: any) => {
   const textToChars = (text: any) => text.split('').map((c:any) => c.charCodeAt(0));
   const applySaltToChar = (code: any) => textToChars(salt).reduce((a:any,b:any) => a ^ b, code);
   return (encoded: any) => encoded.match(/.{1,2}/g)
      .map((hex: any) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode: any) => String.fromCharCode(charCode))
      .join('');
}

function getUserWithEmail(email: string, callBack: Function) {
   firebase.firestore().collection('users').doc(email).onSnapshot(doc => {
      callBack(doc.data())
   })
}

let db = firebase.firestore()

function sendFriendReq(friend: any, user: any) {

   db.collection(`users/${user.email}/requests`).doc(friend.email).set(friend)
   .then(() => {
      db.collection(`users/${friend.email}/pending`).doc(user.email).set({
         username: user.username,
         tag: user.tag,
         email: user.email,
         pfp: user.pfp
      })
      .then(() => console.log('Done'))
   })
   .catch(e => console.log(e.message))
}

function deleteFriendReq(friend: any, user: any) {
   db.collection(`users/${user.email}/requests`).doc(friend.email).delete()
   .then(() => {
      db.collection(`users/${friend.email}/pending`).doc(user.email).delete()
      .then(() => console.log('done'))
   })
   .catch(e => console.log(e.message))
}

function deletePendingReq(friend: any, user: any) {
   db.collection(`users/${user.email}/pending`).doc(friend.email).delete()
   .then(() => {
      db.collection(`users/${friend.email}/requests`).doc(user.email).delete()
      .then(() => console.log('done'))
   })
   .catch(e => console.log(e.message))
}

function acceptRequest(friend: any, user: any) {
   let chatRef = randomString(10) 

   db.collection(`users/${user.email}/friends`).doc(friend.email).set({
      username: friend.username,
      tag: friend.tag,
      pfp: friend.pfp,
      email: friend.email,
      ref: chatRef
   })
   .then(() => {
      db.collection(`users/${friend.email}/friends`).doc(user.email).set({
         username: user.username,
         tag: user.tag,
         pfp: user.pfp,
         email: user.email,
         ref: chatRef
      })
      .then(() => {
         deletePendingReq(friend, user)
      })
   })
   .catch(e => console.log(e.message))
}

function sendMessage(message: any, friend: Friend) {
   db.collection(`ChatRef/${friend.ref}/chats`).add({
      content: message.content,
      from: message.from,
      utcTime: message.utc,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
   })
}

export { addUserToFirebase, authenticateUser, randomString, previewFile, uploadFile, signinUser,
   cipher, decipher, getUserWithEmail, deleteFriendReq, deletePendingReq, sendFriendReq, acceptRequest, sendMessage }