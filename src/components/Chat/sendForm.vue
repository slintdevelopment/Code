   <template>
   <div id="sendForm">
      <div class="formCont">
         <form @submit="handleSubmit">
            <input v-model="messageContent" placeholder="Type your message here . . ." type="text">
            <button :class="{ 'isntNull': notNull }" type="submit">
               <img src="../../assets/send.svg" alt="">
            </button>
         </form>
         <label for="sendImg">
            <img src="../../assets/image.svg" alt="">
         </label>
         <input @change="onImageChange" type="file" name="" id="sendImg">
      </div>
   </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Emit } from 'vue-property-decorator'
import store from '@/store'

import firebase, { functions } from 'firebase/app'
import 'firebase/storage'

@Component
export default class SendForm extends Vue {
   messageContent: string = ''
   notNull: boolean = false

   handleSubmit(e: Event) {
      e.preventDefault()
      let date = new Date()
      let UTCDate = {
         minutes: date.getUTCMinutes(),
         hours: date.getUTCHours(),
         day: date.getUTCDay(),
         date: date.getUTCDate(),
         month: date.getUTCMonth(),
         seconds: date.getUTCSeconds(),
         year: date.getUTCFullYear()
      }

      let returnObject = {
         content: this.messageContent.trim(),
         from: store.getters.getUser.email,
         utc: date.toUTCString()
      }

      if(this.messageContent != "" && this.messageContent != null && this.messageContent != " ") {
         this.submittedMessage(returnObject)
         this.messageContent = ''
      }
   }

   @Emit()
   sendImageToParent(files: Array<File>) {
      return files
   }

   onImageChange(e: any) {
      this.sendImageToParent(e.target.files)
   }

   @Watch('messageContent')
   checkMessage(val: string) {
      if(val != '') {
         this.notNull = true
      } else {
         this.notNull = false
      }
   }

   @Emit()
   submittedMessage(data: any) {
      return data
   }

   @Watch('$route')
   checkRoutes(val: any) {
      this.messageContent = ''
   }

}

</script>

<style>

</style>
