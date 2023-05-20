import Forecast from '../src/forecast'

describe('Forecast should', function () {
  let forecast
  beforeAll(() => {
    forecast = new Forecast()
  })

  it('return correctly wheater code', async () => {
    const result = await forecast.predict('Berlin', new Date('2023-05-19'))
    expect(result).toBe('Mainly clear, partly cloudy, and overcast')
  })

  it('return correctly wind', async () => {
    const result = await forecast.predict(
      'Berlin',
      new Date('2023-05-19'),
      true
    )
    expect(result).toBe('Max windspeed: 15.5 km/h')
  })

  it('throw error becuase use bad date', async () => {
    const t = async () => forecast.predict('Berlin', new Date('2020-12-01'))
    expect(t()).rejects.toThrow(
      "Parameter 'start_date' is out of allowed range from 2022-06-08 to 2023-06-04"
    )
  })

  it('throw error wheater code not found', async () => {
    const t = async () => forecast.predict('Berlin', new Date('2022-06-08'))
    expect(t()).rejects.toThrow('Weather code not found')
  })

  it('throw error city not found', async () => {
    const t = async () => forecast.predict('aaaaaaaaaaaaaaaaaaaaaaaa')
    expect(t()).rejects.toThrow('City not found')
  })
})
