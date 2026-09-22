<script setup lang="ts">
import { nextTick, onUnmounted, reactive, ref, watch } from 'vue'
import { TASK_PRIORITIES } from '../types/task'
import type { TaskDraft, TaskPriority } from '../types/task'

/** 弹窗开关由父组件通过 v-model 控制 */
const open = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  submit: [draft: TaskDraft]
}>()

const form = reactive<{
  title: string
  description: string
  priority: TaskPriority
  dueDate: string
}>({
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
})

const error = ref('')
const titleInput = ref<HTMLInputElement | null>(null)

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: '低',
  medium: '中',
  high: '高',
}

function reset() {
  form.title = ''
  form.description = ''
  form.priority = 'medium'
  form.dueDate = ''
  error.value = ''
}

function close() {
  open.value = false
}

function handleSubmit() {
  if (!form.title.trim()) {
    error.value = '标题不能为空'
    return
  }
  emit('submit', {
    title: form.title.trim(),
    description: form.description.trim(),
    priority: form.priority,
    // 没选日期就不带这个字段（Task.dueDate 是可选的），避免塞一个假日期
    ...(form.dueDate ? { dueDate: form.dueDate } : {}),
  })
  close()
}

// 开始输入就把错误提示收起来，不用等到再次提交
watch(
  () => form.title,
  (value) => {
    if (value.trim()) error.value = ''
  },
)

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

// 打开时重置表单、聚焦标题，并监听 ESC；关闭时摘掉监听
watch(
  open,
  async (isOpen) => {
    if (isOpen) {
      reset()
      window.addEventListener('keydown', onKeydown)
      await nextTick()
      titleInput.value?.focus()
    } else {
      window.removeEventListener('keydown', onKeydown)
    }
  },
  { immediate: true },
)

onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <!-- 遮罩：点自己（即弹窗外部）才关闭，点弹窗内部不会冒泡触发 -->
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      @click.self="close"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 id="task-modal-title" class="text-lg font-semibold tracking-tight text-slate-900">
          新建任务
        </h2>

        <form class="mt-5 space-y-4" novalidate @submit.prevent="handleSubmit">
          <div>
            <label for="task-title" class="block text-sm font-medium text-slate-700">
              标题 <span class="text-rose-500" aria-hidden="true">*</span>
            </label>
            <input
              id="task-title"
              ref="titleInput"
              v-model="form.title"
              type="text"
              placeholder="想做什么？"
              :aria-invalid="error ? 'true' : undefined"
              :aria-describedby="error ? 'task-title-error' : undefined"
              class="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2"
              :class="
                error
                  ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-100'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              "
            />
            <p v-if="error" id="task-title-error" class="mt-1.5 text-sm text-rose-600">
              {{ error }}
            </p>
          </div>

          <div>
            <label for="task-description" class="block text-sm font-medium text-slate-700">
              描述 <span class="font-normal text-slate-400">（选填）</span>
            </label>
            <textarea
              id="task-description"
              v-model="form.description"
              rows="3"
              placeholder="补充说明…"
              class="mt-1.5 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label for="task-priority" class="block text-sm font-medium text-slate-700">
                优先级
              </label>
              <select
                id="task-priority"
                v-model="form.priority"
                class="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option v-for="priority in TASK_PRIORITIES" :key="priority" :value="priority">
                  {{ PRIORITY_LABELS[priority] }}
                </option>
              </select>
            </div>

            <div>
              <label for="task-due-date" class="block text-sm font-medium text-slate-700">
                截止日期 <span class="font-normal text-slate-400">（选填）</span>
              </label>
              <input
                id="task-due-date"
                v-model="form.dueDate"
                type="date"
                class="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-1">
            <button
              type="button"
              class="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
              @click="close"
            >
              取消
            </button>
            <button
              type="submit"
              class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              创建任务
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
