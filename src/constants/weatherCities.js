export const WEATHER_CITIES = [
  { label: '서울', value: 'Seoul' },
  { label: '부산', value: 'Busan' },
  { label: '대구', value: 'Daegu' },
  { label: '인천', value: 'Incheon' },
  { label: '광주', value: 'Gwangju' },
  { label: '대전', value: 'Daejeon' },
  { label: '울산', value: 'Ulsan' },
  { label: '제주', value: 'Jeju' },
  { label: '수원', value: 'Suwon' },
  { label: '도쿄', value: 'Tokyo' },
  { label: '오사카', value: 'Osaka' },
  { label: '베이징', value: 'Beijing' },
  { label: '뉴욕', value: 'New York' },
  { label: '런던', value: 'London' },
  { label: '파리', value: 'Paris' },
];

export const DEFAULT_WEATHER_CITY = WEATHER_CITIES[0].value;

export function getWeatherCityLabel(cityValue) {
  return (
    WEATHER_CITIES.find((city) => city.value === cityValue)?.label ?? cityValue
  );
}
