<template>
  <div class="nav-placeholder" :class="surfaceClass">
    <div ref="navbarSentinel" :style="sentinelStyle"></div>
    <section
      ref="navbarRef"
      class="py-2 transition-all"
      :style="navInlineStyle"
      dir="ltr"
    >
      <div class="max-w-4xl mx-auto px-6">
        <div class="flex flex-wrap justify-center gap-3 md:gap-4">
          <router-link
            v-for="item in items"
            :key="item.name"
            :to="{ path: buildPath(item.path) }"
            class="nav-link px-5 md:px-6 py-3 rounded-[0.0625rem] transition-transform duration-200 transform-gpu hover:scale-105 uppercase font-semibold"
            :class="[
              { 'font-bold': activeRoute === item.name },
              isRtl ? 'font-b-titr' : 'font-cinzel font-light',
              activeRoute === item.name ? 'nav-link--active' : 'nav-link--idle'
            ]"
          >
            {{ isRtl ? item.label.fa : item.label.en }}
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNavbarAttachment } from '@/composables/useNavbarAttachment'

const props = defineProps({
  items: { type: Array, required: true },
  buildPath: { type: Function, required: true },
  isRtl: { type: Boolean, default: true },
  activeRoute: { type: String, default: '' },
  surfaceClass: { type: String, default: 'brand-surface' }
})

const navbarRef = ref(null)
const navbarSentinel = ref(null)
const { navInlineStyle, sentinelStyle } = useNavbarAttachment(navbarRef, navbarSentinel)

const buildPath = (path) => {
  if (typeof props.buildPath === 'function') {
    return props.buildPath(path)
  }
  return path || '/'
}

</script>

<style scoped>
.nav-placeholder {
  position: relative;
}

.nav-placeholder section {
  width: 100%;
}
</style>
