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
import { mdiTrashCan } from '@mdi/js'
import { mdiNumericPositive1 } from '@mdi/js'
// import { mdiContentSave } from '@mdi/js'
// import { mdiPlus } from '@mdi/js'
import { mdiCheckCircle } from '@mdi/js'
import { mdiRepeatVariant } from '@mdi/js'
// import { mdiArrowUp, mdiArrowDown, mdiArrowUpDown } from '@mdi/js'

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
      trashCan: mdiTrashCan,
      save: mdiCheckCircle,
      // arrowUp: mdiArrowUp,
      // arrowDown: mdiArrowDown,
      // arrowUpDown: mdiArrowUpDown,
      repeat: mdiRepeatVariant,
      plus1: mdiNumericPositive1
    }
  }
})
