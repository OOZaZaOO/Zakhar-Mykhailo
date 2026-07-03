import { chat } from "@/data/mock";

export function SessionChat() {
  return (
    <div className="rounded-3xl border border-[#ded5c8] bg-white p-5 shadow-sm">
      <h3 className="text-xl font-semibold">Chat</h3>
      <div className="mt-5 space-y-3">
        {chat.map((message) => (
          <div
            className="rounded-2xl bg-[#f7f3ec] p-4"
            key={`${message.sender}-${message.time}`}
          >
            <div className="flex items-center justify-between gap-3 text-sm">
              <p className="font-bold">{message.sender}</p>
              <p className="text-[#7b8884]">{message.time}</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#4f5f5b]">
              {message.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
