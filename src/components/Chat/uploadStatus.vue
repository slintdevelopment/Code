<template>
  <div id="uploadStatusWrapper" v-if="files.length != 0">
      <div id="uploadStatus">
        <h2 class="image-name"> {{ currentFile.name }} <span>Uploading</span></h2>
        <div class="progress_cont">
          <div class="progress_div">
              <div class="progress_r" ref="progress"></div>
          </div>
          <h3 class="file-size">
            {{ currentFile.size > 1000 ? currentFile.size/1000 : currentFile.size }}
            <span>{{ currentFile.size > 1000 ? 'MB' : 'KB' }}</span>
          </h3>
        </div>
      </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Ref } from 'vue-property-decorator'

import firebase from 'firebase/app'
import 'firebase/storage'

@Component
export default class UploadStatus extends Vue {
  @Prop() files!: File[]
  @Ref('progress') progress!: HTMLDivElement
  currentFile = {
    name: 'Something.jpg',
    size: 5000
  }

  uploadProgress: number = 80

  mounted() {
    this.progress.style.transform = `translateX(${this.uploadProgress}%)`
    console.log(this.files)
  }

  // sets the progress of the file uplaod
  @Watch('uploadProgress')
  onProgress(val: number) {
    this.progress.style.transform = `translateX(${val}%)`

    if(val == 100) {
      this.progress.style.background = 'rgb(88, 152, 71)'
    }
    else {
      this.progress.style.background = ''
    }
  }

  uploadImage(file: File, progressUpdate: Function, callback: Function) {
      let storageRef = firebase.storage().ref('photos/' + file.name)

      let task = storageRef.put(file)

      task.on('state_changed',
         function progress(snapshot) {
            let perc = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            progressUpdate(perc)
         },
         function error(err) {
            console.log(err)
         },
         function complete() {
            storageRef.getDownloadURL().then(url => {
               callback(url)
            }).catch(e => console.log(e.message))
         }
      )
   }

  // checks when files are selected
  @Watch('files')
  onFileChanged(val: Array<File>) {
    if(val.length != 0) {
      this.uploadProgress = 0

      let size = val[0].size / 1000

      this.currentFile = {
        name: val[0].name,
        size: Math.round(size)
      }

      this.uploadImage(val[0],
        (progress: number) => {
          this.uploadProgress = progress
        },
        (url: string) => {
          this.uploadProgress = 0
          this.files = []
          console.log(this.files)
        }
      )
    }
  }

}

</script>
