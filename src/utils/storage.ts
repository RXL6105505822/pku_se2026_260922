import type { Task } from '../types/task'

export const STORAGE_KEY = 'vibe-coding-runoob-tasks'

/**
 * 判断一条记录是不是可用的 Task。
 * localStorage 里的内容是可以被手改的，也可能是旧版本写入的；
 * 放进一条缺字段的数据会让 TaskCard 在渲染时抛错、整页变白，所以这里挡掉。
 */
function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false
  const task = value as Record<string, unknown>
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.createdAt === 'string' &&
    (task.status === 'todo' || task.status === 'in-progress' || task.status === 'done') &&
    (task.priority === 'low' || task.priority === 'medium' || task.priority === 'high')
  )
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch (error) {
    // 无痕模式、或配额写满时 setItem 会抛。持久化失败不该把应用带崩
    console.error('保存任务失败：', error)
  }
}

/** 读不出或解析失败时返回空数组 */
export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isTask)
  } catch (error) {
    console.error('读取任务失败，按空列表处理：', error)
    return []
  }
}

/**
 * 区分「从来没存过」和「存过、但用户把任务全删了」。
 * 只看 loadTasks().length === 0 的话，用户清空任务后一刷新，
 * 示例数据又会冒出来。
 */
export function hasSavedTasks(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null
  } catch {
    return false
  }
}
