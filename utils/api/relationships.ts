import useSWR, { SWRResponse } from 'swr';
import axios from 'axios';

import type { RelationshipData, ErrorAPI } from 'types';

export const useRelationships = (
  id: number
): SWRResponse<RelationshipData, ErrorAPI> =>
  useSWR(`/api/residents/${id}/relationships`);

export const addRelationships = async (
  formData: Record<string, unknown>,
  id: number
): Promise<Record<string, unknown>> => {
  const { data } = await axios.post(
    `/api/residents/${id}/relationships`,
    formData
  );
  return data;
};

export const updateRelationships = async (
  id: number,
  formData: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  const { data } = await axios.patch(
    `/api/residents/${id}/relationships`,
    formData
  );
  return data;
};
