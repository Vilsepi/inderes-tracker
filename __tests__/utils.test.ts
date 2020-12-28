import { getDifferenceBetweenDates } from '../src/inderes/utils';

describe('getDifferenceBetweenDates', () => {
  test('less than half a day', () => {
    const now = new Date('2020-12-21T08:24:00');
    const date_of_recommendation = '21.12.2020';
    expect(getDifferenceBetweenDates(date_of_recommendation, now)).toEqual(0);
  });

  test('more than half a day', () => {
    const now = new Date('2020-12-21T20:24:00');
    const date_of_recommendation = '21.12.2020';
    expect(getDifferenceBetweenDates(date_of_recommendation, now)).toEqual(1);
  });

  test('a bit over one day', () => {
    const now = new Date('2020-12-22T08:24:00');
    const date_of_recommendation = '21.12.2020';
    expect(getDifferenceBetweenDates(date_of_recommendation, now)).toEqual(1);
  });

  test('three days', () => {
    const now = new Date('2020-12-24T09:00:00');
    const date_of_recommendation = '21.12.2020';
    expect(getDifferenceBetweenDates(date_of_recommendation, now)).toEqual(3);
  });

  test('change of year', () => {
    const now = new Date('2021-01-02T06:00:00');
    const date_of_recommendation = '28.12.2020';
    expect(getDifferenceBetweenDates(date_of_recommendation, now)).toEqual(5);
  });

});
