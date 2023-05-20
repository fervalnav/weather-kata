import request from 'request'
import { promisify } from 'util'
const rp = promisify(request)

class Forecast {
  async predict (city, datetime = new Date(), wind = false) {
    // Get the coordinates of the city
    const { latitude, longitude } = await this.getCoordinates(city)
    // Get the attribute to predict
    const attribute = wind
      ? this.dailyAttributes.wind
      : this.dailyAttributes.code

    // Find the predictions for the location
    const baseUrl = 'https://api.open-meteo.com/v1/forecast'
    const queryParams = new URLSearchParams({
      latitude,
      longitude,
      daily: attribute,
      timezone: 'Europe/Berlin',
      start_date: datetime.toISOString().slice(0, 10),
      end_date: datetime.toISOString().slice(0, 10)
    })
    const url = `${baseUrl}?${queryParams.toString()}`
    const result = JSON.parse((await rp(url)).body)
    if (result && result.error) throw new Error(result.reason)

    if (wind)
      return `Max windspeed: ${result.daily[attribute][0]} ${result['daily_units'][attribute]}`

    const mappedCode = this.codeToText[result.daily[attribute]]
    if (!mappedCode) throw new Error('Weather code not found')
    return mappedCode
  }

  async getCoordinates (city) {
    if (!city) {
      throw new Error('City is required')
    }

    // Find the latitude and longitude to get the prediction
    const request = await rp(
      'https://positionstack.com/geo_api.php?query=' + city
    )

    const response = JSON.parse(request.body)
    if (!response.data.length) throw new Error('City not found')

    const latitude = response['data'][0]['latitude']
    const longitude = response['data'][0]['longitude']
    return { latitude, longitude }
  }

  dailyAttributes = {
    code: 'weathercode',
    wind: 'windspeed_10m_max'
  }

  codeToText = {
    0: 'Clear sky',
    1: 'Mainly clear, partly cloudy, and overcast',
    2: 'Mainly clear, partly cloudy, and overcast',
    3: 'Mainly clear, partly cloudy, and overcast',
    45: 'Fog and depositing rime fog',
    48: 'Fog and depositing rime fog',
    51: 'Drizzle: Light, moderate, and dense intensity',
    53: 'Drizzle: Light, moderate, and dense intensity',
    55: 'Drizzle: Light, moderate, and dense intensity',
    56: 'Freezing Drizzle: Light and dense intensity',
    57: 'Freezing Drizzle: Light and dense intensity',
    61: 'Rain: Slight, moderate and heavy intensity',
    63: 'Rain: Slight, moderate and heavy intensity',
    65: 'Rain: Slight, moderate and heavy intensity',
    66: 'Freezing Rain: Light and heavy intensity',
    67: 'Freezing Rain: Light and heavy intensity',
    71: 'Snow fall: Slight, moderate, and heavy intensity',
    73: 'Snow fall: Slight, moderate, and heavy intensity',
    75: 'Snow fall: Slight, moderate, and heavy intensity',
    77: 'Snow grains',
    80: 'Rain showers: Slight, moderate, and violent',
    81: 'Rain showers: Slight, moderate, and violent',
    82: 'Rain showers: Slight, moderate, and violent',
    85: 'Snow showers slight and heavy',
    86: 'Snow showers slight and heavy',
    95: 'Thunderstorm: Slight or moderate',
    96: 'Thunderstorm with slight and heavy hail',
    99: 'Thunderstorm with slight and heavy hail'
  }
}
export default Forecast
