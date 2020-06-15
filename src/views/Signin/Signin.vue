<template>
   <div id="signin">
      <div class="content form-page-cont">
         <h1 class="title">Welcome back!</h1>
         <div class="spinner"></div>
         <SigninForm v-on:submitted="handleSubmit" />
      </div>
      <h1 class="auth-error">Coudnt SignIn</h1>
   </div>
</template>

<script lang="ts" src="./signin.ts"></script>
<style lang="sass" scopped src="./signin.sass"></style>
