import { auth } from "@/auth";

export default async function ServicesPage() {
  const user = await auth();
  console.log(user);
  return (
    <>
      <div>isTwoFactorEnabled: {user?.user?.isTwoFactorEnabled}</div>
      <div>userName: {user?.user?.userName}</div>
      <div>name: {user?.user?.name}</div>
      <div>email: {user?.user?.email}</div>
      <div>image: {user?.user?.image}</div>
      <div>role: {user?.user?.role}</div>
      <div>id: {user?.user?.id}</div>
    </>
  );
}
