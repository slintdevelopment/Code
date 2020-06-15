<template>
  <div id="signup">
    <div class="content form-page-cont">
      <h1 class="title">Be a part of us!</h1>
      <div class="spinner"></div>
      <SignupForm v-on:submitted="handleSubmission" />
      <UploadPfp />
    </div>
    <h1 class="signupError auth-error">Coudnt signup</h1>
  </div>
</template>

<script lang="ts" src="./signup.ts"></script>
<style lang="sass" src="./signup.sass"></style>
