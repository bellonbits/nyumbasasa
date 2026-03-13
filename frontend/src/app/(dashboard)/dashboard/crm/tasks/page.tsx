"use client";

import { useState } from "react";
import { Plus, CheckCircle2, Circle, Flag, Calendar, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Priority = "High" | "Medium" | "Low";
interface Task {
  id: string; title: string; due: string; priority: Priority;
  done: boolean; assignee: string; category: string;
}

const PRIORITY_COLOR: Record<Priority, string> = {
  High:   "text-red-500",
  Medium: "text-amber-500",
  Low:    "text-blue-500",
};

const INITIAL_TASKS: Task[] = [
  { id:"t1", title:"Follow up with James Kamau — 2BR viewing",     due:"Today",     priority:"High",   done:false, assignee:"GW", category:"Follow-up" },
  { id:"t2", title:"Send lease agreement to Fatuma Hassan",         due:"Today",     priority:"High",   done:false, assignee:"DM", category:"Legal"     },
  { id:"t3", title:"Schedule property viewing — Karen 3BR",         due:"Tomorrow",  priority:"Medium", done:false, assignee:"PO", category:"Viewing"   },
  { id:"t4", title:"Update listing photos — Westlands Studio",      due:"Tomorrow",  priority:"Low",    done:false, assignee:"AO", category:"Listings"  },
  { id:"t5", title:"Call new leads from Bronex campaign",           due:"Mar 13",    priority:"Medium", done:false, assignee:"GW", category:"Follow-up" },
  { id:"t6", title:"Renew expired listing — Kasarani Bedsitter",    due:"Mar 14",    priority:"High",   done:false, assignee:"DM", category:"Listings"  },
  { id:"t7", title:"Prepare monthly performance report for admin",  due:"Mar 15",    priority:"Low",    done:true,  assignee:"AO", category:"Analytics" },
  { id:"t8", title:"Respond to 3 pending WhatsApp inquiries",       due:"Overdue",   priority:"High",   done:false, assignee:"PO", category:"Follow-up" },
];

const CATEGORIES = ["Follow-up", "Legal", "Viewing", "Listings", "Analytics", "Other"];

function AddTaskModal({ onClose, onAdd }: { onClose: () => void; onAdd: (task: Task) => void }) {
  const [title, setTitle]       = useState("");
  const [due, setDue]           = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [category, setCategory] = useState("Follow-up");
  const [assignee, setAssignee] = useState("");

  const submit = () => {
    if (!title.trim()) return;
    onAdd({
      id: Date.now().toString(),
      title: title.trim(),
      due: due || "No date",
      priority,
      done: false,
      assignee: assignee.trim().toUpperCase().slice(0, 2) || "ME",
      category,
    });
    onClose();
  };

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent placeholder:text-gray-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Add Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Task Title *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              placeholder="e.g. Follow up with client"
              className={inp}
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Date</label>
              <input type="date" value={due} onChange={e => setDue(e.target.value)} className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value as Priority)} className={inp}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className={inp}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Assignee Initials</label>
              <input
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                placeholder="e.g. GW"
                maxLength={3}
                className={inp}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">Cancel</button>
          <button onClick={submit} className="flex-1 bg-gray-900 hover:bg-gray-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">Add Task</button>
        </div>
      </div>
    </div>
  );
}

function TaskRow({ task, onToggle, onDelete }: { task: Task; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <div className={cn("flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-gray-50 transition-colors group", task.done && "opacity-60")}>
      <button onClick={() => onToggle(task.id)} className="flex-shrink-0">
        {task.done
          ? <CheckCircle2 className="w-5 h-5 text-brand-500" />
          : <Circle className="w-5 h-5 text-gray-300 hover:text-gray-500 transition-colors" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm text-gray-800", task.done && "line-through text-gray-400")}>{task.title}</p>
        <span className="text-xs text-gray-400">{task.category}</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <Flag className={cn("w-3.5 h-3.5 hidden sm:block", PRIORITY_COLOR[task.priority])} />
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Calendar className="w-3 h-3" />
          <span className={task.due === "Overdue" ? "text-red-500 font-medium" : ""}>{task.due}</span>
        </div>
        <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-[9px] font-bold text-brand-700">
          {task.assignee}
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [tasks, setTasks]     = useState(INITIAL_TASKS);
  const [showModal, setShowModal] = useState(false);

  const toggle = (id: string) => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const remove = (id: string) => setTasks(ts => ts.filter(t => t.id !== id));
  const addTask = (task: Task) => setTasks(ts => [task, ...ts]);

  const pending   = tasks.filter(t => !t.done);
  const completed = tasks.filter(t => t.done);

  return (
    <div className="p-4 sm:p-6 max-w-3xl">
      {showModal && <AddTaskModal onClose={() => setShowModal(false)} onAdd={addTask} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tasks</h1>
          <p className="text-sm text-gray-400 mt-0.5">{pending.length} pending · {completed.length} completed</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {/* Pending */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
        <div className="px-4 sm:px-5 py-3 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-700">Pending ({pending.length})</p>
        </div>
        {pending.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-gray-400">All caught up! No pending tasks.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {pending.map(task => (
              <TaskRow key={task.id} task={task} onToggle={toggle} onDelete={remove} />
            ))}
          </div>
        )}
      </div>

      {/* Completed */}
      {completed.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-5 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-400">Completed ({completed.length})</p>
          </div>
          <div className="divide-y divide-gray-50">
            {completed.map(task => (
              <TaskRow key={task.id} task={task} onToggle={toggle} onDelete={remove} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
