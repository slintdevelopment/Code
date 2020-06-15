<template>
   <div ref="messages" id="messageCont">
      <ul>
         <li v-for="(message, index) in chats" :key="index">
            <div class="date">
               <h5>{{ message.localTime.hours }} : {{ message.localTime.minutes }}</h5>
            </div>
            <p :class="{ 'me': message.from == user.email }">{{ message.content }}</p>
         </li>
      </ul>
   </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref, Watch } from 'vue-property-decorator'
import store from '@/store'

import '@/views/firebase.config'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

import { Friend, User } from '../classes'
 
let db = firebase.firestore()

@Component
export default class MessageCont extends Vue {
   @Prop() currentFriend!: Friend
   @Ref('messages') message!: HTMLDivElement
   user!: User
   chats: any[] = []
   time: Date = new Date()

   mounted() {
      this.getUser()
      this.message.scrollTop = this.message.scrollHeight
   }

   getChats() {
      db.collection(`ChatRef/${this.currentFriend.ref}/chats`).orderBy('timestamp', 'asc')
      .onSnapshot(querySnapshot => {
         this.chats = []

         this.message.scrollTop = this.message.scrollHeight
         querySnapshot.forEach(doc => {
            this.chats = [...this.chats, { ...doc.data(), localTime: this.getLocalDate(doc.data().utcTime) }]
         })
      })
   }

   getLocalDate(date: any) {
      let currentDate = new Date()
      let messageDate = new Date(date)

      let returnDate = {
         year: messageDate.getFullYear(),
         month: messageDate.getMonth(),
         date: messageDate.getDate(),
         day: messageDate.getDay(),
         hours: messageDate.getHours(),
         minutes: messageDate.getMinutes()
      }

      // if(currentDate.getFullYear() == messageDate.getFullYear()
      // && currentDate.getMonth() == messageDate.getMonth()
      // && currentDate.getMonth() == messageDate.getMonth()
      // && currentDate.getMonth() == messageDate.getMonth()
      // && currentDate.getMonth() == messageDate.getMonth()) {

      // }

      return returnDate

   }

   getUser() {
      this.user = store.getters.getUser
      store.watch(
         (state, getters) => getters.getUser,
         (newVal: any, oldVal: any) => {
            this.user = newVal
         }
      )
   }

   @Watch('currentFriend')
   watchCurrentFriend() {
      this.getChats()
   }

}
</script>

