/** 任务状态的可选值：待办 / 进行中 / 已完成 */
export const TASK_STATUSES = ['todo', 'in-progress', 'done'] as const

/** 任务优先级的可选值：低 / 中 / 高 */
export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const

export type TaskStatus = (typeof TASK_STATUSES)[number]
export type TaskPriority = (typeof TASK_PRIORITIES)[number]

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  /** 截止日期，ISO 8601 日期字符串，如 '2026-09-30' */
  dueDate: string
  /** 创建时间，ISO 8601 日期时间字符串 */
  createdAt: string
}

/**
 * 新建任务的表单产出。
 * 只包含用户填写的字段；id / status / dueDate / createdAt 由数据层补齐。
 */
export interface TaskDraft {
  title: string
  description: string
  priority: TaskPriority
}
