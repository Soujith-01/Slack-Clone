// src/styles/common.js
// Black + Neon Blue Creative Theme

// ─── Layout ───────────────────────────────────────────
export const pageBackground =
  "bg-[#050505] min-h-screen text-white transition-colors";

export const pageWrapper =
  "max-w-6xl mx-auto px-6 py-10 compact:py-8";

export const section =
  "mb-10 compact:mb-8";

// ─── Cards ────────────────────────────────────────────
export const cardClass =
  "bg-[#0d0d0d] border border-[#1f1f1f] rounded-3xl p-6 compact:p-5 hover:border-[#11A8E8]/40 shadow-[0_0_30px_rgba(17,168,232,0.06)] transition-all duration-300";

// ─── Typography ───────────────────────────────────────
export const pageTitleClass =
  "text-4xl font-black text-white tracking-tight uppercase";

export const headingClass =
  "text-2xl font-bold text-white tracking-tight uppercase";

export const subHeadingClass =
  "text-lg font-semibold text-[#d4d4d4]";

export const bodyText =
  "text-[#9b9b9b] leading-relaxed";

export const mutedText =
  "text-sm text-[#737373]";

export const linkClass =
  "text-[#11A8E8] hover:text-[#38BDF8] transition-colors";

// ─── Buttons ──────────────────────────────────────────
export const primaryBtn =
  "bg-[#11A8E8] text-white px-5 py-2.5 rounded-2xl hover:bg-[#38BDF8] transition-all duration-300 text-sm font-semibold shadow-[0_0_25px_rgba(17,168,232,0.20)]";

export const secondaryBtn =
  "border border-[#1f1f1f] bg-[#0d0d0d] text-white px-5 py-2.5 rounded-2xl hover:border-[#11A8E8]/40 hover:bg-[#111111] transition-all duration-300 text-sm font-medium";

export const ghostBtn =
  "text-[#11A8E8] hover:text-[#38BDF8] text-sm font-medium transition-colors";

// ─── Forms ────────────────────────────────────────────
export const formCard =
  "bg-[#0b0b0b] border border-[#1f1f1f] rounded-3xl p-8 compact:p-6 shadow-[0_0_50px_rgba(17,168,232,0.08)] transition-all duration-300";

export const formTitle =
  "text-3xl font-black text-white text-center mb-6 tracking-tight uppercase";

export const labelClass =
  "text-sm font-semibold text-[#d4d4d4] mb-2 block uppercase tracking-wide";

export const inputClass =
  "w-full border border-[#232323] bg-[#0d0d0d] rounded-2xl px-4 py-3 text-white placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#11A8E8]/20 focus:border-[#11A8E8] transition-all duration-300";

export const formGroup =
  "mb-4";

export const submitBtn =
  "w-full bg-[#11A8E8] text-white py-3 rounded-2xl hover:bg-[#38BDF8] transition-all duration-300 font-semibold shadow-[0_0_30px_rgba(17,168,232,0.20)]";

// ─── Navbar ───────────────────────────────────────────
export const navbarClass =
  "sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-[#111111] px-6 h-[70px] flex items-center";

export const navContainerClass =
  "max-w-6xl mx-auto w-full flex items-center justify-between";

export const navBrandClass =
  "text-2xl font-black text-[#11A8E8] tracking-tight uppercase";

export const navLinksClass =
  "flex items-center gap-6 compact:gap-4";

export const navLinkClass =
  "text-sm font-semibold uppercase tracking-wide text-[#d4d4d4] hover:text-[#11A8E8] px-3 py-2 rounded-xl transition-all duration-300";

export const navLinkActiveClass =
  "text-sm font-semibold uppercase tracking-wide text-white bg-[#11A8E8] px-4 py-2 rounded-xl transition-all duration-300 hover:bg-[#38BDF8]";

// ─── Articles / Chat Cards ────────────────────────────
export const articleGrid =
  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5";

export const articleCardClass =
  "bg-[#0d0d0d] border border-[#1f1f1f] rounded-3xl p-5 hover:border-[#11A8E8]/40 shadow-[0_0_25px_rgba(17,168,232,0.05)] transition-all duration-300";

export const articleTitle =
  "text-lg font-bold text-white";

export const articleExcerpt =
  "text-sm text-[#8a8a8a] leading-relaxed";

export const articleMeta =
  "text-xs text-[#666666]";

export const articleBody =
  "text-[#b3b3b3] leading-relaxed";

export const timestampClass =
  "text-xs text-[#666666]";

export const tagClass =
  "text-xs font-bold uppercase tracking-wide text-[#11A8E8]";

// ─── Article Page ─────────────────────────────────────
export const articlePageWrapper =
  "max-w-4xl mx-auto px-6 py-10";

export const articleHeader =
  "mb-8 flex flex-col gap-4";

export const articleCategory =
  "text-xs font-bold uppercase tracking-wide text-[#11A8E8]";

export const articleMainTitle =
  "text-4xl font-black text-white leading-tight uppercase";

export const articleAuthorRow =
  "flex items-center justify-between border-y border-[#1f1f1f] py-4 text-sm text-[#737373]";

export const authorInfo =
  "flex items-center gap-2 font-semibold text-white";

export const articleContent =
  "text-[#b3b3b3] leading-8 text-[1rem] whitespace-pre-line mt-8";

export const articleFooter =
  "border-t border-[#1f1f1f] mt-10 pt-5 text-sm text-[#666666]";

// ─── Actions ──────────────────────────────────────────
export const articleActions =
  "flex gap-3 mt-5";

export const editBtn =
  "bg-[#11A8E8] text-white px-4 py-2 rounded-2xl hover:bg-[#38BDF8] transition-all duration-300";

export const deleteBtn =
  "bg-[#dc2626] text-white px-4 py-2 rounded-2xl hover:bg-[#ef4444] transition-all duration-300";

// ─── Status Badges ────────────────────────────────────
export const articleStatusActive =
  "absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full bg-[#0f172a] text-[#38BDF8] border border-[#11A8E8]/30";

export const articleStatusDeleted =
  "absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full bg-[#2b0b0b] text-[#ef4444] border border-[#ef4444]/30";

// ─── Feedback ─────────────────────────────────────────
export const errorClass =
  "bg-[#2b0b0b] border border-[#7f1d1d] text-[#f87171] rounded-2xl px-4 py-3 text-sm mt-2";

export const successClass =
  "bg-[#052e16] border border-[#166534] text-[#4ade80] rounded-2xl px-4 py-3 text-sm";

export const loadingClass =
  "text-center text-[#737373] py-10 animate-pulse";

export const emptyStateClass =
  "text-center text-[#666666] py-16";

// ─── Comments ─────────────────────────────────────────
export const commentsWrapper =
  "mt-10 flex flex-col gap-5";

export const commentCard =
  "bg-[#0d0d0d] border border-[#1f1f1f] rounded-3xl p-5";

export const commentHeader =
  "flex items-center justify-between mb-2";

export const commentUser =
  "text-sm font-semibold text-white";

export const commentTime =
  "text-xs text-[#666666]";

export const commentText =
  "text-sm text-[#b3b3b3] leading-relaxed";

export const avatar =
  "w-10 h-10 rounded-full bg-[#0f172a] text-[#11A8E8] flex items-center justify-center font-bold";

export const commentUserRow =
  "flex items-center gap-3";

// ─── Divider ──────────────────────────────────────────
export const divider =
  "border-t border-[#1f1f1f] my-8";

// ─── User List / Chat List ────────────────────────────
export const userInfoContainer =
  "flex items-center justify-between";

export const userNameText =
  "text-base font-semibold text-white";

export const userActionBtnBase =
  "px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-300";

export const userActionBtnActive =
  "bg-[#2b0b0b] text-[#ef4444] hover:bg-[#3b1010]";

export const userActionBtnInactive =
  "bg-[#0f172a] text-[#38BDF8] hover:bg-[#172554]";