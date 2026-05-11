// src/styles/common.js
// Minimal Clean Light Theme
//home page
///export const homePageBackground = "bg-gay-800 min-h-screen";

// ─── Layout ───────────────────────────────────────────
export const pageBackground = "bg-[#ffffff] min-h-screen";
export const pageWrapper = "max-w-6xl mx-auto px-6 py-10";
export const section = "mb-10";

// ─── Cards ────────────────────────────────────────────
export const cardClass =
  "bg-[#ffffff] border border-[#e5e7eb] rounded-2xl p-6 hover:border-[#d1d5db] transition-all duration-200";

// ─── Typography ───────────────────────────────────────
export const pageTitleClass =
  "text-4xl font-bold text-[#111827] tracking-tight";

export const headingClass =
  "text-2xl font-semibold text-[#111827] tracking-tight";

export const subHeadingClass =
  "text-lg font-medium text-[#111827]";

export const bodyText =
  "text-[#4b5563] leading-relaxed";

export const mutedText =
  "text-sm text-[#9ca3af]";

export const linkClass =
  "text-[#2563eb] hover:text-[#1d4ed8] transition-colors";

// ─── Buttons ──────────────────────────────────────────
export const primaryBtn =
  "bg-[#2563eb] text-white px-5 py-2 rounded-xl hover:bg-[#1d4ed8] transition-colors text-sm font-medium";

export const secondaryBtn =
  "border border-[#d1d5db] bg-white text-[#111827] px-5 py-2 rounded-xl hover:bg-[#f9fafb] transition-colors text-sm font-medium";

export const ghostBtn =
  "text-[#2563eb] hover:text-[#1d4ed8] text-sm font-medium transition-colors";

// ─── Forms ────────────────────────────────────────────
export const formCard =
  "bg-white border border-[#e5e7eb] rounded-2xl p-8";

export const formTitle =
  "text-2xl font-semibold text-[#111827] text-center mb-6";

export const labelClass =
  "text-sm font-medium text-[#374151] mb-1 block";

export const inputClass =
  "w-full border border-[#d1d5db] bg-white rounded-xl px-4 py-2.5 text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition";

export const formGroup = "mb-4";

export const submitBtn =
  "w-full bg-[#2563eb] text-white py-2.5 rounded-xl hover:bg-[#1d4ed8] transition-colors font-medium";

// ─── Navbar ───────────────────────────────────────────
export const navbarClass =
  "sticky top-0 z-50 bg-white/95 backdrop-blur-sm  px-6 h-[60px] flex items-center ";

export const navContainerClass =
  "max-w-6xl mx-auto w-full flex items-center justify-between";

export const navBrandClass =
  "text-2xl font-semibold text-[#111827]";

export const navLinksClass =
  "flex items-center gap-6";

export const navLinkClass =
  "text-lg font-medium text-black hover:text-[#111827] px-3 py-2 rounded-lg transition-colors";

export const navLinkActiveClass =
  "text-base font-semibold text-white bg-[#5b21b6] px-3 py-2 rounded-lg transition-colors hover:bg-[#4c1d95]";

// ─── Articles / Chat Cards ────────────────────────────
export const articleGrid =
  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5";

export const articleCardClass =
  "bg-white border border-[#e5e7eb] rounded-2xl p-5 hover:border-[#d1d5db] transition-all duration-200";

export const articleTitle =
  "text-lg font-semibold text-[#111827]";

export const articleExcerpt =
  "text-sm text-[#6b7280] leading-relaxed";

export const articleMeta =
  "text-xs text-[#9ca3af]";

export const articleBody =
  "text-[#374151] leading-relaxed";

export const timestampClass =
  "text-xs text-[#9ca3af]";

export const tagClass =
  "text-xs font-semibold uppercase tracking-wide text-[#2563eb]";

// ─── Article Page ─────────────────────────────────────
export const articlePageWrapper =
  "max-w-4xl mx-auto px-6 py-10";

export const articleHeader =
  "mb-8 flex flex-col gap-4";

export const articleCategory =
  "text-xs font-semibold uppercase tracking-wide text-[#2563eb]";

export const articleMainTitle =
  "text-4xl font-bold text-[#111827] leading-tight";

export const articleAuthorRow =
  "flex items-center justify-between border-y border-[#e5e7eb] py-4 text-sm text-[#6b7280]";

export const authorInfo =
  "flex items-center gap-2 font-medium text-[#111827]";

export const articleContent =
  "text-[#374151] leading-8 text-[1rem] whitespace-pre-line mt-8";

export const articleFooter =
  "border-t border-[#e5e7eb] mt-10 pt-5 text-sm text-[#9ca3af]";

// ─── Actions ──────────────────────────────────────────
export const articleActions =
  "flex gap-3 mt-5";

export const editBtn =
  "bg-[#2563eb] text-white px-4 py-2 rounded-xl hover:bg-[#1d4ed8] transition";

export const deleteBtn =
  "bg-[#ef4444] text-white px-4 py-2 rounded-xl hover:bg-[#dc2626] transition";

// ─── Status Badges ────────────────────────────────────
export const articleStatusActive =
  "absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700";

export const articleStatusDeleted =
  "absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700";

// ─── Feedback ─────────────────────────────────────────
export const errorClass =
  "bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm";

export const successClass =
  "bg-green-50 border border-green-200 text-green-600 rounded-xl px-4 py-3 text-sm";

export const loadingClass =
  "text-center text-[#6b7280] py-10 animate-pulse";

export const emptyStateClass =
  "text-center text-[#9ca3af] py-16";

// ─── Comments ─────────────────────────────────────────
export const commentsWrapper =
  "mt-10 flex flex-col gap-5";

export const commentCard =
  "bg-white border border-[#e5e7eb] rounded-2xl p-5";

export const commentHeader =
  "flex items-center justify-between mb-2";

export const commentUser =
  "text-sm font-semibold text-[#111827]";

export const commentTime =
  "text-xs text-[#9ca3af]";

export const commentText =
  "text-sm text-[#374151] leading-relaxed";

export const avatar =
  "w-10 h-10 rounded-full bg-[#eff6ff] text-[#2563eb] flex items-center justify-center font-semibold";

export const commentUserRow =
  "flex items-center gap-3";

// ─── Divider ──────────────────────────────────────────
export const divider =
  "border-t border-[#e5e7eb] my-8";

// ─── User List / Chat List ────────────────────────────
export const userInfoContainer =
  "flex items-center justify-between";

export const userNameText =
  "text-base font-medium text-[#111827]";

export const userActionBtnBase =
  "px-4 py-1.5 rounded-lg text-sm font-medium transition";

export const userActionBtnActive =
  "bg-red-50 text-red-600 hover:bg-red-100";

export const userActionBtnInactive =
  "bg-green-50 text-green-600 hover:bg-green-100";