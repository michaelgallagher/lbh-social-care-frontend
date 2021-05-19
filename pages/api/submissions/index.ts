import forms from 'data/flexibleForms/forms';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  res.json({
    forms,
  });
};

export default handler;
