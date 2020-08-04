<template>
   <div id="chatTab">
      <TopBar :username="currentFriend.username" :pfp="currentFriend.pfp" />
      <MessageCont :currentFriend="currentFriend" />
      <SendForm @send-image-to-parent="getImages" @submitted-message="handleMessage" />
   </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import store from '@/store'

import SendForm from './sendForm.vue'
import TopBar from './topBar.vue'
import MessageCont from './messageCont.vue'
import UploadStatus from './uploadStatus.vue'

import { User, Friend } from '../classes'
import { sendMessage, getUserWithEmail } from '../functions'

import '@/views/firebase.config'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

@Component({
   components: {
      SendForm,
      TopBar,
      MessageCont
   }
})
export default class MessagingTab extends Vue {
   currentFriend: Friend = {
      username: '',
      tag: '',
      ref: '',
      pfp: '',
      email: ''
   }
   friends: Friend[] = []
   files: Array<File> = []

   getFriends() {
      this.friends = store.getters.getFriends
      store.watch(
         (state, getters) => getters.getFriends,
         (newVal: Friend[], oldVal) => {
            this.friends = newVal

            this.getCurrentFriend()
         }
      )
   }

   getCurrentFriend() {
      this.friends.forEach(friend => {
         if(this.$route.params.uid == friend.ref) {
            this.currentFriend = friend
         }
      })
   }
   
   handleMessage(message: any) {
      sendMessage(message, this.currentFriend)
   }

   getImages(files: Array<File>) {
      this.files = files
   }

   mounted() {
      this.getFriends()
      this.getCurrentFriend()
   }

   @Watch('$route')
   checkRoutes(val: any, oldVal: any) {
      this.getCurrentFriend()
   }
   
}

</script>

