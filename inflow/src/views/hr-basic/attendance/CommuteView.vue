<template>
  <FlexItem class="content-header">
    <YearMonthDropDown @valid-date-selected="selectedDate"></YearMonthDropDown>
  </FlexItem>
</template>

<script setup>
import FlexItem from '@/components/semantic/FlexItem.vue';
import YearMonthDropDown from '@/components/dropdowns/YearMonthDropDown.vue';

const selectedDate = (date) => {
  console.log(date);
}
</script>
