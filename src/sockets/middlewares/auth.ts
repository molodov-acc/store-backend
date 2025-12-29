export function auth(socket, next) {
  const { userId, role } = socket.handshake.auth;

  if (!userId) next(new Error("Требуется userId"));
  if (!role) next(new Error("Требуется роль"));

  socket.userId = userId;
  socket.role = role;

  next();
}
