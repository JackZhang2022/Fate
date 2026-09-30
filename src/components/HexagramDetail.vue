<template>
  <div class="hexagram-detail" v-if="data">
    <div class="detail-header">
      <h2>{{ data.name }}</h2>
    </div>

    <div class="section">
      <h3>卦辞</h3>
      <p class="original">{{ data.judgment }}</p>
      <h4>译文</h4>
      <p class="translation">{{ data.judgment_translation }}</p>
      <h4>义理</h4>
      <p class="meaning">{{ data.judgment_meaning }}</p>
    </div>

    <div class="section">
      <h3>爻辞</h3>
      <div
        v-for="line in data.lines"
        :key="line.position"
        class="line-item"
        :class="{ highlighted: highlightedLines.includes(line.position) }"
      >
        <div class="line-header">
          <span class="line-pos">{{ lineName(line.position - 1) }}</span>
          <span v-if="highlightedLines.includes(line.position)" class="changing-badge">动爻</span>
        </div>
        <p class="original">{{ line.text }}</p>
        <h4>译文</h4>
        <p class="translation">{{ line.translation }}</p>
        <h4>义理</h4>
        <p class="meaning">{{ line.meaning }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
  lineValues: {
    type: Array,
    default: () => [],
  },
  highlightedLines: {
    type: Array,
    default: () => [],
  },
})

const positions = ['初', '二', '三', '四', '五', '上']

function lineName(index) {
  if (index === 6) {
    return props.lineValues.length === 0 ? '用' : (props.lineValues[0] === 1 ? '用九' : '用六')
  }
  const pos = positions[index]
  const isYang = props.lineValues[index] === 1
  const type = isYang ? '九' : '六'
  if (index === 0 || index === 5) return pos + type
  return type + pos
}
</script>

<style scoped>
.hexagram-detail {
  padding: 16px 0;
}

.detail-header h2 {
  color: #c8a84e;
  font-size: 28px;
  text-align: center;
  letter-spacing: 6px;
  margin-bottom: 20px;
}

.section {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(200, 168, 78, 0.15);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
}

.section h3 {
  color: #c8a84e;
  font-size: 18px;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(200, 168, 78, 0.2);
  padding-bottom: 6px;
}

.section h4 {
  color: #a09070;
  font-size: 14px;
  margin: 10px 0 4px;
}

.original {
  color: #e0d5c1;
  font-size: 16px;
  line-height: 1.8;
  letter-spacing: 1px;
}

.translation {
  color: #c0b8a8;
  font-size: 15px;
  line-height: 1.8;
}

.meaning {
  color: #a09888;
  font-size: 14px;
  line-height: 1.7;
}

.line-item {
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.line-item:last-child {
  border-bottom: none;
}

.line-item.highlighted {
  background: rgba(200, 168, 78, 0.08);
  border-radius: 6px;
  padding: 10px;
  margin: 4px 0;
}

.line-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.line-pos {
  color: #a09070;
  font-size: 14px;
  font-weight: bold;
}

.changing-badge {
  background: #c8a84e;
  color: #1a1a2e;
  font-size: 11px;
  padding: 1px 8px;
  border-radius: 10px;
  font-weight: bold;
}
</style>