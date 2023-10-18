<template>
  <v-app>
    <v-main>
      <!-- <HelloWorld /> -->
      <InputTargetValue :target="target" @set-target="setTarget" @add-row="addRow" />
      <DataTable :data="data" />
    </v-main>
  </v-app>
</template>

<script lang="ts">
// import Vue from "vue";

import { defineComponent } from 'vue'
import InputTargetValue from './components/InputTargetValue.vue'
import DataTable from './components/DataTable.vue'
// import HelloWorld from "./components/HelloWorld.vue";

// type DataRow = {
//   date: Date
//   value: Number
// }

export default defineComponent({
  components: {
    InputTargetValue,
    DataTable,
    // HelloWorld,
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
      target: 0.0,
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
      console.log('new row:', row)
      this.data.push(row)
      console.log(this.data)
      this.updateLocalStorageData()
    },
    deleteAllData() {
      this.data = []
      localStorage.removeItem('data')
    },
    updateLocalStorageTarget() {
      localStorage.setItem('target', this.target.toString())
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
