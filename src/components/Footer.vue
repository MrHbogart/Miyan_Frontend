<template>
  <footer class="footer-luxury">
    <div class="max-w-6xl mx-auto px-6 text-sm flex justify-between items-center text-white overflow-visible">
      <div class="footer-copyright font-cinzel">© {{ new Date().getFullYear() }} Miyan Group</div>

      <div class="flex items-center gap-2 overflow-visible">
        <!-- language toggle: will update route to include lang prefix and update global state -->
        <button
          @click.prevent="changeLang('fa')"
          class="lang-toggle"
          :class="{ 'lang-toggle--active': lang === 'fa' }"
        >
          FA
        </button>
        <button
          @click.prevent="changeLang('en')"
          class="lang-toggle"
          :class="{ 'lang-toggle--active': lang === 'en' }"
        >
          EN
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { lang, setLang } from '@/state/lang'

const router = useRouter()
const route = useRoute()

function changeLang(l) {
  // update global state
  setLang(l)
  // compute a new path that includes the lang prefix as the first segment
  const segments = route.fullPath.split('/')
  // drop empty first element (leading slash)
  if (segments[0] === '') segments.shift()
  // remove existing lang if present
  if (segments[0] === 'en' || segments[0] === 'fa') segments.shift()
  // build new path
  const newPath = `/${l}/${segments.join('/')}`.replace(/\/\/$/, '/')
  // replace so navigation doesn't add history entries repeatedly
  router.replace(newPath)
}
</script>

<style scoped>
.footer-luxury {
  width: 100%;
  margin-top: 3rem;
  padding: 2rem 0;
  background: #000;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  overflow: visible;
}

.footer-copyright {
  color: rgba(255, 255, 255, 0.85);
  transition: color 400ms cubic-bezier(0.4, 0.0, 0.2, 1);
  letter-spacing: 0.02em;
}

.lang-toggle {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: visible;
  position: relative;
}

.lang-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.lang-toggle--active {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  font-weight: 600;
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.lang-toggle--active::after {
  content: '';
  position: absolute;
  bottom: 0.25rem;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 2px;
}

.lang-toggle:active {
  transform: translateY(0);
  transition: transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
}
</style>
