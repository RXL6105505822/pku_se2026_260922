<script setup lang="ts">
import { ref } from 'vue'
import TaskList from './components/TaskList.vue'
import TaskModal from './components/TaskModal.vue'
import type { Task, TaskDraft } from './types/task'

// 假数据：后续替换为真实数据源
const tasks = ref<Task[]>([
  {
    id: '1',
    title: '搭建项目骨架',
    description: '初始化 Vue 3 + Vite + Tailwind 的项目结构，确定目录约定。',
    status: 'done',
    priority: 'high',
    dueDate: '2026-09-18',
    createdAt: '2026-09-15T09:00:00+08:00',
  },
  {
    id: '2',
    title: '实现任务列表页',
    description: '任务卡片展示标题、描述、状态与截止日期，支持按状态筛选。',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-09-25',
    createdAt: '2026-09-16T10:30:00+08:00',
  },
  {
    id: '3',
    title: '任务创建与编辑表单',
    description: '支持新建任务、修改标题与描述，并校验必填项。',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2026-09-28',
    createdAt: '2026-09-17T14:05:00+08:00',
  },
  {
    id: '4',
    title: '接入本地存储',
    description: '把任务数据持久化到 localStorage，避免刷新后丢失。',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-10-02',
    createdAt: '2026-09-19T11:20:00+08:00',
  },
  {
    id: '5',
    title: '补充 README 使用说明',
    description: '写清楚本地启动方式、目录结构与后续开发计划。',
    status: 'todo',
    priority: 'low',
    dueDate: '2026-10-08',
    createdAt: '2026-09-20T16:40:00+08:00',
  },
])

/** 复选框只表达「完成 / 未完成」，取消勾选一律回到 todo */
function toggleTask(id: string) {
  const task = tasks.value.find((item) => item.id === id)
  if (!task) return
  task.status = task.status === 'done' ? 'todo' : 'done'
}

function deleteTask(id: string) {
  tasks.value = tasks.value.filter((item) => item.id !== id)
}

const showModal = ref(false)

/** 本地日历日期（不用 toISOString，那会按 UTC 算，可能差一天） */
function todayIso() {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function createTask(draft: TaskDraft) {
  tasks.value.push({
    id: crypto.randomUUID(),
    ...draft,
    status: 'todo',
    dueDate: todayIso(),
    createdAt: new Date().toISOString(),
  })
}
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
          {{ tasks.length }} 个任务
        </span>
      </div>
    </header>

    <!-- 任务列表区域 -->
    <main class="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div class="mb-5">
        <h2 class="text-lg font-semibold tracking-tight">任务列表</h2>
        <p class="mt-1 text-sm text-slate-500">当前为示例数据，稍后接入真实功能。</p>
      </div>

      <TaskList
        :tasks="tasks"
        @toggle="toggleTask"
        @delete="deleteTask"
        @create="showModal = true"
      />

      <TaskModal v-model="showModal" @submit="createTask" />
    </main>
  </div>
</template>
