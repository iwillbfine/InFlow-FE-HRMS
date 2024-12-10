<template>
  <WidgetItem label="나의 부서 사원" h="42rem" w="100%">
    <GridItem
      class="widget-content"
      h="calc(42rem - 4rem)"
      w="100%"
      gtc="repeat(2, 1fr)"
    >
      <div v-for="(item, index) in memberList" :key="index">
        <FlexItem
          class="team-member-item"
          fld="row"
          w="100%"
          h="15rem"
          minh="15rem"
          minw="20rem"
          bgc="#fff"
          br="0.6rem"
        >
          <FigureItem class="profile-img-wrapper" h="12rem" w="9rem">
            <img :src="item.profile_image_url" alt="Profile Image" />
          </FigureItem>
          <FlexItem class="team-member-info" fld="column" h="100%">
            <span class="emphasize">{{ item.employee_name }}</span>
            <span class="normal">{{ item.role_name }}</span>
            <span class="sub">{{ item.email }}</span>
            <span class="sub">{{ item.phone_number }}</span>
          </FlexItem>
        </FlexItem>
      </div>
    </GridItem>
    <FlexItem
      v-if="isEmpty"
      class="empty-message"
      fld="row"
      h="6rem"
      w="100%"
      fs="1.6rem"
    >
      나의 부서 사원이 존재하지 않습니다.
    </FlexItem>
  </WidgetItem>
</template>

<script setup>
import WidgetItem from '@/components/widgets/WidgetItem.vue';
import GridItem from '@/components/semantic/GridItem.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import FigureItem from '@/components/semantic/FigureItem.vue';
import { ref, onMounted } from 'vue';
import { getEmployeesByDepartmentCode } from '@/api/department';

const memberList = ref([]);
const isEmpty = ref(false);

const props = defineProps({
  dcode: {
    type: String,
    required: true,
  },
});

const fetchMemberData = async (dcode) => {
  try {
    const response = await getEmployeesByDepartmentCode(dcode);
    if (response.success) {
      memberList.value = response.content;
      isEmpty.value = memberList.value.length === 0;
    } else {
      memberList.value = [];
      isEmpty.value = true;
    }
  } catch (error) {
    console.error('나의 부서 사원 데이터를 가져오는데 실패했습니다.', error);
  }
};

onMounted(() => {
  if (props.dcode) {
    fetchMemberData(props.dcode);
  }
});
</script>

<style scoped>
.emphasize {
  color: #003566;
  font-size: 2rem;
  font-weight: 500;
}

.normal {
  color: #003566;
  font-size: 1.6rem;
  font-weight: 400;
}

.sub {
  color: #4e4e4e;
  font-size: 1.2rem;
  font-weight: 400;
}

.widget-content {
  gap: 2rem;
  padding: 2rem;
  overflow: auto;
}

.team-member-item {
  align-items: center;
  padding: 1rem;
  gap: 2rem;
  box-shadow: 0rem 0rem 0.6rem 0rem rgba(0, 0, 0, 0.2);
}

.team-member-info {
  justify-content: center;
  gap: 0.5rem;
}

.profile-img-wrapper img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.empty-message {
  justify-content: center;
  align-items: center;
}
</style>
