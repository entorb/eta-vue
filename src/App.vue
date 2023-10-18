<template>
  <v-app>
    <v-main>
      <!-- <HelloWorld /> -->
      <InputTargetValue @set-target="setTarget" @add-row="addRow" />
    </v-main>
  </v-app>
</template>

<script lang="ts">
// import Vue from "vue";

import { defineComponent } from "vue";
import InputTargetValue from "./components/InputTargetValue.vue";
// import HelloWorld from "./components/HelloWorld.vue";

export default defineComponent({
  components: {
    InputTargetValue,
    // HelloWorld,
  },
  props: {
    testProp: {
      required: false,
      type: String,
      default: "Text",
      readonly: true,
    },
  },

  data() {
    return {
      target: 0.0,
    };
  },
  watch: {
    // name: function(value) {
    //   //do something
    // deep: true,
    // }
  },
  methods: {
    setTarget(target: number) {
      console.log("new target:", target);
    },
    addRow(row: {}) {
      console.log("new row:", row);
    },
  },
  // emits: ["dummy-emit"],
  // setup(props, { emit }) {
  //   const addToCount=(n: number)=>{
  //     this.count += n
  //   }
  // }
  // created() {},
  // computed: {},
  // mounted() {},
});
</script>
