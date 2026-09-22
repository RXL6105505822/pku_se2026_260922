<script setup lang="ts">
import { computed, ref } from 'vue'
import TaskCard from './TaskCard.vue'
import type { Task } from '../types/task'

const props = defineProps<{ tasks: Task[] }>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
}>()

/** 筛选按钮，'all' 表示不筛选 */
const STATUS_FILTERS = [
  { value: 'all', label: '全部' },
  { value: 'todo', label: '待办' },
  { value: 'in-progress', label: '进行中' },
  { value: 'done', label: '完成' },
] as const

type FilterValue = (typeof STATUS_FILTERS)[number]['value']

const activeFilter = ref<FilterValue>('all')

const activeFilterLabel = computed(
  () => STATUS_FILTERS.find((item) => item.value === activeFilter.value)?.label ?? '',
)

/** 先筛选，再按创建时间倒序（filter 返回新数组，sort 不会碰 props） */
const visibleTasks = computed(() => {
  const filtered = props.tasks.filter(
    (task) => activeFilter.value === 'all' || task.status === activeFilter.value,
  )
  // 用 Date.parse 比较而非直接比字符串：createdAt 的时区偏移可能不一致
  return filtered.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
})
</script>

<template>
  <div>
    <!-- 状态筛选 -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="filter in STATUS_FILTERS"
        :key="filter.value"
        type="button"
        class="rounded-full px-3 py-1.5 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none"
        :class="
          activeFilter === filter.value
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'bg-white text-slate-600 ring-1 ring-slate-200 ring-inset hover:bg-slate-50 hover:text-slate-900'
        "
        :aria-pressed="activeFilter === filter.value"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- 空状态一：一条任务都没有 -->
    <p
      v-if="tasks.length === 0"
      class="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center text-sm text-slate-500"
    >
      还没有任务，点击下方按钮创建第一个吧
    </p>

    <!-- 空状态二：有任务，但当前筛选没有匹配 -->
    <p
      v-else-if="visibleTasks.length === 0"
      class="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center text-sm text-slate-500"
    >
      没有「{{ activeFilterLabel }}」的任务
    </p>

    <ul v-else class="mt-4 space-y-3">
      <TaskCard
        v-for="task in visibleTasks"
        :key="task.id"
        :task="task"
        @toggle="emit('toggle', task.id)"
        @delete="emit('delete', task.id)"
      />
    </ul>
  </div>
</template>
