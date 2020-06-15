<template>
   <div id="friends_tab">
      <h1 class="title">Pending</h1>
      <form @submit="validateFriendData" id="sendReq_form">
         <label for="req_value">Send a friend request</label>
         <div>
            <input v-model="friendData" placeholder="Enter Username#tag" type="text" id="req_value">
            <button :class="{ 'active': validated }" type="submit">Send</button>
         </div>
      </form>
      <div class="cont">
         <FriendReqs />
         <PendingReqs />
      </div>
   </div>   
</template>

<script lang="ts">
import { Vue, Component, Watch, Emit, Prop } from 'vue-property-decorator'
import '@/views/firebase.config'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

import FriendReqs from './friendReqs.vue'
import PendingReqs from './pendingReqs.vue'

let db = firebase.firestore()

@Component({
   components: {
      FriendReqs,
      PendingReqs
   }
})
export default class FriendsTab extends Vue {
   friendData: string = ''
   validated: boolean = false

   @Emit()
   sendFriendData(data: object) {
      return data
   }

   validateFriendData(e: Event) {
      e.preventDefault()
      if(this.validated) {
         let Arrdata = this.friendData.split('#')
         let friendData = {
            username: Arrdata[0],
            tag: '#' + Arrdata[1]
         }

         db.collection('users').where('tag', '==', friendData.tag).where('username', '==', friendData.username).get()
         .then(querySnapshot => {
            querySnapshot.forEach(doc => {
               this.sendFriendData({
                  username: doc.data().username,
                  tag: doc.data().tag,
                  email: doc.data().email,
                  pfp: doc.data().pfp
               })
            })
         })
      }
      this.friendData = ''
   }

   @Watch('friendData')
   onInputChange(val: string, oldVal: string) {
      if(val != '' && val.includes('#') && !val.endsWith('#') && val.length > 6) {
         this.validated = true
      } else {
         this.validated = false
      }
   }

}

</script>

