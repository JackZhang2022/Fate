<template>
  <div class="app-container">
    <header class="app-header">
      <h1>命运探微</h1>
      <p class="subtitle">铜钱起卦 · 易经解读</p>
    </header>

    <main class="app-main">
      <div class="mode-switch">
        <button
          :class="{ active: mode === 'divine' }"
          @click="mode = 'divine'"
        >起卦</button>
        <button
          :class="{ active: mode === 'browse' }"
          @click="mode = 'browse'"
        >浏览卦象</button>
      </div>

      <template v-if="mode === 'divine'">
        <CoinToss
          :current-toss="currentToss"
          :completed="divinationComplete"
          @tossed="onTossed"
          @reset="reset"
        />

        <div v-if="divinationComplete" class="result-section">
          <HexagramDisplay :hexagrams="displayHexagrams" />

          <div class="interpretation-toggle">
            <button
              :class="{ active: activeTab === 'original' }"
              @click="activeTab = 'original'"
            >本卦解读</button>
            <button
              :class="{ active: activeTab === 'changed' }"
              @click="activeTab = 'changed'"
              :disabled="!hasChangingLines"
            >变卦解读</button>
          </div>

          <HexagramDetail
            v-if="activeTab === 'original'"
            :data="originalHexagramData"
            :line-values="originalLineValues"
            :highlighted-lines="changingLinePositions"
          />
          <HexagramDetail
            v-if="activeTab === 'changed' && hasChangingLines"
            :data="changedHexagramData"
            :line-values="changedLineValues"
            :highlighted-lines="changedLinePositions"
          />
          <div v-if="activeTab === 'changed' && !hasChangingLines" class="no-change-tip">
            本卦无动爻，无变卦。
          </div>
        </div>
      </template>

      <template v-else>
        <div class="browse-layout">
          <div class="browse-list">
            <h3 class="browse-title">六十四卦</h3>
            <div class="hex-grid">
              <button
                v-for="(hex, key) in hexagramData"
                :key="key"
                class="hex-chip"
                :class="{ active: browseKey === key }"
                @click="browseKey = key"
              >
                <span class="chip-name">{{ hex.name }}</span>
                <span class="chip-key">{{ key }}</span>
              </button>
            </div>
          </div>

          <div class="browse-detail" v-if="browseData">
            <HexagramDisplay :hexagrams="browseDisplayHexagrams" />
            <HexagramDetail
              :data="browseData"
              :line-values="browseLineValues"
              :highlighted-lines="[]"
            />
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CoinToss from './components/CoinToss.vue'
import HexagramDisplay from './components/HexagramDisplay.vue'
import HexagramDetail from './components/HexagramDetail.vue'
import { getHexagramKey, getChangingLines, lineValuesToHexagramKey, hexagramKeyToLineValues } from './utils/iching.js'
import hexagramData from './data/hexagrams.json'

const mode = ref('divine')
const currentToss = ref(0)
const divinationComplete = ref(false)
const lineResults = ref([])
const activeTab = ref('changed')

const browseKey = ref('1')

function onTossed(result) {
  lineResults.value = [...lineResults.value, result]
  currentToss.value++
  if (currentToss.value >= 6) {
    divinationComplete.value = true
  }
}

const originalKey = computed(() => {
  if (lineResults.value.length < 6) return ''
  return getHexagramKey(lineResults.value)
})

const changedKey = computed(() => {
  if (lineResults.value.length < 6) return ''
  const { changed } = getChangingLines(lineResults.value)
  return lineValuesToHexagramKey(changed)
})

const originalHexagramData = computed(() => hexagramData[originalKey.value] || null)
const changedHexagramData = computed(() => hexagramData[changedKey.value] || null)

const originalLineValues = computed(() => {
  return lineResults.value.map((l) => l.value)
})

const changedLineValues = computed(() => {
  const { changed } = getChangingLines(lineResults.value)
  return changed
})

const hasChangingLines = computed(() => {
  return lineResults.value.some((l) => l.changing)
})

const changingLinePositions = computed(() => {
  return lineResults.value
    .map((l, i) => (l.changing ? i + 1 : -1))
    .filter((p) => p !== -1)
})

const changedLinePositions = computed(() => {
  return lineResults.value
    .map((l, i) => (l.changing ? i + 1 : -1))
    .filter((p) => p !== -1)
})

const displayHexagrams = computed(() => {
  if (lineResults.value.length < 6) return []
  const originalLines = lineResults.value.map((l) => l.value)
  const { changed } = getChangingLines(lineResults.value)
  const originalChanging = lineResults.value.map((l) => l.changing)

  return [
    {
      name: originalHexagramData.value?.name || '未知',
      lines: [...originalLines].reverse(),
      changingFlags: [...originalChanging].reverse(),
    },
    {
      name: changedHexagramData.value?.name || '未知',
      lines: [...changed].reverse(),
      changingFlags: lineResults.value.map(() => false).reverse(),
    },
  ]
})

const browseData = computed(() => hexagramData[browseKey.value] || null)

const browseLineValues = computed(() => {
  return hexagramKeyToLineValues(browseKey.value)
})

const browseDisplayHexagrams = computed(() => {
  if (!browseData.value) return []
  const lines = browseLineValues.value
  return [
    {
      name: browseData.value.name,
      lines: [...lines].reverse(),
      changingFlags: [false, false, false, false, false, false].reverse(),
    },
  ]
})

function reset() {
  currentToss.value = 0
  divinationComplete.value = false
  lineResults.value = []
  activeTab.value = 'changed'
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
}

.app-header {
  text-align: center;
  padding: 24px 0 8px;
}

.app-header h1 {
  font-size: 32px;
  color: #c8a84e;
  letter-spacing: 8px;
  margin: 0;
}

.subtitle {
  color: #888;
  font-size: 14px;
  margin-top: 6px;
}

.app-main {
  padding-bottom: 40px;
}

.mode-switch {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 8px;
}

.mode-switch button {
  padding: 8px 24px;
  font-size: 15px;
  background: transparent;
  color: #888;
  border: 1px solid rgba(200, 168, 78, 0.3);
  border-radius: 8px;
  letter-spacing: 2px;
}

.mode-switch button.active {
  background: rgba(200, 168, 78, 0.15);
  color: #c8a84e;
  border-color: #c8a84e;
}

.result-section {
  margin-top: 20px;
}

.interpretation-toggle {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 20px 0 10px;
}

.interpretation-toggle button {
  padding: 10px 28px;
  font-size: 16px;
  background: transparent;
  color: #888;
  border: 1px solid rgba(200, 168, 78, 0.3);
  border-radius: 8px;
  letter-spacing: 2px;
}

.interpretation-toggle button.active {
  background: rgba(200, 168, 78, 0.15);
  color: #c8a84e;
  border-color: #c8a84e;
}

.interpretation-toggle button:disabled {
  opacity: 0.3;
}

.no-change-tip {
  text-align: center;
  color: #888;
  padding: 24px;
  font-size: 16px;
}

.browse-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  margin-top: 16px;
}

.browse-list {
  flex: 0 0 320px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(200, 168, 78, 0.2);
  border-radius: 10px;
  padding: 14px;
  max-height: 70vh;
  overflow-y: auto;
}

.browse-title {
  color: #c8a84e;
  font-size: 16px;
  margin: 0 0 12px;
  letter-spacing: 2px;
}

.hex-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px;
}

.hex-chip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  color: #c0b8a8;
  text-align: left;
}

.hex-chip:hover {
  background: rgba(200, 168, 78, 0.08);
  border-color: rgba(200, 168, 78, 0.3);
}

.hex-chip.active {
  background: rgba(200, 168, 78, 0.18);
  border-color: #c8a84e;
  color: #c8a84e;
}

.chip-name {
  font-size: 15px;
  letter-spacing: 1px;
}

.chip-key {
  font-size: 11px;
  color: #666;
  font-family: monospace;
}

.hex-chip.active .chip-key {
  color: #c8a84e;
}

.browse-detail {
  flex: 1;
  min-width: 0;
}

@media (max-width: 860px) {
  .browse-layout {
    flex-direction: column;
  }
  .browse-list {
    flex: none;
    width: 100%;
    max-height: 200px;
  }
}
</style>