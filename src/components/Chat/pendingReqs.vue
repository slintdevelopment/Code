<template>
   <div id="pendingReqs"  class="fr_cont">
      <h1 class="title_ref">Pending</h1>
      <ul v-if="!noPending">
         <li v-for="(friend , index) in pendingReqs" :key="index">
            <div class="info">
               <img class="friend_pfp" :src="friend.pfp" alt="">
               <h1>{{ friend.username }}<span>{{ friend.tag }}</span></h1>
            </div>
            <div>
               <button class="accept" @click="acceptFriendData(friend)">
                  <img src="https://www.iconsdb.com/icons/download/white/checkmark-512.png">
               </button>
               <button class="del" @click="getFriendData(friend)">
                  <img src="https://flaticons.net/icon.php?slug_category=mobile-application&slug_icon=close" alt="">
               </button>
            </div>
         </li>
      </ul>

      <div v-else class="pending_placeholder">
         <p>You dont have any pending requests</p>
      </div>

   </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import '@/views/firebase.config'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import store from '@/store';

import { deletePendingReq, acceptRequest } from '../functions'
import { User } from '../classes'

let db = firebase.firestore()

@Component
export default class PendingReqs extends Vue {
   pendingReqs: any[] = []
   noPending: boolean = true
   user!: User

   getRequests() {
      db.collection(`users/${this.user.email}/pending`).onSnapshot(querySnapshot => {
         this.pendingReqs = []
         this.noPending = false

         if(querySnapshot.docs.length == 0) {
            this.noPending = true
         }
         querySnapshot.forEach(doc => {
            this.pendingReqs = [...this.pendingReqs, doc.data()]
            console.log(this.pendingReqs)
         })
      })
   }

   getFriendData(friend: User) {
      deletePendingReq(friend, this.user)
   }

   acceptFriendData(friend: User) {
      acceptRequest(friend, this.user)
   }

   mounted() {
      this.user = store.getters.getUser
      this.getRequests()
      store.watch(
         (state, getters) => getters.getUser,
         (newValue, oldValue) => {
            this.user = newValue
            this.getRequests()
         }
      )
   }

}


</script>

