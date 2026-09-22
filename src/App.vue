<script setup lang="ts">
import { ref } from 'vue'
import type { Task, TaskPriority, TaskStatus } from './types/task'

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

const statusMeta: Record<TaskStatus, { label: string; badge: string; dot: string }> = {
  todo: {
    label: '待办',
    badge: 'bg-slate-100 text-slate-600 ring-slate-200',
    dot: 'bg-slate-400',
  },
  'in-progress': {
    label: '进行中',
    badge: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    dot: 'bg-indigo-500',
  },
  done: {
    label: '已完成',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    dot: 'bg-emerald-500',
  },
}

const priorityMeta: Record<TaskPriority, { label: string; badge: string }> = {
  low: { label: '低', badge: 'bg-slate-50 text-slate-500 ring-slate-200' },
  medium: { label: '中', badge: 'bg-amber-50 text-amber-700 ring-amber-200' },
  high: { label: '高', badge: 'bg-rose-50 text-rose-700 ring-rose-200' },
}

/** 把 '2026-09-30' 格式化为 '9月30日'（按字符串取值，避免时区偏移） */
function formatDueDate(isoDate: string) {
  const [, month, day] = isoDate.slice(0, 10).split('-')
  return `${Number(month)}月${Number(day)}日`
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

      <ul class="space-y-3">
        <li
          v-for="task in tasks"
          :key="task.id"
          class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
        >
          <div class="flex items-start gap-3">
            <span
              class="mt-1.5 size-2 shrink-0 rounded-full"
              :class="statusMeta[task.status].dot"
              aria-hidden="true"
            />

            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-3">
                <h3
                  class="font-medium"
                  :class="task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-900'"
                >
                  {{ task.title }}
                </h3>
                <span
                  class="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset"
                  :class="priorityMeta[task.priority].badge"
                >
                  {{ priorityMeta[task.priority].label }}优先级
                </span>
              </div>

              <p class="mt-1.5 line-clamp-2 text-sm text-slate-500">{{ task.description }}</p>

              <div class="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <span
                  class="rounded-full px-2 py-0.5 font-medium ring-1 ring-inset"
                  :class="statusMeta[task.status].badge"
                >
                  {{ statusMeta[task.status].label }}
                </span>
                <span class="text-slate-300" aria-hidden="true">·</span>
                <span>截止 {{ formatDueDate(task.dueDate) }}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </main>
  </div>
</template>
