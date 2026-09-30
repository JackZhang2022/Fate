<template>
  <div class="hexagram-display">
    <div class="hexagram-card" v-for="(hex, idx) in hexagrams" :key="idx">
      <h3 class="hex-name">{{ hex.name }}</h3>
      <div class="hex-lines">
        <div
          v-for="(line, li) in hex.lines"
          :key="li"
          class="hex-line-row"
          :class="{ changing: hex.changingFlags[li] }"
        >
          <span class="line-label">{{ lineName(li, line) }}</span>
          <div class="line-graphic">
            <template v-if="line === 1">
              <div class="yang-line"></div>
            </template>
            <template v-else>
              <div class="yin-line">
                <div class="yin-segment"></div>
                <div class="yin-segment"></div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  hexagrams: {
    type: Array,
    required: true,
  },
})

const positions = ['上', '五', '四', '三', '二', '初']

function lineName(index, line) {
  const pos = positions[index]
  const type = line === 1 ? '九' : '六'
  if (index === 0 || index === 5) return pos + type
  return type + pos
}
</script>

<style scoped>
.hexagram-display {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.hexagram-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(200, 168, 78, 0.3);
  border-radius: 12px;
  padding: 16px 24px;
  min-width: 200px;
}

.hex-name {
  color: #c8a84e;
  font-size: 22px;
  margin-bottom: 14px;
  letter-spacing: 4px;
  text-align: center;
}

.hex-lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hex-line-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.line-label {
  font-size: 14px;
  color: #888;
  width: 36px;
  text-align: right;
  flex-shrink: 0;
}

.hex-line-row.changing .line-label {
  color: #e8a840;
  font-weight: bold;
}

.line-graphic {
  width: 100px;
  height: 12px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.yang-line {
  width: 100%;
  height: 100%;
  background: #e0d5c1;
  border-radius: 1px;
}

.yin-line {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}

.yin-segment {
  width: 42%;
  height: 100%;
  background: #e0d5c1;
  border-radius: 1px;
}
</style>