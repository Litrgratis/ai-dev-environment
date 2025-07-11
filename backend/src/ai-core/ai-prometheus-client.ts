import axios from 'axios';
export async function getPrometheusMetrics(query: string) {
  const url = process.env.PROMETHEUS_URL || 'http://localhost:9090/api/v1/query';
  const response = await axios.get(url, { params: { query } });
  return response.data;
}
// Example: getPrometheusMetrics('up')
