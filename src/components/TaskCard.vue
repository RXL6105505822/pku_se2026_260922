<script setup lang="ts">
import { computed } from 'vue'
import type { Task, TaskPriority } from '../types/task'

const props = defineProps<{ task: Task }>()

const emit = defineEmits<{
  toggle: []
  delete: []
}>()

const isDone = computed(() => props.task.status === 'done')

/** 优先级配色：左边框颜色 + 标签样式 */
const priorityMeta: Record<TaskPriority, { label: string; border: string; badge: string }> = {
  high: {
    label: '高',
    border: 'border-l-red-500',
    badge: 'bg-red-50 text-red-700 ring-red-200',
  },
  medium: {
    label: '中',
    border: 'border-l-amber-400',
    badge: 'bg-amber-50 text-amber-700 ring-amber-200',
  },
  low: {
    label: '低',
    border: 'border-l-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  },
}

/** 把 '2026-09-30' 格式化为 '9月30日'（按字符串取值，避免时区偏移） */
function formatDueDate(isoDate: string) {
  const [, month, day] = isoDate.slice(0, 10).split('-')
  return `${Number(month)}月${Number(day)}日`
}
</script>

<template>
  <div
    class="group flex items-start gap-3 rounded-xl border border-l-4 border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:scale-[1.02] hover:shadow-md"
    :class="priorityMeta[task.priority].border"
  >
    <!-- 完成复选框 -->
    <label class="mt-0.5 flex shrink-0 cursor-pointer items-center">
      <input
        type="checkbox"
        class="peer sr-only"
        :checked="isDone"
        :aria-label="`标记「${task.title}」为${isDone ? '未完成' : '已完成'}`"
        @change="emit('toggle')"
      />
      <span
        aria-hidden="true"
        class="flex size-5 items-center justify-center rounded-md border-2 border-slate-300 text-white transition peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2"
      >
        <svg
          v-if="isDone"
          class="size-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m5 13 4 4L19 7" />
        </svg>
      </span>
    </label>

    <div class="min-w-0 flex-1">
      <div class="flex items-start justify-between gap-3">
        <h3
          class="font-medium"
          :class="isDone ? 'text-slate-400 line-through' : 'text-slate-900'"
        >
          {{ task.title }}
        </h3>

        <div class="flex shrink-0 items-center gap-1">
          <span
            class="rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset"
            :class="priorityMeta[task.priority].badge"
          >
            {{ priorityMeta[task.priority].label }}优先级
          </span>

          <!-- 删除按钮：常驻可见但低对比度，悬停变红 -->
          <button
            type="button"
            class="-mr-1 rounded-md p-1 text-slate-300 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
            :aria-label="`删除任务「${task.title}」`"
            @click="emit('delete')"
          >
            <svg
              class="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <p class="mt-1.5 line-clamp-2 text-sm text-slate-500">{{ task.description }}</p>

      <p class="mt-3 text-xs text-slate-500">截止 {{ formatDueDate(task.dueDate) }}</p>
    </div>
  </div>
</template>
