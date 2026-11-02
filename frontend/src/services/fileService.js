import api from "./api";

export async function uploadFile(file, userId) {
  const form = new FormData();
  form.append("file", file);
  form.append("userId", userId);

  const { data } = await api.post("/api/files/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; // { id, fileName, content }
}