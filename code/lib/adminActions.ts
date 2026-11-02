"use server";

import { redirect } from "next/navigation";
import { loginAdmin, logoutAdmin, requireAdmin } from "@/lib/adminAuth";
import {
  addPage,
  createFlow,
  deleteFlow,
  deletePage,
  movePage,
  setFormTarget,
  setPublished,
  updateFlow,
} from "@/lib/flows";
import { setTshirtsFlow } from "@/lib/settings";

export async function login(_state: { error: string }, formData: FormData) {
  const result = await loginAdmin(String(formData.get("password") ?? ""));
  if (!result.ok) return { error: result.error };
  redirect("/admin");
}

export async function logout() {
  await logoutAdmin();
  redirect("/admin/login");
}

export async function createFlowAction(formData: FormData) {
  await requireAdmin();
  const flow = await createFlow(String(formData.get("name") ?? ""));
  if (!flow) redirect("/admin/flows?error=database");
  redirect(`/admin/flows/${flow.id}`);
}

export async function updateFlowAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const result = await updateFlow(id, String(formData.get("name") ?? ""), String(formData.get("slug") ?? ""));
  if (!result.ok) redirect(`/admin/flows/${id}?error=${encodeURIComponent(result.error)}`);
  redirect(`/admin/flows/${id}`);
}

export async function publishFlowAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await setPublished(id, formData.get("published") === "true");
  redirect(`/admin/flows/${id}`);
}

export async function addPageAction(formData: FormData) {
  await requireAdmin();
  const flowId = String(formData.get("flowId") ?? "");
  const kind = String(formData.get("kind") ?? "blank");
  const pageKind = kind === "thanks" || kind === "pdf" ? kind : "blank";
  await addPage(flowId, pageKind);
  redirect(`/admin/flows/${flowId}`);
}

export async function movePageAction(formData: FormData) {
  await requireAdmin();
  const flowId = String(formData.get("flowId") ?? "");
  const pageId = String(formData.get("pageId") ?? "");
  const direction = formData.get("direction") === "up" ? -1 : 1;
  await movePage(pageId, direction);
  redirect(`/admin/flows/${flowId}`);
}

export async function deleteFlowAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const fromEditor = formData.get("from") === "editor";
  const result = await deleteFlow(id, String(formData.get("confirmation") ?? ""));
  if (!result.ok) {
    const back = fromEditor ? `/admin/flows/${id}` : "/admin/flows";
    redirect(`${back}?error=${encodeURIComponent(result.error)}`);
  }
  redirect("/admin/flows");
}

export async function setTshirtsAction(formData: FormData) {
  await requireAdmin();
  const result = await setTshirtsFlow(String(formData.get("flowId") ?? ""));
  if (!result.ok) redirect(`/admin/flows?error=${encodeURIComponent(result.error)}`);
  redirect("/admin/flows");
}

export async function deletePageAction(formData: FormData) {
  await requireAdmin();
  const flowId = String(formData.get("flowId") ?? "");
  await deletePage(String(formData.get("pageId") ?? ""));
  redirect(`/admin/flows/${flowId}`);
}

export async function setFormTargetAction(formData: FormData) {
  await requireAdmin();
  const pageId = String(formData.get("pageId") ?? "");
  const flowId = String(formData.get("flowId") ?? "");
  await setFormTarget(pageId, String(formData.get("targetPageId") ?? ""));
  redirect(`/admin/flows/${flowId}`);
}
