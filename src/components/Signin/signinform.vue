<template>
   <div id="signinform-cont">
      <form @submit="submitted" id="signinform" class="auth-form">
         <div class="group">
            <label for="Email">Email</label>
            <input v-model="email" id="Email" type="email">
         </div>
         <div class="group">
            <label for="Password">Password</label>
            <input v-model="password" id="Password" type="password">
            <div class="errors">
               <p v-if="errors.sh_password" class="len">Your password at least has to be 8 characters</p>
            </div>
         </div>
         <div class="group">
            <button :class="{ 'validated': totalErrors }" type="submit">Signin</button>
         </div>
      </form>
   </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Emit } from 'vue-property-decorator'

@Component
export default class SigninForm extends Vue {
   totalErrors: boolean = true
   email: string = ''
   password: string = ''

   errors = {
      email: false,
      password: false,
      sh_password: false
   }

   @Emit()
   submitted(e: Event) {
      e.preventDefault()
      if(!this.totalErrors) {
         let data = {
            email: this.email,
            password: this.password
         }
         return data
      }
   }

   @Watch('password')
   onPasswordChanged(val: string, oldVal: string) {
      if(val.length === 0) {
         this.errors.password = true
      }
      if(val.length < 8 && val.length != 0) {
         this.errors.password = true
         this.errors.sh_password = true
      }
      else {
         this.errors.password = false
         this.errors.sh_password = false
      }
      this.checkTotalErrors()
   }

   @Watch('email')
   onEmailChanged(val: string, oldVal: string) {
      if(val == '' || val == null) {
         this.errors.email = true
      }
      else {
         this.errors.email = false
      }
      this.checkTotalErrors()
   }
   
   checkTotalErrors() {
      if(this.errors.email == true || this.errors.password == true
         || this.email == '' || this.password == '') {
         this.totalErrors = true
      } else if(!this.errors.email == true || !this.errors.password == true || this.email != '' || this.password != '') {
         this.totalErrors = false
      }
   }


}

</script>

