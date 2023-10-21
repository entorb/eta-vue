<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <InputTargetValue :target="target" @set-target="setTarget" @add-row="addRow" />
          </v-col>
          <!-- align-content="end" -->
          <v-col cols="4"> <ActionsBlock @plus-1="plus1" /></v-col>
        </v-row>
        <v-row>
          <v-col v-if="data.length >= 1">
            <DataTable :data="data" @delete-all-data="deleteAllData" @delete-row="deleteRow" />
          </v-col>
          <v-col cols="4" v-if="data.length >= 2">
            <StatsBlock :data="data" :target="target" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
// import Vue from "vue";

import { defineComponent } from 'vue'
import InputTargetValue from './components/InputTargetValue.vue'
import DataTable from './components/DataTable.vue'
import StatsBlock from './components/StatsBlock.vue'
import ActionsBlock from './components/ActionsBlock.vue'

export default defineComponent({
  components: {
    InputTargetValue,
    DataTable,
    StatsBlock,
    ActionsBlock
  },
  data() {
    return {
      // target:
      // undefined -> simple mode, no ETA
      // > 0 -> count-up mode
      // = 0 -> count-down mode
      target: undefined as number | undefined,
      data: [] as Array<{ date: Date; value: number }>,
      settings: {
        // TODO
        showDays: false,
        unit: 'sec'
      }
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
        date: new Date(item.date),
        value: item.value
      }))
    }
  },
  methods: {
    setTarget(target: number) {
      if (target < 0) {
        console.log('invalid negative target:', target)
        return
      }
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
      let value = 0
      let lastValue = 0
      const hasData = this.data.length > 0
      if (this.data.length > 0) {
        lastValue = this.data[this.data.length - 1].value
      }

      if (this.target == 0) {
        // target == 0 -> count-down mode
        if (hasData && lastValue >= 1) {
          value = lastValue - 1
        } else {
          return
        }
      } else {
        // count-up mode or simple mode
        value = lastValue + 1
      }
      const date = new Date()
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
    }
  }
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
