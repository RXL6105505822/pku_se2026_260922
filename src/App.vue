<script setup lang="ts">
import { ref } from 'vue'
import TaskList from './components/TaskList.vue'
import TaskModal from './components/TaskModal.vue'
import { addTask, deleteTask, state, toggleTask, updateTask } from './stores/taskStore'
import type { TaskStatus } from './types/task'

/** 弹窗开关属于纯 UI 状态，不进 store */
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

    <!-- 任务列表区域 -->
    <main class="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div class="mb-5">
        <h2 class="text-lg font-semibold tracking-tight">任务列表</h2>
        <p class="mt-1 text-sm text-slate-500">数据已保存到浏览器本地，刷新不会丢失。</p>
      </div>

      <TaskList
        :tasks="state.tasks"
        @toggle="toggleTask"
        @delete="deleteTask"
        @status-change="setStatus"
        @create="showModal = true"
      />

      <TaskModal v-model="showModal" @submit="addTask" />
    </main>
  </div>
</template>
