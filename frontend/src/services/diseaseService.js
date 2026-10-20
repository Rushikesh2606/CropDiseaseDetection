import api from './api';

export async function getDiseases() {
  const { data } = await api.get('/diseases');
  return data.diseases;
}

export async function getDiseaseDetail(classId) {
  const { data } = await api.get(`/diseases/${encodeURIComponent(classId)}`);
  return data;
}

export async function getClasses() {
  const { data } = await api.get('/classes');
  return data.classes;
}
