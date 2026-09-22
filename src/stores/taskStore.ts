import { reactive, watch } from 'vue'
import { hasSavedTasks, loadTasks, saveTasks } from '../utils/storage'
import type { Task, TaskDraft } from '../types/task'

/**
 * 用 reactive 包一层对象、而不是直接 reactive(数组)：
 * 这样 state.tasks 可以整体替换（deleteTask 用 filter 重建）而不丢响应式。
 */
export const state = reactive<{ tasks: Task[] }>({ tasks: [] })

function createSeedTasks(): Task[] {
  return [
    {
      id: 'seed-1',
      title: '搭建项目骨架',
      description: '初始化 Vue 3 + Vite + Tailwind 的项目结构，确定目录约定。',
      status: 'done',
      priority: 'high',
      dueDate: '2026-09-18',
      createdAt: '2026-09-15T09:00:00+08:00',
    },
    {
      id: 'seed-2',
      title: '实现任务列表页',
      description: '任务卡片展示标题、描述、状态与截止日期，支持按状态筛选。',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2026-09-25',
      createdAt: '2026-09-16T10:30:00+08:00',
    },
    {
      id: 'seed-3',
      title: '补充 README 使用说明',
      description: '写清楚本地启动方式、目录结构与后续开发计划。',
      status: 'todo',
      priority: 'low',
      createdAt: '2026-09-17T14:05:00+08:00',
    },
  ]
}

/* ---------- 初始化：读本地数据，首次使用才塞示例 ---------- */
state.tasks = loadTasks()

if (!hasSavedTasks()) {
  state.tasks = createSeedTasks()
  saveTasks(state.tasks) // 立刻落盘，避免「内存里有、存储里没有」的中间态
}

/**
 * 必须是 getter 形式。直接写 watch(state.tasks, ...) 会绑定到当时那个数组对象上，
 * deleteTask 整体替换数组之后，监听器就一直在盯着被丢弃的旧数组。
 */
watch(
  () => state.tasks,
  (tasks) => saveTasks(tasks),
  { deep: true },
)

/* ---------- 对外操作 ---------- */

export function addTask(draft: TaskDraft): void {
  state.tasks.push({
    id: crypto.randomUUID(),
    ...draft,
    status: 'todo',
    createdAt: new Date().toISOString(),
  })
}

export function updateTask(id: string, patch: Partial<Task>): void {
  const task = state.tasks.find((item) => item.id === id)
  if (task) Object.assign(task, patch)
}

export function deleteTask(id: string): void {
  state.tasks = state.tasks.filter((item) => item.id !== id)
}

/** 域规则：复选框只表达完成/未完成，取消勾选一律回到 todo */
export function toggleTask(id: string): void {
  const task = state.tasks.find((item) => item.id === id)
  if (!task) return
  updateTask(id, { status: task.status === 'done' ? 'todo' : 'done' })
}
