import axios from 'axios';
import queryString from 'query-string';

// timeout in milliseconds
const requestTimeout = 300000;

export default class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;

    axios.defaults.timeout = requestTimeout;
  }

  async makeRequest(method, url, body, contentType, responseType) {
    const headers = {
      'Accept': contentType || 'application/json, text/plain, */*',
      'Content-Type': contentType || 'application/json',
    };

    return this.makeRequestWithCustomHeaders(method, url, body, responseType, headers);
  }

  async makeRequestWithCustomHeaders(method, url, data, responseType, headers) {
    const fullUrl = `${this.baseUrl}${url}`;

    const options = {
      method,
      url: fullUrl,
      data,
      headers,
      timeout: requestTimeout,
    };

    if (responseType) {
      options.responseType = responseType;
    }

    const response = await axios(options);

    if (!response || !response.data) {
      return {};
    }

    return response.data;
  }

  async get(url, data = null) {
    let params = '';

    if (data) {
      params = `?${queryString.stringify(data)}`;
    }

    return this.makeRequest('GET', `${url}${params}`, null);
  }

  async post(url, body) {
    return this.makeRequest('POST', url, body);
  }

  async put(url, body) {
    return this.makeRequest('PUT', url, body);
  }

  async patch(url, body) {
    return this.makeRequest('PATCH', url, body);
  }

  async delete(url, body) {
    return this.makeRequest('DELETE', url, body);
  }
}
