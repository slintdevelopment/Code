<template>
   <div id="chat">
      <SideNav />
      <main>
         <router-view
            v-on:send-friend-data="handleReqs" 
         />
         <!-- <div id="chatTab" v-if="friendsTab">
            <TopBar :username="currentFriend.username" :pfp="currentFriend.pfp" />
            <SendForm @submitted-message="handleMessage" />
         </div> -->

      </main>
   </div>
</template>

<script lang="ts" src="./chat.ts"></script>
<style lang="sass" src="./chat.sass"></style>
