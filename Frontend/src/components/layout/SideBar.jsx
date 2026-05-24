{/* SIDEBAR */}
<div className="w-[320px] bg-[#050505] border-r border-[#141414] flex flex-col">

  {/* CHANNELS */}
  <div className="p-4">

    <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-2xl px-5 py-4 flex items-center justify-between shadow-[0_0_20px_rgba(17,168,232,0.05)]">

      <h2 className="text-white font-black uppercase tracking-wide text-lg">
        Channels
      </h2>

    </div>

    {/* EMPTY TEXT */}
    <p className="text-[#707070] mt-5 px-3 text-sm">
      No channels yet
    </p>

    {/* ADD CHANNEL */}
    <button className="mt-5 flex items-center gap-3 px-3 py-3 rounded-xl text-[#d4d4d4] hover:bg-[#0d0d0d] hover:text-[#11A8E8] transition-all duration-300 w-full">

      <span className="text-2xl font-light">
        +
      </span>

      <span className="font-semibold text-base">
        Add channels
      </span>

    </button>

  </div>

  {/* DIRECT MESSAGES */}
  <div className="p-4 pt-2">

    <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-2xl px-5 py-4 flex items-center gap-3 shadow-[0_0_20px_rgba(17,168,232,0.05)]">

      <span className="text-[#11A8E8] text-sm">
        ▾
      </span>

      <h2 className="text-white font-black uppercase tracking-wide text-lg">
        Direct Messages
      </h2>

    </div>

    {/* USER ITEM */}
    <div className="mt-5 flex items-center justify-between px-3 py-3 rounded-2xl hover:bg-[#0d0d0d] transition-all duration-300 cursor-pointer border border-transparent hover:border-[#1f1f1f]">

      <div className="flex items-center gap-4">

        {/* AVATAR */}
        <div className="w-10 h-10 rounded-xl bg-[#11A8E8] flex items-center justify-center text-white font-black shadow-[0_0_20px_rgba(17,168,232,0.25)]">
          U
        </div>

        {/* NAME */}
        <span className="text-[#e5e5e5] font-semibold text-base">
          user3
        </span>

      </div>

      {/* ONLINE DOT */}
      <div className="w-3 h-3 rounded-full bg-[#11A8E8] shadow-[0_0_10px_rgba(17,168,232,0.8)]"></div>

    </div>

    {/* INVITE */}
    <button className="mt-4 flex items-center gap-3 px-3 py-3 rounded-xl text-[#d4d4d4] hover:bg-[#0d0d0d] hover:text-[#11A8E8] transition-all duration-300 w-full">

      <span className="text-2xl font-light">
        +
      </span>

      <span className="font-semibold text-base">
        Invite people
      </span>

    </button>

  </div>
</div>