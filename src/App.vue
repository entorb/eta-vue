<template>
  <v-app>
    <v-main>
      <!-- <HelloWorld /> -->
      <v-container>
        <v-row>
          <v-col>
            <InputTargetValue :target="target" @set-target="setTarget" @add-row="addRow" />
          </v-col>
          <!-- align-content="end" -->
          <v-col> <Actions @plus-1="plus1" /></v-col>
        </v-row>
        <v-row>
          <v-col v-if="data.length >= 1">
            <DataTable :data="data" @delete-all-data="deleteAllData" @delete-row="deleteRow" />
          </v-col>
          <v-col v-if="data.length >= 2">
            <Stats :data="data" :target="target" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
// import Vue from "vue";

// import HelloWorld from "./components/HelloWorld.vue";
import { defineComponent } from 'vue'
import InputTargetValue from './components/InputTargetValue.vue'
import DataTable from './components/DataTable.vue'
import Stats from './components/Stats.vue'
import Actions from './components/Actions.vue'

// type DataRow = {
//   date: Date
//   value: Number
// }

export default defineComponent({
  components: {
    // HelloWorld,
    InputTargetValue,
    DataTable,
    Stats,
    Actions,
  },
  props: {
    testProp: {
      required: false,
      type: String,
      default: 'Text',
      readonly: true,
    },
  },

  data() {
    return {
      target: undefined as number | undefined,
      data: [] as Array<{ date: Date; value: number }>,
    }
  },
  created() {
    // read data from Local Storage
    let stored = localStorage.getItem('target')
    if (stored !== null) {
      this.target = parseFloat(stored)
    }
    stored = localStorage.getItem('data')
    if (stored !== null) {
      const obj = JSON.parse(stored)
      this.data = obj.map((item: { date: string; value: number }) => ({
        date: new Date(item.date), // Assuming item.date is a valid date string
        value: item.value,
      }))
    }
  },
  methods: {
    setTarget(target: number) {
      console.log('new target:', target)
      this.target = target
      this.updateLocalStorageTarget()
    },
    addRow(row: { date: Date; value: number }) {
      // console.log('new row:', row)
      this.data.push(row)
      this.updateLocalStorageData()
    },
    plus1() {
      const date = new Date()
      let value = 0
      if (this.target != 0) {
        if (this.data.length > 0) {
          const lastValue = this.data[this.data.length - 1].value
          value = lastValue + 1
        } else {
          value = 1
        }
      } else {
        // target == 0 -> countdown
        if (this.data.length > 0 && this.data[this.data.length - 1].value >= 1) {
          const lastValue = this.data[this.data.length - 1].value
          value = lastValue - 1
        } else {
          return
        }
      }
      const newRow = { date: date, value: value }
      this.addRow(newRow)
    },
    deleteRow(index: number) {
      if (index >= 0 && index < this.data.length) {
        // Removes one element at the specified index
        this.data.splice(index, 1)
      }
    },
    deleteAllData() {
      this.data = []
      localStorage.removeItem('data')
      this.target = undefined
      localStorage.removeItem('target')
    },
    updateLocalStorageTarget() {
      if (this.target != undefined) {
        localStorage.setItem('target', this.target.toString())
      }
    },
    updateLocalStorageData() {
      localStorage.setItem('data', JSON.stringify(this.data))
    },
  },
  // watch: {
  //   // name: function(value) {
  //   //   //do something
  //   // deep: true,
  //   // }
  // },
  // emits: ["dummy-emit"],
  // setup(props, { emit }) {
  //   const addToCount=(n: number)=>{
  //     this.count += n
  //   }
  // }
  // created() {},
  // computed: {},
  // mounted() {},
})
</script>
