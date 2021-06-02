import * as relationshipsAPI from './relationships';
import * as SWR from 'swr';
import axios from 'axios';

jest.mock('axios');
jest.mock('swr');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('relationships APIs', () => {
  it('should get the relationships', () => {
    jest.spyOn(SWR, 'default');
    relationshipsAPI.useRelationships(123);
    expect(SWR.default).toHaveBeenCalledWith(
      '/api/residents/123/relationships'
    );
  });

  it('should add relationships', async () => {
    mockedAxios.post.mockResolvedValue({
      data: { foo: 'bar', id: 123 },
    });
    const data = await relationshipsAPI.addRelationships(
      {
        foo: 'bar',
      },
      123
    );
    expect(mockedAxios.post).toHaveBeenCalled();
    expect(mockedAxios.post.mock.calls[0][0]).toEqual(
      '/api/residents/123/relationships'
    );
    expect(mockedAxios.post.mock.calls[0][1]).toEqual({ foo: 'bar' });
    console.log(data);
    expect(data).toEqual({
      foo: 'bar',
      id: 123,
    });
  });

  it('should update/delete a relationship', async () => {
    mockedAxios.patch.mockResolvedValue({ data: { foo: 'foobar' } });

    const data = await relationshipsAPI.updateRelationships(123, {
      foo: 'bar',
    });
    expect(mockedAxios.patch).toHaveBeenCalled();
    expect(mockedAxios.patch.mock.calls[0][0]).toEqual(
      '/api/residents/123/relationships'
    );
    expect(mockedAxios.patch.mock.calls[0][1]).toEqual({
      foo: 'bar',
    });
    expect(data).toEqual({ foo: 'foobar' });
  });
});
