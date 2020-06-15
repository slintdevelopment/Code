<template>
   <div id="friendReqs" class="fr_cont">
      <h1 class="title_ref">Requests</h1>
      <ul v-if="!noReqs">
         <li v-for="(friend , index) in friendReqs" :key="index">
            <div class="info">
               <img class="friend_pfp" :src="friend.pfp" alt="">
               <h1>{{ friend.username }}<span>{{ friend.tag }}</span></h1>
            </div>
            <button class="del" @click="getFriendData(friend)">
               <img src="https://flaticons.net/icon.php?slug_category=mobile-application&slug_icon=close" alt="">
            </button>
         </li>
      </ul>

      <div v-else class="reqs_placeholder">
         <p>You haven't reqeusted anyone</p>
      </div>
   </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import '@/views/firebase.config'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import store from '@/store';

import { deleteFriendReq } from '../functions'
import { User } from '../classes'

let db = firebase.firestore()

@Component
export default class FriendReqs extends Vue {
   friendReqs: any[] = []
   noReqs: boolean = true
   user!: User

   getRequests() {
      db.collection(`users/${this.user.email}/requests`).onSnapshot(querySnapshot => {
         this.friendReqs = []
         this.noReqs = false
         
         if(querySnapshot.docs.length == 0) {
            this.noReqs = true
         }
         querySnapshot.forEach(doc => {
            this.friendReqs = [...this.friendReqs, doc.data()]
         })
      })
   }

   getFriendData(friend: User) {
      deleteFriendReq(friend, this.user)
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

