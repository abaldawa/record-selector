import request from 'supertest';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { getRootRouter } from '../../src/rest-api/routes';

const filteredRecords = [
  {
    key: 'hCXxyuAu',
    createdAt: new Date().toISOString(),
    totalCount: 2085,
  },
];

/**
 * Mock the behaviour of the database
 */
jest.mock('../../src/database/models/record.model', () => ({
  getRecordsByFilter: jest
    .fn()
    .mockResolvedValueOnce([])
    .mockImplementationOnce(async () => filteredRecords),
}));

/**
 * Mock the logger methods so that the server does not log anything
 */
jest.mock('../../src/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

describe('Record routes', () => {
  const app = express();

  beforeAll(() => {
    app.use(express.json());
    app.use(getRootRouter());
  });

  describe('POST /records/filter', () => {
    it(`should return bad request with proper 'code' and 'msg' if no filter data is provided with request body`, async () => {
      const response = await request(app)
        .post('/records/filter')
        .set('Accept', 'application/json')
        .send({});

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toStrictEqual({
        code: StatusCodes.BAD_REQUEST,
        msg: expect.any(String),
      });
    });

    it(`should return bad request with proper 'code' and 'msg' if invalid 'startDate' is provided`, async () => {
      const response = await request(app)
        .post('/records/filter')
        .set('Accept', 'application/json')
        .send({
          startDate: 'Invalid',
          endDate: 'Invalid',
          minCount: 'Invalid',
          maxCount: 'Invalid',
        });

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toStrictEqual({
        code: StatusCodes.BAD_REQUEST,
        msg: expect.any(String),
      });
    });

    it(`should return bad request with proper 'code' and 'msg' if 'startDate' and 'endDate' are same`, async () => {
      const response = await request(app)
        .post('/records/filter')
        .set('Accept', 'application/json')
        .send({
          startDate: '2016-01-26',
          endDate: '2016-01-26',
          minCount: 800,
          maxCount: 800,
        });

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toStrictEqual({
        code: StatusCodes.BAD_REQUEST,
        msg: expect.any(String),
      });
    });

    it(`should return bad request with proper 'code' and 'msg' if 'minCount' and 'maxCount' are same`, async () => {
      const response = await request(app)
        .post('/records/filter')
        .set('Accept', 'application/json')
        .send({
          startDate: '2016-01-26',
          endDate: '2018-02-02',
          minCount: 800,
          maxCount: 800,
        });

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toStrictEqual({
        code: StatusCodes.BAD_REQUEST,
        msg: expect.any(String),
      });
    });

    it(`should return empty array for records if no records matched the provided filter with 'code' as 0 and 'msg' as 'Success' in body`, async () => {
      const response = await request(app)
        .post('/records/filter')
        .set('Accept', 'application/json')
        .send({
          startDate: '2016-01-26',
          endDate: '2018-02-02',
          minCount: 800,
          maxCount: 3000,
        });

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body).toStrictEqual({
        code: 0,
        msg: 'Success',
        records: [],
      });
    });

    it(`should successfully return matched array of records for the provided filter with 'code' as 0 and 'msg' as 'Success' in body`, async () => {
      const response = await request(app)
        .post('/records/filter')
        .set('Accept', 'application/json')
        .send({
          startDate: '2016-01-26',
          endDate: '2018-02-02',
          minCount: 800,
          maxCount: 3000,
        });

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body).toStrictEqual({
        code: 0,
        msg: 'Success',
        records: filteredRecords,
      });
    });
  });
});
