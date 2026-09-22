<script setup lang="ts">
import { computed, ref } from 'vue'
import TaskCard from './TaskCard.vue'
import type { Task, TaskStatus } from '../types/task'

const props = defineProps<{ tasks: Task[] }>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
  statusChange: [id: string, status: TaskStatus]
}>()

const COLUMNS = [
  { value: 'todo', label: '待办' },
  { value: 'in-progress', label: '进行中' },
  { value: 'done', label: '已完成' },
] as const

const draggingId = ref<string | null>(null)
const hoveredStatus = ref<TaskStatus | null>(null)

/** 按状态分列；列内同样按创建时间倒序，和列表视图保持一致 */
const grouped = computed(() => {
  const result = { todo: [], 'in-progress': [], done: [] } as Record<TaskStatus, Task[]>
  for (const task of props.tasks) result[task.status].push(task)
  for (const tasks of Object.values(result)) {
    // 这些是按状态新建的数组，sort 不会碰到 props.tasks
    tasks.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
  }
  return result
})

function onDragStart(task: Task, event: DragEvent) {
  draggingId.value = task.id
  // 存进 dataTransfer：drop 时才能取回（dragover 阶段出于安全只允许读 types）
  event.dataTransfer?.setData('text/plain', task.id)
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}

function onDragOver(status: TaskStatus, event: DragEvent) {
  // 只接受本组件发起的拖拽，外部拖进来的文本/文件不接
  if (!draggingId.value) return
  event.preventDefault() // 不调用这句，浏览器根本不会触发 drop
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
  hoveredStatus.value = status
}

function onDragLeave(status: TaskStatus, event: DragEvent) {
  // 在列内子元素之间移动时也会触发 dragleave，此时 relatedTarget 仍在列内
  const column = event.currentTarget as HTMLElement | null
  const movingTo = event.relatedTarget as Node | null
  if (column && movingTo && column.contains(movingTo)) return
  if (hoveredStatus.value === status) hoveredStatus.value = null
}

function onDragEnd() {
  draggingId.value = null
  hoveredStatus.value = null
}

function onDrop(status: TaskStatus, event: DragEvent) {
  event.preventDefault()
  const id = event.dataTransfer?.getData('text/plain') || draggingId.value || ''
  onDragEnd()

  const source = props.tasks.find((task) => task.id === id)
  // 拖回原列不算改动，别白写一次存储
  if (!source || source.status === status) return
  emit('statusChange', id, status)
}
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
    <section
      v-for="column in COLUMNS"
      :key="column.value"
      class="flex flex-col rounded-xl border p-3 transition"
      :class="
        hoveredStatus === column.value
          ? 'border-indigo-400 bg-indigo-50 ring-2 ring-indigo-200'
          : 'border-slate-200 bg-slate-100/70'
      "
      @dragover="onDragOver(column.value, $event)"
      @dragleave="onDragLeave(column.value, $event)"
      @drop="onDrop(column.value, $event)"
    >
      <h3
        class="mb-3 flex items-center justify-between px-1 text-sm font-semibold text-slate-700"
      >
        {{ column.label }}
        <span
          class="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200 ring-inset"
        >
          {{ grouped[column.value].length }}
        </span>
      </h3>

      <!-- 列体保持最小高度，空列也要能接住拖拽 -->
      <div class="min-h-[120px] flex-1">
        <ul v-if="grouped[column.value].length" class="space-y-3">
          <li
            v-for="task in grouped[column.value]"
            :key="task.id"
            draggable="true"
            class="cursor-grab active:cursor-grabbing"
            :class="draggingId === task.id ? 'opacity-40' : ''"
            @dragstart="onDragStart(task, $event)"
            @dragend="onDragEnd"
          >
            <TaskCard
              :task="task"
              @toggle="emit('toggle', task.id)"
              @delete="emit('delete', task.id)"
              @status-change="(status) => emit('statusChange', task.id, status)"
            />
          </li>
        </ul>

        <p
          v-else
          class="rounded-lg border border-dashed border-slate-300 px-3 py-8 text-center text-xs text-slate-400"
        >
          拖到此处
        </p>
      </div>
    </section>
  </div>
</template>
