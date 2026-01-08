type Props = {
  userId?: string | undefined | null;
  onUserIdChange: (userId: string | undefined | null) => void;
};

export const UserIdInput = ({ userId, onUserIdChange }: Props) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex gap-2">
        <label htmlFor="userId">User ID</label>
        <button onClick={() => onUserIdChange(crypto.randomUUID())}>
          Generate
        </button>
        <button onClick={() => onUserIdChange(undefined)}>Unset</button>
      </div>
      <input
        type="text"
        value={userId ?? ""}
        onChange={(e) => onUserIdChange(e.target.value)}
        className="w-full border-2 border-yellow-400 rounded-md p-2"
      />
    </div>
  );
};
