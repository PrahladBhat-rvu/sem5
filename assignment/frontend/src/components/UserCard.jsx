export default function UserCard({ user }) {
  return (
    <article className="user-card">
      <div className="avatar">{user.name.charAt(0)}</div>
      <div>
        <h3>{user.name}</h3>
        <p>ID: {user.id}</p>
        <p>{user.email}</p>
      </div>
    </article>
  );
}
