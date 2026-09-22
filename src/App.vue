<script setup lang="ts">
import { ref } from 'vue'
import KanbanBoard from './components/KanbanBoard.vue'
import TaskList from './components/TaskList.vue'
import TaskModal from './components/TaskModal.vue'
import { addTask, deleteTask, state, toggleTask, updateTask } from './stores/taskStore'
import type { TaskStatus } from './types/task'

const VIEWS = [
  { value: 'list', label: '列表' },
  { value: 'kanban', label: '看板' },
] as const

type ViewMode = (typeof VIEWS)[number]['value']

/** 视图与弹窗都是纯 UI 状态，不进 store */
const view = ref<ViewMode>('list')
const showModal = ref(false)

const setStatus = (id: string, status: TaskStatus) => updateTask(id, { status })
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <!-- 顶部导航栏 -->
    <header class="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div class="mx-auto flex h-16 max-w-3xl items-center gap-3 px-4 sm:px-6">
        <div
          class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm"
        >
          <svg
            class="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m5 13 4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-base font-semibold tracking-tight">Vibe Coding Runoob</h1>
        <span
          class="ml-auto rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200 ring-inset"
        >
          {{ state.tasks.length }} 个任务
        </span>
      </div>
    </header>

    <!-- 看板需要横向空间，列表不需要，所以容器宽度随视图切换 -->
    <main
      class="mx-auto px-4 py-8 sm:px-6"
      :class="view === 'kanban' ? 'max-w-6xl' : 'max-w-3xl'"
    >
      <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 class="text-lg font-semibold tracking-tight">
            {{ view === 'list' ? '任务列表' : '看板视图' }}
          </h2>
          <p class="mt-1 text-sm text-slate-500">数据已保存到浏览器本地，刷新不会丢失。</p>
        </div>

        <div class="flex gap-1 rounded-lg bg-slate-100 p-1">
          <button
            v-for="option in VIEWS"
            :key="option.value"
            type="button"
            class="rounded-md px-3 py-1.5 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            :class="
              view === option.value
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            "
            :aria-pressed="view === option.value"
            @click="view = option.value"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <TaskList
        v-if="view === 'list'"
        :tasks="state.tasks"
        @toggle="toggleTask"
        @delete="deleteTask"
        @status-change="setStatus"
      />
      <KanbanBoard
        v-else
        :tasks="state.tasks"
        @toggle="toggleTask"
        @delete="deleteTask"
        @status-change="setStatus"
      />

      <!-- 新建入口：两个视图共用，始终在内容下方 -->
      <button
        type="button"
        class="mt-4 w-full rounded-xl border border-dashed border-indigo-300 bg-white px-4 py-3 text-sm font-medium text-indigo-600 transition hover:border-indigo-400 hover:bg-indigo-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none"
        @click="showModal = true"
      >
        + 新建任务
      </button>

      <TaskModal v-model="showModal" @submit="addTask" />
    </main>
  </div>
</template>
