<template>
  <div class="coin-toss">
    <div class="coins-area">
      <div
        v-for="(coin, i) in displayCoins"
        :key="i"
        class="coin"
        :class="{ heads: coin === 1, tails: coin === 0 }"
      >
        <div class="coin-inner">
          <div class="coin-face front">正</div>
          <div class="coin-face back">反</div>
        </div>
      </div>
    </div>
    <button class="toss-btn" :disabled="completed" @click="handleToss">
      {{ completed ? '起卦完成' : '摇第' + tossLabels[currentToss] + '爻' }}
    </button>
    <div v-if="completed" class="reset-row">
      <button class="reset-btn" @click="$emit('reset')">重新起卦</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { tossCoins } from '../utils/iching.js'

const props = defineProps({
  currentToss: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
})

const emit = defineEmits(['tossed', 'reset'])

const tossLabels = ['一', '二', '三', '四', '五', '六']

const displayCoins = ref([1, 1, 1])

watch(() => props.currentToss, (val) => {
  if (val === 0) {
    displayCoins.value = [1, 1, 1]
  }
})

function handleToss() {
  if (props.completed) return

  const result = tossCoins()
  displayCoins.value = result.coins
  emit('tossed', result)
}
</script>

<style scoped>
.coin-toss {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
}

.coins-area {
  display: flex;
  gap: 28px;
  padding: 24px 0;
}

.coin {
  width: 72px;
  height: 72px;
  perspective: 400px;
}

.coin-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.coin.heads .coin-inner {
  transform: rotateY(0deg);
}

.coin.tails .coin-inner {
  transform: rotateY(180deg);
}

.coin-face {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.25) inset;
}

.front {
  background: linear-gradient(145deg, #f7e09c, #d4a840);
  color: #5a3e10;
  border: 2.5px solid #c49830;
}

.back {
  background: linear-gradient(145deg, #c49830, #8a6a20);
  color: #3e2808;
  border: 2.5px solid #6b4e18;
  transform: rotateY(180deg) translateZ(1px);
}

.toss-btn {
  padding: 12px 40px;
  font-size: 20px;
  background: linear-gradient(135deg, #c8a84e, #a07828);
  color: #1a1a2e;
  border-radius: 8px;
  font-weight: bold;
  letter-spacing: 2px;
  min-width: 180px;
}

.toss-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #e0c878, #c8a84e);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(200, 168, 78, 0.4);
}

.reset-row {
  margin-top: 8px;
}

.reset-btn {
  padding: 8px 24px;
  font-size: 16px;
  background: transparent;
  color: #c8a84e;
  border: 1px solid #c8a84e;
  border-radius: 6px;
}

.reset-btn:hover {
  background: rgba(200, 168, 78, 0.1);
}
</style>