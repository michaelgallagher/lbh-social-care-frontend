import axios from 'axios';
import {
  Submission,
  StepAnswers,
  FlexibleAnswers,
} from 'data/flexibleForms/forms.types';
import { Resident, AgeContext } from 'types';
import forms from 'data/flexibleForms';

type RawSubmission = Omit<Submission, 'formAnswers'> & {
  formAnswers: {
    [key: string]: string;
  };
};

const ENDPOINT_API = process.env.ENDPOINT_API;
const AWS_KEY = process.env.AWS_KEY;

const headersWithKey = {
  'x-api-key': AWS_KEY,
};

/** get a list of all unfinished submissions in the current social care service context  */
export const getUnfinishedSubmissions = async (
  ageContext?: AgeContext
): Promise<Submission[]> => {
  const { data } = await axios.get(`${ENDPOINT_API}/submissions`, {
    headers: headersWithKey,
  });
  return ageContext
    ? data.filter((submission: Submission) =>
        submission.residents.some(
          (resident: Resident) => resident.ageContext === ageContext
        )
      )
    : data;
};

/** create a new submission for the given form, resident and worker  */
export const startSubmission = async (
  formId: string,
  socialCareId: number,
  createdBy: string
): Promise<Submission> => {
  const { data } = await axios.post(
    `${ENDPOINT_API}/submissions`,
    {
      formId,
      socialCareId: Number(socialCareId),
      createdBy,
    },
    {
      headers: headersWithKey,
    }
  );
  return data;
};

const deserialiseAnswers = (data: RawSubmission): Submission => {
  const deserialisedAnswers: FlexibleAnswers = {};
  Object.keys(data.formAnswers).map(
    (step) => (deserialisedAnswers[step] = JSON.parse(data.formAnswers[step]))
  );
  return {
    ...data,
    formAnswers: deserialisedAnswers,
  };
};

/** get an existing submission by its id */
export const getSubmissionById = async (
  submissionId: string
): Promise<Submission> => {
  const { data } = await axios.get(
    `${ENDPOINT_API}/submissions/${submissionId}`,
    {
      headers: headersWithKey,
    }
  );
  return deserialiseAnswers(data);
};

/** update the answers for a given step on a submission, providing the submission id, step id, editor's name and the answers to update */
export const patchSubmissionForStep = async (
  submissionId: string,
  stepId: string,
  editedBy: string,
  stepAnswers: StepAnswers
): Promise<Submission> => {
  const tags = Object.keys(stepAnswers).find((step) =>
    step.toLowerCase().includes('tags')
  );

  const { data } = await axios.patch(
    `${ENDPOINT_API}/submissions/${submissionId}/steps/${stepId}`,
    {
      stepAnswers: JSON.stringify(stepAnswers),
      editedBy,
      tags: tags ? stepAnswers[tags] : undefined,
    },
    {
      headers: headersWithKey,
    }
  );
  return deserialiseAnswers(data);
};

/** pass in a string of resident ids to replace the existing ones associated with the submission */
export const patchResidents = async (
  submissionId: string,
  editedBy: string,
  residentIds: number[]
): Promise<Submission> => {
  const { data } = await axios.patch(
    `${ENDPOINT_API}/submissions/${submissionId}`,
    {
      residents: residentIds,
      editedBy,
    },
    {
      headers: headersWithKey,
    }
  );
  return data;
};

/** mark an existing submission as finished, providing its id  */
export const finishSubmission = async (
  submissionId: string,
  finishedBy: string,
  formAnswers?: FlexibleAnswers
): Promise<Submission> => {
  const { data } = await axios.patch(
    `${ENDPOINT_API}/submissions/${submissionId}`,
    {
      editedBy: finishedBy,
      submissionState: 'submitted',
      formAnswers,
    },
    {
      headers: headersWithKey,
    }
  );
  return data;
};

/** mark an existing submission as discarded, providing its id  */
export const discardSubmission = async (
  submissionId: string,
  discardedBy: string
): Promise<number> => {
  const { status } = await axios.patch(
    `${ENDPOINT_API}/submissions/${submissionId}`,
    {
      editedBy: discardedBy,
      submissionState: 'discarded',
    },
    {
      headers: headersWithKey,
    }
  );
  return status;
};

/** mark an existing submission as approved, providing its id  */
export const approveSubmission = async (
  submissionId: string,
  approvedBy: string
): Promise<Submission> => {
  const { data } = await axios.patch(
    `${ENDPOINT_API}/submissions/${submissionId}`,
    {
      editedBy: approvedBy,
      submissionState: 'approved',
    },
    {
      headers: headersWithKey,
    }
  );
  return data;
};

/** mark an approved submission as panal approved passing in the id and approved by  */
export const panelApproveSubmission = async (
  submissionId: string,
  approvedBy: string
): Promise<Submission> => {
  const { data } = await axios.patch(
    `${ENDPOINT_API}/submissions/${submissionId}`,
    {
      editedBy: approvedBy,
      submissionState: 'panel_approved',
    },
    {
      headers: headersWithKey,
    }
  );
  return data;
};
/** return a submitted submission for edits, providing a reason and its id  */
export const returnForEdits = async (
  submissionId: string,
  editedBy: string,
  rejectionReason?: string
): Promise<Submission> => {
  const { data } = await axios.patch(
    `${ENDPOINT_API}/submissions/${submissionId}`,
    {
      editedBy,
      submissionState: 'in_progress',
      rejectionReason,
    },
    {
      headers: headersWithKey,
    }
  );
  return data;
};

/** safely generate a submission url, handling weird cases like case notes, which use a different canonical url structure */
export const generateSubmissionUrl = (
  submission: Submission,
  socialCareId?: number
): string => {
  const form = forms.find((form) => form.id === submission.formId);
  if (form?.canonicalUrl) {
    return `${form.canonicalUrl(
      // use the passed in social care id, or default to the first resident on the submission
      socialCareId || submission.residents[0].id
    )}?submissionId=${submission.submissionId}`;
  } else {
    return `/submissions/${submission.submissionId}`;
  }
};
