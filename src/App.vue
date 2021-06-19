<template>
  <div>
    <vue-pdf urlOrFile="https://pro-repair.tope365.com/dev/repair/testReport/2021-06-17/abd8e164-6cdb-4c7d-a628-2c3d427d3b4e.pdf"></vue-pdf>
  </div>
</template>

<script>
import vuePdf from './vue_pdf.vue'

export default {
  name: 'App',
  components: {
    vuePdf
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
