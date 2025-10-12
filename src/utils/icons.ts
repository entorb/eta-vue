/**
 * Custom Material Design Icons
 * Only includes the icons actually used in the application
 */

// TM: do not import all icons, this makes build size too large
// import '@mdi/font/css/materialdesignicons.css'
// https://vuetifyjs.com/en/features/icon-fonts/#mdi-icon-search
// my icons
import {
  mdiBikeFast,
  mdiBullseyeArrow,
  mdiCheckCircle,
  mdiClockCheckOutline,
  mdiCounter,
  mdiNumericPositive1,
  mdiPencil,
  mdiPlay,
  mdiRepeatVariant,
  mdiTimerMarkerOutline,
  mdiTimerOutline,
  mdiTrashCan
} from '@mdi/js'
// mdiContentSave
// mdiPlus
// mdiArrowUp, mdiArrowDown, mdiArrowUpDown

export const customIcons = {
  // arrowDown: mdiArrowDown,
  // arrowUp: mdiArrowUp,
  // arrowUpDown: mdiArrowUpDown,
  edit: mdiPencil,
  eta: mdiClockCheckOutline,
  items: mdiCounter,
  plus1: mdiNumericPositive1,
  repeat: mdiRepeatVariant,
  save: mdiCheckCircle,
  speed: mdiBikeFast,
  target: mdiBullseyeArrow,
  timeLastInput: mdiTimerMarkerOutline,
  timeRunning: mdiTimerOutline,
  timeStart: mdiPlay,
  trash: mdiTrashCan
}
