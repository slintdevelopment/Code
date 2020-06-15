<template>
   <div id="TopBar">
      <div class="info">
         <img :src="pfp" alt="" class="pfp">
         <h1>{{ username }}</h1>
      </div>
   </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class TopBar extends Vue {
   @Prop() username!: string
   @Prop() pfp!: string
}

</script>

<style>

</style>
