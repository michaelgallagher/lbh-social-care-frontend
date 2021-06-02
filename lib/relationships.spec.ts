import axios from 'axios';
import * as relationshipsAPI from './relationships';
import { mockedRelationship } from 'factories/relationships';

const { ENDPOINT_API, AWS_KEY } = process.env;
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('axios');

describe('relationships APIs', () => {
  describe('addRelationship', () => {
    it("calls the service API's add relationship endpoint", async () => {
      mockedAxios.post.mockResolvedValue({ data: {} });

      await relationshipsAPI.addRelationship(
        {
          createdBy: 'foo@bar.com',
        },
        123
      );
      expect(mockedAxios.post).toHaveBeenCalled();
      expect(mockedAxios.post.mock.calls[0][0]).toEqual(
        `${ENDPOINT_API}/residents/123/relationships`
      );
      expect(mockedAxios.post.mock.calls[0][1]).toEqual({
        createdBy: 'foo@bar.com',
      });
      expect(mockedAxios.post.mock.calls[0][2]?.headers).toEqual({
        'Content-Type': 'application/json',
        'x-api-key': AWS_KEY,
      });
    });

    it('should throw an error with the wrong body', async () => {
      try {
        // @ts-expect-error check validation
        await relationshipsAPI.addRelationship(123);
      } catch (e) {
        expect(e.name).toEqual('ValidationError');
      }
    });
  });

  describe('updateRelationships', () => {
    it('should patch a relationship', async () => {
      mockedAxios.patch.mockResolvedValue({ data: {} });
      await relationshipsAPI.updateRelationship(
        {
          // status: 'Open',
          // reviwedBy: 'foo@bar.com',
        },
        123
      );
      expect(mockedAxios.patch).toHaveBeenCalled();
      expect(mockedAxios.patch.mock.calls[0][0]).toEqual(
        `${ENDPOINT_API}/residents/123/relationships`
      );
      expect(mockedAxios.patch.mock.calls[0][1]).toEqual({
        // status: 'Open',
        // reviwedBy: 'foo@bar.com',
      });
      expect(mockedAxios.patch.mock.calls[0][2]?.headers).toEqual({
        'Content-Type': 'application/json',
        'x-api-key': AWS_KEY,
      });
    });

    it('should throw an error with the wrong body', async () => {
      try {
        // @ts-expect-error check validation
        await relationshipsAPI.updateRelationship(123);
      } catch (e) {
        expect(e.name).toEqual('ValidationError');
      }
    });
  });

  describe('getRelationshipByResident', () => {
    it("calls the service API's relationships endpoint", async () => {
      const relationships = mockedRelationship;
      mockedAxios.get.mockResolvedValue({
        data: relationships,
      });

      const data = await relationshipsAPI.getRelationshipByResident(123);
      expect(mockedAxios.get).toHaveBeenCalled();
      expect(mockedAxios.get.mock.calls[0][0]).toEqual(
        `${ENDPOINT_API}/residents/123/relationships`
      );
      expect(mockedAxios.get.mock.calls[0][1]?.headers).toEqual({
        'x-api-key': AWS_KEY,
      });
      expect(data).toEqual(relationships);
    });
  });
});
