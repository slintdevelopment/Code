<template>
   <div id="signupform-cont">
      <form @submit="submitted" id="signupform" class="auth-form">
         <div class="group">
            <label for="username">Username</label>
            <input v-model="username" id="username" type="text">
            <div class="errors">
               <p v-if="errors.username" class="len">Your username cant be bigger then 13 characters</p>
            </div>
         </div>
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
            <button :class="{ 'validated': totalErrors }" type="submit">Signup</button>
         </div>
      </form>
   </div>
</template>

<script lang="ts">
import { Vue, Component, Emit, Watch } from 'vue-property-decorator'

@Component
export default class SignupForm extends Vue {
   username: string = ''
   email: string = ''
   password: string = ''

   totalErrors = true
   errors = {
      username: false,
      email: false,
      password: false,
      sh_password: false
   }

   @Emit()
   submitted(e: Event) {
      e.preventDefault()
      if(this.totalErrors != true) {
         let data = {
            username: this.username,
            email: this.email,
            password: this.password,
            pfp: 'https://lh3.googleusercontent.com/D-haUsSx771Pt4brCyFEJUNKZaC8NUsD2bMB-ZL_yE2LnYdmt3YbgfZwDDM9B-wBHw'
         }
         return data
      }
   }

   // Watchers

   @Watch('username')
   onUsernameChanged(val: string, oldVal: string) {
      if(val.length > 10) {
         this.errors.username = true
      }
      else {
         this.errors.username = false
      }
      this.checkTotalErrors()
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
      if(this.errors.email == true || this.errors.username == true || this.errors.password == true
         || this.email == '' || this.username == '' || this.password == '') {
         this.totalErrors = true
      } else if(!this.errors.email == true || !this.errors.username == true || !this.errors.password == true || this.email != '' || this.username != '' || this.password != '') {
         this.totalErrors = false
      }
   }

}

</script>

