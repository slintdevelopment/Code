import { Vue, Component } from 'vue-property-decorator'
import SigninForm from '@/components/Signin/signinform.vue'

import { gsap, Power2, Elastic } from 'gsap'
import { signinUser, cipher } from '@/components/functions'

@Component({ components: { SigninForm } })
export default class Signin extends Vue {
   encryptor = cipher('MySlintSalt')

   handleSubmit(data: any) {
      let formAnim = gsap.timeline()
      .to('#signinform-cont', 0.3, { scale: 0, ease: Power2.easeInOut })
      .to('#signin .spinner', 0.3, { opacity: 1 })

      signinUser(data.email, data.password, (done: boolean) => {
         if(done) {
            console.log('%c Signed in user',
            'background: #5c9c5e; padding: 7px; color: #fff; border-radius: 3px')
            localStorage.setItem('uid', this.encryptor(data.email))
            location.replace('/app')
         } else {
            formAnim.reverse()
            gsap.to('.auth-error', 0.8, { scale: 1, ease: 'elastic.out(1, 0.2)' })
            setTimeout(() => {
               gsap.to('.auth-error', 0.3, { scale: 0 })
            }, 4000)
            console.log('Coudnt sign in')
         }
      })
   }

}