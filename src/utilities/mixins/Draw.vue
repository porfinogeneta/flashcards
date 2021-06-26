<template>
  <div class="container">
    <canvas ref="Canvas" id="canvas" width="350" height="350"
      @mousedown="beginDrawing"
      @mouseup="endDrawing"
      @mousemove="draw"
    >
    </canvas>
    <div class="canvasSettings">
      <button class="goBtn" @click="toolActive('pen')" :class="changeBtnDraw"><font-awesome-icon :icon="['fa', 'pencil-alt']"/></button>
      <button class="goBtn" @click="toolActive('eraser')" :class="changeBtnRub"><font-awesome-icon :icon="['fa', 'eraser']"/></button>
      <button class="goBtn" @click="clearBoard"><font-awesome-icon style="color: red" :icon="['fa', 'chalkboard']"/></button>
    </div>
  </div>


</template>

<script>
import {onMounted, reactive, computed, ref, watch} from "vue";
import {useStore} from 'vuex';
import Modal from "@/components/Modal";

export default {
  name: "Draw",
  components: {},
  props: ['isRedraw'],
  setup(props, _) {

    const store = useStore();

    const Canvas = ref('');

    const state = reactive({
      canvas: '',
      isDrawing: false,
      X: '',
      Y: '',
      tool: 'pen',

    })


    watch(() => store.state.UserData.settings.clearCanvas, (newTodo, lastTodo) => {
      if (newTodo) {
        store.commit('ChangeClearCanvasSettings', false)
        clearBoard()
      }
    })


    onMounted(() => {
      let canvas = document.querySelector('#canvas')
      let context = canvas.getContext('2d')
      state.canvas = context
      Canvas.value.addEventListener('touchstart', beginTouchDrawing, false)
      Canvas.value.addEventListener('touchmove', TouchDrawing, false)
      Canvas.value.addEventListener('touchend', endTouchDrawing, false)
    })

    // actual drawing
    function drawLine(X, Y, newX, newY){
      if (state.isDrawing) {
        let ctx = state.canvas
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(X, Y);
        ctx.lineTo(newX, newY);
        ctx.stroke();
        ctx.closePath();
        if (state.tool === 'pen') {
          // ctx.fillStyle = 'black'
          ctx.globalCompositeOperation = 'source-over'
        }else {
          ctx.lineWidth = 14
          ctx.globalCompositeOperation = 'destination-out'
        }
        ctx.lineCap = 'round';
      }

    }

    const clearBoard = () => {
      state.isShowingModal = true
      // var img = new Image();
      store.commit('ChangeCanvasImg', Canvas.value.toDataURL());
      // console.log(img.src)
      // state.CanvasImg = img.src
      state.canvas.clearRect(0, 0, Canvas.value.width, Canvas.value.height)
    }

    function beginTouchDrawing(event) {
      state.isDrawing = true
      let pos = touchPose(event)
      drawLine(pos[0], pos[1])
      state.X = pos[0];
      state.Y = pos[1];
      event.preventDefault();
    }

    function endTouchDrawing(event){
      state.isDrawing = false
    }

    function touchPose(e){
        if (e.touches) {
          if (e.touches.length === 1) { // Only deal with one finger
            let touch = e.touches[0]; // Get the information for finger #1
            let offset = getOffsetSum(touch.target)
            if (props.isRedraw) {
              return [touch.pageX - offset.x + (Canvas.value.width / 2),
                touch.pageY - offset.y]
            }else {
              return [touch.pageX - offset.x,
                touch.pageY - offset.y]
            }

          }
        }
    }

    function getOffsetSum(element) {
      var curleft = 0, curtop = 0;

      if (element.offsetParent) {
          do {
              curleft +=element.offsetLeft;
              curtop  += element.offsetTop;
              element = element.offsetParent;
          } while (element);
      }

      return { x: curleft, y: curtop };
    }


    function TouchDrawing(event) {
      if (state.isDrawing) {
        // let newX = event.touches[0].pageX - event.touches[0].target.offsetLeft;
        // let newY = event.touches[0].pageY - event.touches[0].target.offsetTop;
        let pose = touchPose(event)
        drawLine(state.X, state.Y, pose[0], pose[1]);
        // touchPose(event);
        state.X = pose[0];
        state.Y = pose[1];
        event.preventDefault();
      }
    }


    const changeBtnDraw = computed(() => {
      return {'active': state.tool === 'pen'}
    })
    const changeBtnRub = computed(() => {
      return {'active': state.tool === 'eraser'}
    })

    function beginDrawing(event) {
      state.X = event.offsetX
      state.Y = event.offsetY
      state.isDrawing = true;
    }

    function endDrawing(event) {
      if (state.isDrawing === true) {
        drawLine(state.X, state.Y, event.offsetX, event.offsetY)
        state.X = 0
        state.Y = 0
        state.isDrawing = false;
      }
    }

    function toolActive(tool) {
      state.tool = tool
    }

    const draw = (event) => {
      if (state.isDrawing) {
        drawLine(state.X, state.Y, event.offsetX, event.offsetY)
        state.X = event.offsetX
        state.Y = event.offsetY
      }

    }

    return {
      state,
      draw,
      beginDrawing,
      endDrawing,
      changeBtnDraw,
      changeBtnRub,
      toolActive,
      Canvas,
      clearBoard
    }
  },


}
</script>

<style scoped lang="scss">
.container {
  //display: flex;
  margin-bottom: 2rem;
  //background: #06d006;
  position: relative;
  #canvas {
    //width: 40vh;
    //height: 40vh;
    border: 2px solid grey;
    border-radius: 7px;
  }
  .canvasSettings {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    display: flex;
    align-items: center;
    justify-content: center;

  }
}

.active {
  color: $green-btn;
}

</style>