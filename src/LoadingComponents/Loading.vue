<template>
  <div class="container">
    <div class="loader">
      <font-awesome-icon :icon="['fas', 'spinner']" size="9x"/>
    </div>
    <p class="Info LoaderDescription">{{Description}}</p>
  </div>
</template>

<script>
import {computed} from "vue";

export default {
name: "Loading",
  props: ['load-description'],
  setup(props) {

    const Description = computed(() => {
      console.log(props.loadDescription)
      return props.loadDescription
    })

    return {
      Description
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
  width: 100vw;
  position: fixed;
  inset: 0;
  background: white;
  display: flex;
  //justify-content: center;
  //align-items: center;
  flex-direction: column;
  .loader {
    margin: auto;
    animation: 2s rotate-fade infinite linear;
    color: $green-main;
    @keyframes rotate-fade {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.1;
      }
      100% {
        transform:rotate(-360deg);
        opacity: 1;
      }
    }
  }
  .LoaderDescription {
    position: absolute;
    top: 70%;
    width: 100%;
    text-align: center;
  }

}
</style>