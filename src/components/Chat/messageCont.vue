<template>
   <div ref="messageCont" id="messageCont">
      <ul>
         <li v-for="(message, index) in chats" :key="index">
            <p :class="{ 'me': message.from == user.email }">{{ message.content }}</p>
            
            <div class="date" :class="{'meDate': message.from == user.email}"
            v-if="index != (chats.length-1) && chats[index+1].from != message.from">
               <img v-if="chats[index+1].from == currentFriend.email" :src="currentFriend.pfp" alt="">
               <h5>{{ message.localTime }}</h5>
            </div>
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
   @Ref("messageCont") messageCont!: HTMLDivElement
   messageDiv!: any
   user!: User
   chats: any[] = []
   time: Date = new Date()

   mounted() {
      this.getUser()
      this.getChats()
      this.messageCont.scrollTop = this.messageCont.scrollHeight
   }

   getChats() {
      db.collection(`ChatRef/${this.currentFriend.ref}/chats`).orderBy('timestamp', 'asc')
      .onSnapshot(querySnapshot => {
         this.chats = []
         querySnapshot.forEach(doc => {
            this.chats = [...this.chats, { ...doc.data(), localTime: this.getLocalDate(doc.data().utcTime) }]
            setTimeout(() => {
               this.messageCont.scrollTop = this.messageCont.scrollHeight
            }, 0);
         })
      })
   }

   prevMessage!: any

   getLocalDate(date: any) {
      let currentDate = new Date()
      let messageDate = new Date(date)
      let currentType = 'AM'
      let type = 'AM'
      this.prevMessage = date

      if(messageDate.getHours() > 12) {
         messageDate.setHours(messageDate.getHours() - 12)
         type = 'PM'
      }

      if(currentDate.getHours() > 12) {
         currentDate.setHours(currentDate.getHours() - 12)
         currentType = 'PM'
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
      
      if(returnDate.date == currentDate.getDate() && returnDate.month == currentDate.getMonth() && returnDate.year == currentDate.getFullYear()) {
         returnDate.day = 'Today'
      } else if(returnDate.date == (currentDate.getDate()-1) && returnDate.month == currentDate.getMonth() && returnDate.year == currentDate.getFullYear()) {
         returnDate.day = 'Yesterday'
      }

      let formatedDate = `${returnDate.day} at ${returnDate.hours}:${returnDate.minutes} ${returnDate.type}`

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

