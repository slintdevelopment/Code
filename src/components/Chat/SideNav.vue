<template>
   <div id="sidenav">
      <div id="profile">
         <img :src="user.pfp" alt="">
         <h1 class="username">{{ user.username }}<div>{{ user.tag }}</div></h1>
      </div>

      <input type="text" placeholder="Search friends" v-model="friendSearch" id="friend_search">

      <div v-if="friends.length == 0" class="friend_placeholder">
         <p class="text">You currently dont have any friends</p>
      </div>
      <div v-else class="friends">
         <ul>
            <router-link :to="'/app/' + friend.ref" v-for="(friend, index) in s_friends" :key="index">
            <li @click="makeFriendActive">
               <img :src="friend.pfp" alt="">
               <h1 class="username">{{ friend.username }}<span>{{ friend.tag }}</span></h1>
            </li>
            </router-link>
         </ul>
      </div>

   </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import '@/views/firebase.config'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import store from '@/store'

import { User } from '../classes'

let db = firebase.firestore()

@Component
export default class SideNav extends Vue {
   user: User = {
      username: 'Demo',
      tag: '#0000',
      pfp: 'https://lh3.googleusercontent.com/D-haUsSx771Pt4brCyFEJUNKZaC8NUsD2bMB-ZL_yE2LnYdmt3YbgfZwDDM9B-wBHw',
      email: 'demo@somewhere.com'
   }
   friendSearch: string = ''

   friends: any[] = []
   s_friends = this.friends

   @Watch('friendSearch')
   handleSearch(val: string) {
      if(val != '') {
         let arrVal = val.split('')
         this.s_friends = this.friends.filter((friend: User) => {
            return friend.username.toLowerCase().includes(val.toLowerCase())
         })
      } else {
         this.s_friends = this.friends
      }
   }

   makeFriendActive(e: any) {
      console.log(e.target.classList.add('activeFriend'))
   }

   getFriends() {
      db.collection(`users/${this.user.email}/friends`).onSnapshot(querySnapshot => {
         this.friends = []
         querySnapshot.forEach(doc => {
            this.friends = [...this.friends, doc.data()]
            this.s_friends = this.friends
            store.commit('setFriends', this.friends)
         })
      })
   }

   mounted() {
      this.user = store.getters.getUser
      this.s_friends = this.friends
      this.getFriends()
      store.watch(
         (state, getters) => getters.getUser,
         (newValue, oldValue) => {
            this.user = newValue

            this.getFriends()
         }
      )
   }

}

</script>

