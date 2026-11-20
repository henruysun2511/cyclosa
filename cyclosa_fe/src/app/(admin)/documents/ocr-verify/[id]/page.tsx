import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DocumentOcrVerifyIdPage({ params }: Props) {
  const { id } = await params;
  redirect(`/documents/${id}/review`);
}
