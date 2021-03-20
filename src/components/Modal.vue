<template>
  <section class="outside" @click="HideModal"></section>
  <div class="popup">
    <div class="popupInner">
      <header>
        <slot name="titleOfPopup">
        </slot>
      </header>
      <main>
        <slot name="PropertiesToShow"></slot>
      </main>
    </div>
  </div>

</template>

<script>
import {ref} from "vue";

export default {
name: "Modal",

  emits: ['hide-modal'],

  setup(_, context) {


  const HideModal = () => {
    context.emit('hide-modal')
  }
    return {
      HideModal,
    }
  }
}
</script>

<style scoped lang="scss">

.outside {
      background-color: rgba(0, 0, 0, 0.2);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 20;

      display: flex;
      align-items: center;
      justify-content: center;
    }

.popup{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;



  @media (max-width: 764px){
    width: 100%;
  }

  .popupInner {
    z-index: 99;
    background: #FFF;
    padding: 32px;
    border-radius: 6px;

    header {
      font-size: 40px;
      margin-bottom: 24px;
      text-align: center;
    }
    main {

    }
  }
}

</style>