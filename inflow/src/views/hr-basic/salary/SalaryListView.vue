<template>
  <FlexItem class="content-body" fld="column" h="calc(100% - 6rem)" w="90%">
    <div class="table-wrapper">
      <TableItem class="salary-list" gtc="repeat(6, 1fr)" br="0.5rem">
        <TableRow>
          <TableCell th fs="1.7rem">지급 연월</TableCell>
          <TableCell th fs="1.7rem">기본급</TableCell>
          <TableCell th fs="1.7rem">비과세</TableCell>
          <TableCell th fs="1.7rem">상여금</TableCell>
          <TableCell th fs="1.7rem">공제 금액</TableCell>
          <TableCell th fs="1.7rem">급여 총액</TableCell>
        </TableRow>
        <TableRow>
          <TableCell class="mid" fs="1.6rem"></TableCell>
        </TableRow>
      </TableItem>
    </div>
  </FlexItem>
</template>

<script setup>
import FlexItem from "@/components/semantic/FlexItem.vue";
import TableItem from "@/components/semantic/TableItem.vue";
import TableRow from "@/components/semantic/TableRow.vue";
import TableCell from "@/components/semantic/TableCell.vue";
</script>

<style scoped>
.content-header {
  position: relative;
  justify-content: center;
  align-items: center;
}

.content-body {
  width: 80%;
  margin-top: 2.5rem;
}

</style>
