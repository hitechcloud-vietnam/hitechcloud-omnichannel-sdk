import { HttpClient } from "../httpClient";

export class BaseResource {
  protected http: HttpClient;
  constructor(http: HttpClient) {
    this.http = http;
  }
}
