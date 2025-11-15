import { ref } from 'vue'

// default language is Persian ('fa')
export const lang = ref('fa')
export function setLang(l) {
  lang.value = l
}
export default { lang, setLang }