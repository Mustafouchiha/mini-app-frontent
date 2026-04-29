import { useState, useEffect } from "react";
import { C } from "../constants";
import { operatorAPI, requrilishAPI } from "../services/api";
import { useRealTimeUpdates } from "../hooks/useRealTimeUpdates";
import {
  Search, Trash2, PlusCircle, MinusCircle, Users, Package,
  Loader2, ChevronLeft, Wallet, Lock, Unlock, Eye, EyeOff,
  ShieldCheck, ShieldOff, Copy, Phone, AtSign, Calendar, Hash,
} from "lucide-react";

const phoneCore = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("998") ? digits.slice(-9) : digits.slice(-9);
};

const formatUzPhone = (value) => {
  const core = phoneCore(value);
  if (core.length !== 9) return value || "—";
  return `+998 ${core.slice(0, 2)} ${core.slice(2, 5)} ${core.slice(5, 7)} ${core.slice(7, 9)}`;
};

const reqStatusColor = (status) => ({
  active: "#28A869",
  hidden: "#D4920A",
  deleted: "#FF4D4F",
  pending_payment: "#2563EB",
  pending_approval: "#7C3AED",
}[status] || C.textMuted);

const copyToClipboard = (text) => {
  navigator.clipboard?.writeText(text).catch(() => {});
};

function TabBar({ active, onChange }) {
  return (
    <div style={{ display:"flex", background:C.card, borderRadius:16, padding:4,
                  marginBottom:16, gap:4, border:`1px solid ${C.border}` }}>
      {[["users", <Users size={13}/>, "Userlar"],
        ["products", <Package size={13}/>, "Mahsulotlar"],
        ["req_posts", <Package size={13}/>, "Postlar"]].map(([tab, icon, lbl]) => (
        <button key={tab} onClick={() => onChange(tab)} style={{
          flex:1, padding:"9px 0", borderRadius:12, border:"none",
          cursor:"pointer", fontFamily:"inherit", fontSize:11, fontWeight:700,
          background: active===tab ? C.primaryDark : "transparent",
          color: active===tab ? "white" : C.textMuted,
          display:"flex", alignItems:"center", justifyContent:"center", gap:5,
        }}>{icon} {lbl}</button>
      ))}
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div style={{ position:"relative", marginBottom:14 }}>
      <Search size={15} color={C.textMuted} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }} />
      <input value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width:"100%", boxSizing:"border-box", padding:"10px 12px 10px 36px",
                 borderRadius:12, border:`1.5px solid ${C.border}`, fontSize:13,
                 background:C.bg, color:C.text, outline:"none", fontFamily:"inherit" }} />
    </div>
  );
}

function ConfirmModal({ msg, onConfirm, onCancel }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:999,
                  display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:C.card, borderRadius:20, padding:"24px 20px", maxWidth:340, width:"100%" }}>
        <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:20, textAlign:"center" }}>{msg}</div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:"11px", borderRadius:12,
            border:`1.5px solid ${C.border}`, background:"transparent", cursor:"pointer",
            fontFamily:"inherit", fontSize:13, fontWeight:700, color:C.textSub }}>
            Bekor
          </button>
          <button onClick={onConfirm} style={{ flex:1, padding:"11px", borderRadius:12,
            border:"none", background:"#FF4D4F", color:"white", cursor:"pointer",
            fontFamily:"inherit", fontSize:13, fontWeight:700 }}>
            Tasdiqlash
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, copyable }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
      <span style={{ color:C.textMuted, flexShrink:0 }}>{icon}</span>
      <span style={{ fontSize:11, color:C.textMuted, flexShrink:0 }}>{label}:</span>
      <span style={{ fontSize:11, fontWeight:700, color:C.text, wordBreak:"break-all" }}>{value || "—"}</span>
      {copyable && value && (
        <button onClick={() => copyToClipboard(value)} style={{ background:"none", border:"none",
          cursor:"pointer", padding:2, color:C.textMuted }}>
          <Copy size={10} />
        </button>
      )}
    </div>
  );
}

export default function OperatorPage({ onBack }) {
  const [tab,           setTab]         = useState("users");
  const [query,         setQuery]       = useState("");
  const [users,         setUsers]       = useState([]);
  const [products,      setProducts]    = useState([]);
  const [loading,       setLoading]     = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirm,       setConfirm]     = useState(null);
  const [deposit,       setDeposit]     = useState(null);
  const [amount,        setAmount]      = useState("");
  const [msg,           setMsg]         = useState("");
  const [reqPosts,      setReqPosts]    = useState([]);
  const [isMainAdmin,   setIsMainAdmin] = useState(false);

  // Bosh admin tekshiruvi
  useEffect(() => {
    operatorAPI.checkMainAdmin()
      .then(d => setIsMainAdmin(d.isMainAdmin))
      .catch(() => {});
  }, []);

  const load = async (q = "") => {
    setLoading(true);
    setMsg("");
    try {
      if (tab === "users") {
        const data = await operatorAPI.getUsers(q);
        setUsers(data);
      } else if (tab === "products") {
        const data = await operatorAPI.getProducts(q);
        setProducts(data);
      } else {
        const data = await requrilishAPI.getPosts();
        const search = (q || "").trim().toLowerCase();
        const filtered = !search
          ? data
          : data.filter((p) =>
              String(p.title || "").toLowerCase().includes(search) ||
              String(p.id || "").includes(search)
            );
        setReqPosts(filtered);
      }
    } catch (e) {
      setMsg(e.message || "Xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(""); setQuery(""); }, [tab]);
  useRealTimeUpdates(() => load(query), 15000);

  useEffect(() => {
    const t = setTimeout(() => load(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  const handleDelete = async () => {
    if (!confirm) return;
    try {
      setActionLoading(true);
      if (confirm.type === "user") await operatorAPI.deleteUser(confirm.id);
      else if (confirm.type === "product") await operatorAPI.deleteProduct(confirm.id);
      else await requrilishAPI.operatorDeletePost(confirm.id);
      setConfirm(null);
      load(query);
    } catch (e) {
      setMsg(e.message);
      setConfirm(null);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleUserBlock = async (u) => {
    try {
      setActionLoading(true);
      const res = await operatorAPI.setUserBlocked(u.id, !u.is_blocked);
      setMsg(`✅ ${res.message}`);
      load(query);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleOperator = async (u) => {
    try {
      setActionLoading(true);
      const res = await operatorAPI.setUserOperator(u.id, !u.is_operator);
      setMsg(`✅ ${res.message}`);
      load(query);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleProductActive = async (p) => {
    try {
      setActionLoading(true);
      const res = await operatorAPI.setProductActive(p.id, !p.is_active);
      setMsg(`✅ ${res.message}`);
      load(query);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReqStatusAction = async (post, action) => {
    try {
      setActionLoading(true);
      if (action === "approve") await requrilishAPI.operatorApprovePost(post.id);
      if (action === "hide")    await requrilishAPI.operatorSetVisibility(post.id, true);
      if (action === "show")    await requrilishAPI.operatorSetVisibility(post.id, false);
      if (action === "reject") {
        const reason = window.prompt("Rad etish sababi:");
        if (!reason) return;
        await requrilishAPI.operatorRejectPost(post.id, reason);
      }
      setMsg("✅ Amal bajarildi");
      load(query);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeposit = async () => {
    const sum = Number(amount);
    if (!sum || sum <= 0) { setMsg("Summa kiriting"); return; }
    try {
      const res = deposit.mode === "withdraw"
        ? await operatorAPI.withdraw(deposit.phone, sum)
        : await operatorAPI.deposit(deposit.phone, sum);
      setMsg(`✅ ${res.message}`);
      setDeposit(null);
      setAmount("");
      load(query);
    } catch (e) {
      setMsg(e.message);
    }
  };

  return (
    <div style={{ fontFamily:"'Nunito','Segoe UI',sans-serif", background:C.bg,
                  minHeight:"100vh", maxWidth:430, margin:"0 auto",
                  padding:"16px 16px 80px" }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer",
          padding:4, display:"flex", alignItems:"center" }}>
          <ChevronLeft size={22} color={C.text} />
        </button>
        <div style={{ fontSize:18, fontWeight:900, color:C.text }}>⚙️ Operator paneli</div>
        {isMainAdmin && (
          <div style={{ marginLeft:"auto", fontSize:10, background:"#7C3AED", color:"white",
            padding:"3px 8px", borderRadius:8, fontWeight:800 }}>
            BOSH ADMIN
          </div>
        )}
      </div>

      {/* Xabar */}
      {msg && (
        <div onClick={() => setMsg("")} style={{ padding:"10px 14px", borderRadius:12, marginBottom:12,
          fontSize:13, fontWeight:600, cursor:"pointer",
          background: msg.startsWith("✅") ? "#E8F8F0" : "#FFF1F0",
          color: msg.startsWith("✅") ? "#28A869" : "#FF4D4F" }}>
          {msg}
        </div>
      )}

      <TabBar active={tab} onChange={setTab} />
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder={tab === "users" ? "Ism, telefon, ID, Telegram..." : "Mahsulot nomi, ID, egasi..."}
      />

      {/* Loading */}
      {loading && (
        <div style={{ textAlign:"center", padding:"40px 0", color:C.textMuted }}>
          <Loader2 size={28} className="spin" style={{ margin:"0 auto" }} />
        </div>
      )}

      {/* ── FOYDALANUVCHILAR ── */}
      {!loading && tab === "users" && (
        <div>
          <div style={{ fontSize:11, color:C.textMuted, marginBottom:10 }}>
            Jami: <b>{users.length}</b> ta foydalanuvchi
          </div>
          {users.map(u => (
            <div key={u.id} style={{ background:C.card, borderRadius:16, marginBottom:12,
              border:`1.5px solid ${u.is_blocked ? "#FFCCC7" : u.is_operator ? "#DDD6FE" : C.border}`,
              padding:"14px" }}>

              {/* Badges */}
              <div style={{ display:"flex", gap:6, marginBottom:8, flexWrap:"wrap" }}>
                <span style={{ fontSize:10, fontWeight:800, padding:"2px 8px", borderRadius:6,
                  background: u.is_blocked ? "#FFF1F0" : "#E8F8F0",
                  color: u.is_blocked ? "#FF4D4F" : "#28A869" }}>
                  {u.is_blocked ? "🔒 BLOKLANGAN" : "✅ FAOL"}
                </span>
                {u.is_operator && (
                  <span style={{ fontSize:10, fontWeight:800, padding:"2px 8px", borderRadius:6,
                    background:"#EDE9FE", color:"#7C3AED" }}>
                    ⚙️ OPERATOR
                  </span>
                )}
              </div>

              {/* To'liq ma'lumotlar */}
              <InfoRow icon={<Users size={11}/>} label="Ism" value={u.name} />
              <InfoRow icon={<Hash size={11}/>} label="ID" value={u.public_id} copyable />
              <InfoRow icon={<Phone size={11}/>} label="Telefon" value={formatUzPhone(u.phone)} copyable />
              {u.telegram && <InfoRow icon={<AtSign size={11}/>} label="Telegram" value={u.telegram} copyable />}
              <InfoRow icon={<Wallet size={11}/>} label="Balans"
                value={`${Number(u.balance || 0).toLocaleString()} so'm`} />
              {u.tg_chat_id && <InfoRow icon={<Hash size={11}/>} label="TG Chat ID" value={String(u.tg_chat_id)} copyable />}
              <InfoRow icon={<Calendar size={11}/>} label="Qo'shilgan"
                value={u.joined ? new Date(u.joined).toLocaleDateString("uz-UZ") : "—"} />

              {/* Tugmalar */}
              <div style={{ display:"flex", gap:6, marginTop:12, flexWrap:"wrap" }}>
                {/* Pul qo'shish */}
                <button onClick={() => { setDeposit({ phone: u.phone, name: u.name, mode:"add" }); setAmount(""); setMsg(""); }}
                  style={{ flex:1, minWidth:60, padding:"8px 4px", borderRadius:10, border:"none",
                    background:"#E8F8F0", color:"#28A869", cursor:"pointer", fontSize:11, fontWeight:700,
                    display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
                  <PlusCircle size={13}/> Pul +
                </button>

                {/* Pul yechish */}
                <button onClick={() => { setDeposit({ phone: u.phone, name: u.name, mode:"withdraw" }); setAmount(""); setMsg(""); }}
                  style={{ flex:1, minWidth:60, padding:"8px 4px", borderRadius:10, border:"none",
                    background:"#FFF1F0", color:"#FF4D4F", cursor:"pointer", fontSize:11, fontWeight:700,
                    display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
                  <MinusCircle size={13}/> Pul -
                </button>

                {/* Bloklash */}
                <button onClick={() => toggleUserBlock(u)} disabled={actionLoading}
                  style={{ flex:1, minWidth:60, padding:"8px 4px", borderRadius:10, border:"none",
                    background: u.is_blocked ? "#E8F8F0" : "#FFF8E6",
                    color: u.is_blocked ? "#28A869" : "#D4920A",
                    cursor:"pointer", fontSize:11, fontWeight:700,
                    display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
                  {u.is_blocked ? <><Unlock size={13}/> Ochish</> : <><Lock size={13}/> Blok</>}
                </button>

                {/* Operator qilish — faqat bosh admin ko'radi */}
                {isMainAdmin && (
                  <button onClick={() => toggleOperator(u)} disabled={actionLoading}
                    style={{ flex:1, minWidth:60, padding:"8px 4px", borderRadius:10, border:"none",
                      background: u.is_operator ? "#FFF1F0" : "#EDE9FE",
                      color: u.is_operator ? "#FF4D4F" : "#7C3AED",
                      cursor:"pointer", fontSize:11, fontWeight:700,
                      display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
                    {u.is_operator ? <><ShieldOff size={13}/> Olib tasl.</> : <><ShieldCheck size={13}/> Operator</>}
                  </button>
                )}

                {/* O'chirish */}
                <button onClick={() => setConfirm({ type:"user", id:u.id, name:u.name })}
                  disabled={actionLoading}
                  style={{ padding:"8px 10px", borderRadius:10, border:"none",
                    background:"#FFF1F0", color:"#FF4D4F", cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Trash2 size={14}/>
                </button>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div style={{ textAlign:"center", padding:"32px", color:C.textMuted, fontSize:13 }}>
              Foydalanuvchi topilmadi
            </div>
          )}
        </div>
      )}

      {/* ── MAHSULOTLAR ── */}
      {!loading && tab === "products" && (
        <div>
          <div style={{ fontSize:11, color:C.textMuted, marginBottom:10 }}>
            Jami: <b>{products.length}</b> ta mahsulot
          </div>
          {products.map(p => (
            <div key={p.id} style={{ background:C.card, borderRadius:14, marginBottom:10,
              border:`1px solid ${C.border}`, padding:"12px 14px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:C.text,
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize:11, color:C.primaryDark, fontWeight:700 }}>
                    {Number(p.price).toLocaleString()} so'm/{p.unit}
                  </div>
                  <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>
                    👤 {p.owner_name} ({p.owner_public_id || "—"})
                  </div>
                  <div style={{ fontSize:11, color:C.textMuted }}>
                    📞 {formatUzPhone(p.owner_phone)}
                  </div>
                  <div style={{ fontSize:10, color: p.is_active ? "#28A869" : C.danger,
                    fontWeight:800, marginTop:3 }}>
                    {p.is_active ? "✅ FAOL" : "🔒 YOPIQ"}
                  </div>
                </div>
                <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                  <button onClick={() => toggleProductActive(p)} disabled={actionLoading}
                    style={{ width:34, height:34, borderRadius:10, border:"none",
                      background: p.is_active ? "#FFF8E6" : "#E8F8F0",
                      color: p.is_active ? "#D4920A" : "#28A869",
                      cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {p.is_active ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                  <button onClick={() => setConfirm({ type:"product", id:p.id, name:p.name })}
                    disabled={actionLoading}
                    style={{ width:34, height:34, borderRadius:10, border:"none",
                      background:"#FFF1F0", color:"#FF4D4F", cursor:"pointer",
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Trash2 size={15}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div style={{ textAlign:"center", padding:"32px", color:C.textMuted, fontSize:13 }}>
              Mahsulot topilmadi
            </div>
          )}
        </div>
      )}

      {/* ── REQ_POSTS ── */}
      {!loading && tab === "req_posts" && (
        <div>
          <div style={{ fontSize:11, color:C.textMuted, marginBottom:10 }}>
            Jami: <b>{reqPosts.length}</b> ta post
          </div>
          {reqPosts.map((p) => (
            <div key={p.id} style={{ background:C.card, borderRadius:14, marginBottom:10,
              border:`1px solid ${C.border}`, padding:"12px 14px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", gap:8 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:800, color:C.text }}>{p.title}</div>
                  <div style={{ fontSize:11, color:C.primaryDark, fontWeight:700 }}>
                    {Number(p.price).toLocaleString()} so'm
                  </div>
                </div>
                <div style={{ fontSize:10, fontWeight:800, padding:"3px 8px", height:"fit-content",
                  borderRadius:8, background:"#F3F4F6", color:reqStatusColor(p.status) }}>
                  {p.status}
                </div>
              </div>
              <div style={{ display:"flex", gap:6, marginTop:10, flexWrap:"wrap" }}>
                {p.status === "pending_approval" && (
                  <>
                    <button onClick={() => handleReqStatusAction(p, "approve")} disabled={actionLoading}
                      style={{ border:"none", borderRadius:8, padding:"6px 12px",
                        background:"#E8F8F0", color:"#28A869", cursor:"pointer", fontSize:12, fontWeight:700 }}>
                      ✅ Tasdiqlash
                    </button>
                    <button onClick={() => handleReqStatusAction(p, "reject")} disabled={actionLoading}
                      style={{ border:"none", borderRadius:8, padding:"6px 12px",
                        background:"#FFF1F0", color:"#FF4D4F", cursor:"pointer", fontSize:12, fontWeight:700 }}>
                      ❌ Rad etish
                    </button>
                  </>
                )}
                {p.status === "active" && (
                  <button onClick={() => handleReqStatusAction(p, "hide")} disabled={actionLoading}
                    style={{ border:"none", borderRadius:8, padding:"6px 12px",
                      background:"#FFF8E6", color:"#D4920A", cursor:"pointer", fontSize:12, fontWeight:700 }}>
                    🙈 Yashirish
                  </button>
                )}
                {p.status === "hidden" && (
                  <button onClick={() => handleReqStatusAction(p, "show")} disabled={actionLoading}
                    style={{ border:"none", borderRadius:8, padding:"6px 12px",
                      background:"#E8F8F0", color:"#28A869", cursor:"pointer", fontSize:12, fontWeight:700 }}>
                    👁 Ko'rsatish
                  </button>
                )}
                <button onClick={() => setConfirm({ type:"req_post", id:p.id, name:p.title })}
                  disabled={actionLoading}
                  style={{ border:"none", borderRadius:8, padding:"6px 12px",
                    background:"#FFF1F0", color:"#FF4D4F", cursor:"pointer", fontSize:12, fontWeight:700 }}>
                  🗑 O'chirish
                </button>
              </div>
            </div>
          ))}
          {reqPosts.length === 0 && (
            <div style={{ textAlign:"center", padding:"32px", color:C.textMuted, fontSize:13 }}>
              Post topilmadi
            </div>
          )}
        </div>
      )}

      {/* ── PUL MODAL ── */}
      {deposit && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:999,
          display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:C.card, borderRadius:20, padding:"24px 20px", width:"100%", maxWidth:340 }}>
            <div style={{ fontSize:15, fontWeight:800, color:C.text, marginBottom:4 }}>
              {deposit.mode === "withdraw" ? "💸 Balansdan yechish" : "💰 Pul qo'shish"}
            </div>
            <div style={{ fontSize:12, color:C.textMuted, marginBottom:16 }}>
              {deposit.name} · {formatUzPhone(deposit.phone)}
            </div>
            <input value={amount}
              onChange={e => setAmount(e.target.value.replace(/\D/g,""))}
              placeholder="Summa (so'm)" inputMode="numeric" autoFocus
              style={{ width:"100%", boxSizing:"border-box", padding:"12px 14px",
                borderRadius:12, border:`1.5px solid ${C.primaryBorder}`,
                fontSize:16, fontWeight:700, color:C.text, background:C.bg,
                outline:"none", fontFamily:"inherit", marginBottom:14 }} />
            {amount && (
              <div style={{ fontSize:13, color:C.primaryDark, fontWeight:700, marginBottom:14 }}>
                = {Number(amount).toLocaleString()} so'm
              </div>
            )}
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setDeposit(null)} style={{ flex:1, padding:"11px", borderRadius:12,
                border:`1.5px solid ${C.border}`, background:"transparent", cursor:"pointer",
                fontFamily:"inherit", fontSize:13, fontWeight:700, color:C.textSub }}>
                Bekor
              </button>
              <button onClick={handleDeposit} style={{ flex:1, padding:"11px", borderRadius:12,
                border:"none",
                background: deposit.mode === "withdraw"
                  ? "linear-gradient(135deg,#FF6B6B,#FF4D4F)"
                  : `linear-gradient(135deg,${C.primary},${C.primaryDark})`,
                color:"white", cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:700 }}>
                <Wallet size={14} style={{ verticalAlign:"middle", marginRight:4 }}/>
                {deposit.mode === "withdraw" ? "Yechish" : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── O'CHIRISH TASDIQI ── */}
      {confirm && (
        <ConfirmModal
          msg={`"${confirm.name}" ni ${confirm.type === "user" ? "o'chirish" : confirm.type === "product" ? "o'chirish" : "o'chirish"}ni tasdiqlaysizmi?`}
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
