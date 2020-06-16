<template>
   <div id="messageCont">
      <ul>
         <li v-for="(message, index) in chats" :key="index">
            <div class="date" :class="{'me': message.from == user.email}">
               <h5>{{ message.localTime }}</h5>
               <!-- <h5>
                  {{ message.localTime.day + ' ' + message.localTime.hours + ':' +  message.localTime.minutes + ' ' + message.localTime.type }}</h5> -->
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
   messageDiv!: any
   user!: User
   chats: any[] = []
   time: Date = new Date()

   mounted() {
      this.getUser()
      // this.messageDiv = document.getElementById('#messageCont') as HTMLDivElement
      // this.messageDiv.scrollTop = this.messageDiv.scrollHeight
   }

   getChats() {
      db.collection(`ChatRef/${this.currentFriend.ref}/chats`).orderBy('timestamp', 'asc')
      .onSnapshot(querySnapshot => {
         this.chats = []

         // this.messageDiv.scrollTop = this.messageDiv.scrollHeight
         querySnapshot.forEach(doc => {
            this.chats = [...this.chats, { ...doc.data(), localTime: this.getLocalDate(doc.data().utcTime) }]
         })
      })
   }

   getLocalDate(date: any) {
      let currentDate = new Date()
      let messageDate = new Date(date)
      let type = 'AM'

      if(messageDate.getHours() > 12) {
         messageDate.setHours(messageDate.getHours() - 12)
         type = 'PM'
      }

      let returnDate = {
         year: messageDate.getFullYear(),
         month: messageDate.getMonth(),
         date: messageDate.getDate(),
         day: messageDate.toLocaleString('en-us', {  weekday: 'long' }),
         hours: messageDate.getHours(),
         minutes: messageDate.getMinutes(),
         type: type
      }

      let formatedDate = `${returnDate.day} ${returnDate.hours}:${returnDate.minutes} ${returnDate.type}`

      return formatedDate
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

