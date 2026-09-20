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
  mdiInformationOutline,
  mdiNumericPositive1,
  mdiPencil,
  mdiPlay,
  mdiTimerMarkerOutline,
  mdiTimerOutline,
  mdiTrashCan,
  mdiWeight,
} from "@mdi/js"
// mdiContentSave
// mdiPlus
// mdiArrowUp, mdiArrowDown, mdiArrowUpDown

export const customIcons = {
  // arrowDown: mdiArrowDown,
  // arrowUp: mdiArrowUp,
  // arrowUpDown: mdiArrowUpDown,
  edit: mdiPencil,
  eta: mdiClockCheckOutline,
  info: mdiInformationOutline,
  items: mdiCounter,
  plus1: mdiNumericPositive1,
  save: mdiCheckCircle,
  speed: mdiBikeFast,
  target: mdiBullseyeArrow,
  timeLastInput: mdiTimerMarkerOutline,
  timeRunning: mdiTimerOutline,
  timeStart: mdiPlay,
  trash: mdiTrashCan,
  weight: mdiWeight,
}
