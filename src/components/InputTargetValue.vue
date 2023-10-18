<template>
  <v-container class="align-start">
    <v-row>
      <v-col cols="6" md="3">
        <v-text-field
          v-model="inputTarget"
          label="Target"
          :append-icon="'mdi-send'"
          variant="outlined"
          type="text"
          @click:append="enterTarget"
          @keyup.enter="enterTarget"
        />
      </v-col>
      <v-col cols="6" md="3">
        <v-text-field
          v-model="inputValue"
          label="Value"
          :append-icon="'mdi-send'"
          variant="outlined"
          type="text"
          @click:append="enterValue"
          @keyup.enter="enterValue"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  emits: ["set-target", "add-row"],
  //   components: {},
  //   props: {},
  data() {
    return {
      inputTarget: "",
      inputValue: "",
    };
  },
  methods: {
    enterTarget() {
      const target = parseFloat(this.inputTarget);
      if (isNaN(target)) {
        this.inputTarget = "";
        return;
      }
      this.$emit("set-target", target);
    },
    enterValue() {
      const value = parseFloat(this.inputValue);
      if (isNaN(value)) {
        return;
      }

      const date = new Date();
      const newRow = { value: value, date };
      // Emit an event to update the data table
      this.$emit("add-row", newRow);
      this.inputValue = "";
    },
  },
});
</script>
