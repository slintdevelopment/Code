<template>
   <div id="uploadPfp-cont">
      <div class="img-cont">
         <img src="https://lh3.googleusercontent.com/D-haUsSx771Pt4brCyFEJUNKZaC8NUsD2bMB-ZL_yE2LnYdmt3YbgfZwDDM9B-wBHw" id="pfp_preview">
         <div class="progress"></div>
      </div>
      <div class="options">
         <label for="pfp">Upload profile photo</label>
         <input @change="getImage" type="file" accept="image/*" id="pfp" alt="">
         <button class="use_default">Use the default</button>
      </div>
   </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import store from '@/store'
import { previewFile, uploadFile } from '../functions'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'

@Component
export default class UploadPfp extends Vue {
   user: any
   file: any
   pfpImg: any
   options!: HTMLDivElement
   progressBar: any

   getImage(e: any) {
      this.user = this.$store.getters.getUser
      console.log(this.user)
      this.file = e.target.files[0]
      this.options.classList.add('disabled')
      previewFile(this.file, this.pfpImg)
      uploadFile(this.file, this.progressBar, (url: string) => {
         firebase.firestore().collection('users').doc(this.user.email).update({ pfp: url })
         .then(() => console.log('done'))
         .catch(e => console.log(e.message))
      })
   }

   mounted() {
      this.pfpImg = document.querySelector('#pfp_preview')
      this.progressBar = document.querySelector('#uploadPfp-cont .progress')
      this.options = document.querySelector('#uploadPfp-cont .options') as HTMLDivElement
   }

}

</script>

