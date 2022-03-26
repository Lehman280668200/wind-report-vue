<template>
  <!-- page -->
  <a-pagination
    v-model:current="current1"
    show-quick-jumper
    :total="500"
    @change="onChange"
  />
</template>
