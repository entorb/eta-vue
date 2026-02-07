<script setup lang="ts">
import { onMounted, defineAsyncComponent } from 'vue'

import { useEtaData } from '../composables/useEtaData'
import { helperRunningOnProd, helperStatsDataWrite } from '../helper'

import DataTable from './DataTable.vue'
import InputItems from './InputItems.vue'
import InputTarget from './InputTarget.vue'
import StatsTable from './StatsTable.vue'

const EtaChart = defineAsyncComponent(() => import('@/components/EtaChart.vue'))

const {
  target,
  data,
  settings,
  itemsPerSec,
  current,
  hasData,
  hasMultipleRows,
  loadFromStorage,
  setTarget,
  addRow,
  updateRow,
  deleteRow,
  deleteAll,
  incrementByOne,
  updateItemsPerSec
} = useEtaData()

onMounted(() => {
  loadFromStorage()
})

function handleAddRow(row: { date: Date; items: number }) {
  addRow(row)

  if (helperRunningOnProd() && data.value.length === 3) {
    helperStatsDataWrite('eta')
  }
}
</script>

<template>
  <v-container>
    <v-row v-if="!hasMultipleRows">
      <v-col
        cols="12"
        md="12"
      >
        1. set <v-icon icon="$target" /> (target can be 0)<br />
        2. periodically update <v-icon icon="$items" /> (current value) when it has changed
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="5"
        md="3"
      >
        <InputTarget
          :target="target"
          @set-target="setTarget"
        />
      </v-col>
      <v-col
        cols="6"
        md="3"
      >
        <InputItems
          :target="target"
          :current-items="current"
          @add-row="handleAddRow"
        />
      </v-col>
    </v-row>

    <v-row v-if="hasData">
      <v-col
        cols="4"
        md="2"
        offset="2"
        offset-md="0"
      >
        <v-btn
          id="btn-del-all"
          icon="$trash"
          color="red"
          aria-label="Delete all data"
          @click="deleteAll"
        />
      </v-col>
      <v-col
        cols="4"
        md="2"
        offset="1"
        offset-md="3"
      >
        <v-btn
          id="btn-plus-1"
          icon="$plus1"
          color="blue-lighten-2"
          aria-label="Add one"
          @click="incrementByOne"
        />
      </v-col>
    </v-row>

    <v-row v-if="hasData">
      <v-col
        v-if="hasMultipleRows"
        cols="12"
        md="3"
      >
        <StatsTable
          :data="data"
          :settings="settings"
          :target="target"
          @items-per-sec="updateItemsPerSec"
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <DataTable
          :data="data"
          :settings="settings"
          @delete-row="deleteRow"
          @update-row="updateRow"
        />
      </v-col>
      <v-col
        v-if="hasMultipleRows"
        cols="12"
        md="5"
      >
        <EtaChart
          :data="data"
          :settings="settings"
          :target="target"
          :ips="itemsPerSec"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
