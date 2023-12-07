export enum HTTPStatusCodes {
  /** Standard response for successful HTTP requests. The actual response will
   * depend on the request method used. In a GET request, the response will
   * contain an entity corresponding to the requested resource. In a POST request,
   * the response will contain an entity describing or containing the result of the action. **/
  OK = 200,

  /** The request succeeded, and a new resource was created as a result. This is typically
   *  the response sent after POST requests, or some PUT requests. **/
  Created = 201,

  /** The request succeeded, and a new resource was created as a result. This is typically
   * the response sent after POST requests, or some PUT requests. **/
  ResourceCreated = 201,

  /** The server cannot or will not process the request due to something that is perceived
   * to be a client error (e.g., malformed request syntax, invalid request message framing,
   * or deceptive request routing). **/
  BadRequest = 400, // Refusal from server due to client error

  /** Although the HTTP standard specifies "unauthorized", semantically this response means
   * "unauthenticated". That is, the client must authenticate itself to get the requested response. **/
  Unauthorized = 401, // Client is not correctly authorized/authenticated

  /** The server cannot find the requested resource. In the browser, this means the URL is not
   *  recognized. In an API, this can also mean that the endpoint is valid but the resource
   * itself does not exist. Servers may also send this response instead of 403 Forbidden to
   * hide the existence of a resource from an unauthorized client. This response code is probably
   *  the most well known due to its frequent occurrence on the web. **/
  NotFound = 404, // Request recieved, but resource doesn't exist

  /** The server has encountered a situation it does not know how to handle. **/
  InternalServerError = 500,
}
