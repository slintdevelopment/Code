<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">

$background: #0F1829;

* {
  color: #e7e7e7;

  &:focus {
    outline: 0 !important
  }
}

#app {
  font-family: 'Sen', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin: 0
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
