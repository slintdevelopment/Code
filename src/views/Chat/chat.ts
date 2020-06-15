import { Vue, Component, Watch } from 'vue-property-decorator'
import store from '@/store'

import FriendsTab from '@/components/Chat/FriendsTab.vue'
import TopBar from '@/components/Chat/topBar.vue'
import SideNav from '@/components/Chat/SideNav.vue'
import SendForm from '@/components/Chat/sendForm.vue';

import { getUserWithEmail, decipher, sendMessage, sendFriendReq } from '@/components/functions'
import { User, Friend } from '@/components/classes'

let decryptor = decipher('MySlintSalt')

@Component({
   components: {
      SideNav,
      FriendsTab,
      TopBar,
      SendForm
   }
})
export default class Chat extends Vue {
   email: string = decryptor(localStorage.getItem('uid'))

   user!: User
   currentFriend: Friend = {
      username: '',
      tag: '',
      pfp: '',
      ref: '',
      email: ''
   }
   friends: Friend[] = []

   doneGettingUser: boolean = false
   friendsTab: boolean = false

   handleReqs(data: any) {
      sendFriendReq(data, this.user)
   }

   getFriends() {
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

   checkFriendsTab() {
      if(this.$route.params.uid != undefined ||
         this.$route.params.uid != null) {
            this.friendsTab = true
      }
   }

   // Stores message into database
   handleMessage(message: any) {
      sendMessage(message, this.currentFriend)
   }

   mounted() {
      getUserWithEmail(this.email, (data: User) => {
         this.doneGettingUser = true
         this.user = data
         store.commit('setUser', data)
      })
      this.getFriends()
      this.checkFriendsTab()
   }

   @Watch('$route')
   checkRoutes(val: any) {
      this.getCurrentFriend()
      this.checkFriendsTab()
   }

}