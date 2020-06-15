import { Vue, Component, Watch } from 'vue-property-decorator'
import SignupForm from '@/components/Signup/signupform.vue'
import UploadPfp from '@/components/Signup/uploadPfp.vue'

import '../firebase.config'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import { gsap, Power2, Elastic } from 'gsap'
import { randomString, authenticateUser, addUserToFirebase } from '@/components/functions'
import store from '@/store'

let db = firebase.firestore()
let auth = firebase.auth()

@Component({
  components: { SignupForm, UploadPfp }
})
export default class Signup extends Vue {
  user = new User()

  handleSubmission(data: any) {
    this.user.setUser(data)

    let formAnimation = gsap.timeline()
    .to('#signup .title', 0.3, { y: '-100%', ease: Power2.easeInOut }, '<')
    .to('#signupform-cont', 0.3, { scale: 0.5, pointerEvents: 'none', opacity: 0, ease: Power2.easeInOut }, '<')
    .to('#signup .spinner', 0.3, { opacity: 1, ease: Power2.easeInOut })

    authenticateUser(this.user.email, this.user.password, (done: boolean) => {
      if(done) {
        addUserToFirebase(this.user, (done: boolean) => {
         if(done) {
            console.log('done')
            
            this.$store.commit('setUser', this.user.getUser())

            gsap.timeline()
            .to('#signup .spinner', 0.15, { opacity: '0', ease: Power2.easeOut })
            .to('#uploadPfp-cont', 0.3, { y: '0', opacity: 1, ease: Power2.easeInOut })
         }
         else this.errorSnip(formAnimation)
        })
      } else {
        this.errorSnip(formAnimation)
      }
    })
  }

  errorSnip(formAnimation: any) {
    formAnimation.reverse()
    gsap.to('.signupError', 2, { scale: 1, ease: 'elastic.out(1, 0.18)' })
    setTimeout(() => {
      gsap.to('.signupError', 0.3, { scale: 0 })
    }, 4000)
    console.log('coudnt create user')
  }

}

class User {
  username!: string
  email!: string
  password!: string
  pfp!: string
  tag!: string

  setUser(data: any) {
     this.username = data.username
     this.email = data.email
     this.password = data.password
     this.pfp = data.pfp
     this.tag = '#' + randomString(4)
  }

  getUser() {
    return {
        username: this.username,
        email: this.email,
        password: this.password,
        pfp: this.pfp,
        tag: this.tag
     }
  }
}
