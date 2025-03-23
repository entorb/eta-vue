/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

import 'vuetify/styles'

import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

// TM: do not import all icons, this makes build size too large
// import '@mdi/font/css/materialdesignicons.css'
// my icons
import {
  mdiBullseyeArrow,
  mdiCheckCircle,
  mdiCounter,
  mdiNumericPositive1,
  mdiRepeatVariant,
  mdiTrashCan
} from '@mdi/js'
// mdiContentSave
// mdiPlus
// mdiArrowUp, mdiArrowDown, mdiArrowUpDown

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#1867C0',
          secondary: '#5CBBF6'
        }
      }
    }
  },
  icons: {
    sets: {
      mdi
    },
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      // arrowDown: mdiArrowDown,
      // arrowUp: mdiArrowUp,
      // arrowUpDown: mdiArrowUpDown,
      items: mdiCounter,
      plus1: mdiNumericPositive1,
      repeat: mdiRepeatVariant,
      save: mdiCheckCircle,
      target: mdiBullseyeArrow,
      trashCan: mdiTrashCan
    }
  }
})
