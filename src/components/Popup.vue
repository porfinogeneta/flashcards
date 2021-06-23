<template>
  <section class="container">
    <div class="foreground">
      <p class="title">
        <slot name="title"></slot>
      </p>
      <div class="properties">
        <slot name="properties"></slot>
      </div>
      <div class="btnManager">
        <button class="ButtonExitPopUp Cancel" type="submit" @click="exitPopUp('rejected')">
          Cancel
        </button>
        <button class="ButtonExitPopUp" type="submit" @click="exitPopUp('accepted')">
          <slot name="ButtonExitPopUp">Done!</slot>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Popup",
  setup(_, context) {

    const exitPopUp = (payload) => {
      context.emit('exit-popup', payload)
    }

    // const cancel = () => {
    //   context.emit('cancel')
    // }
    // const accept = () => {
    //   context.emit('accept')
    // }

    return {
      exitPopUp,
      // cancel,
      // accept
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  .foreground {
    border-radius: 7px 7px 7px 7px;
    position: fixed;
    left: 50%;
    transform: translate(-50%, 0);
    display: grid;
    //grid-template-columns: 0.5fr 2fr 1fr;
    grid-template-rows: 0.5fr 2fr 1fr;
    max-width: 100vw;
    max-height: 80vh;
    @media (min-width: 1080px) {
      width: 60vw;
      height: 30vw;
    }
    background: #ffffff;
    .title {
      padding: 1rem;
      text-align: center;
      font-size: 1.5em;
      border-bottom: solid 3px #5dee08;
      align-self: flex-start;
    }
    .properties {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5em;
      text-align: center;
      margin: auto;
      width: 90%;
      //height: 80%;
      //color: #ff2d2d;
      font-weight: bold;
  }
    .btnManager {
      width: 100%;
      display: flex;
      justify-content: space-evenly;
      .ButtonExitPopUp {
        //width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 70%;
        font-size: 2em;
        align-self: flex-end;
        padding: 24px;
        border: none;
        border-radius: 7px;
        margin: 0 7px 7px 7px;
        background-color: #06d006;
        color: #ffffff;
        &:hover {
          cursor: pointer;
        }
      }
      .Cancel {
        background-color: #ba0a0a;
      }
    }

  }
}
</style>