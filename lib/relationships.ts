import axios from 'axios';
import type { RelationshipData } from 'types';
const { ENDPOINT_API, AWS_KEY } = process.env;
const headers = { 'x-api-key': AWS_KEY };

export const getRelationshipByResident = async (
  personId: number
): Promise<RelationshipData[] | []> => {
  const { data }: { data: RelationshipData[] } = await axios.get(
    `${ENDPOINT_API}/residents/${personId}/relationships`,
    {
      headers,
    }
  );
  return data;
};

export const addRelationship = async (
  params: Record<string, unknown>,
  personId: number
): Promise<void> => {
  await axios.post(
    `${ENDPOINT_API}/residents/${personId}/relationships`,
    params,
    {
      headers: { ...headers, 'Content-Type': 'application/json' },
    }
  );
};

export const updateRelationship = async (
  params: Record<string, unknown>,
  personId: number
): Promise<void> => {
  await axios.patch(
    `${ENDPOINT_API}/residents/${personId}/relationships`,
    params,
    {
      headers: { ...headers, 'Content-Type': 'application/json' },
    }
  );
};
