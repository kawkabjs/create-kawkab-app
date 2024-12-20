import { BaseController, inherit } from 'kawkab';

export default class extends inherit(BaseController) {
  /**
   * @api {get} / Retrieve the welcome message
   * @apiName GetWelcomeMessage
   * @apiGroup Kawkab
   * @apiVersion 1.0.0
   *
   * @apiSuccess {Boolean} status The status of the API response.
   * @apiSuccess {String} message The welcome message for the Kawkab framework.
   *
   * @apiSuccessExample {json} Successful Response Example:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": true,
   *       "message": "Welcome to the Kawkab framework 👋🌎.!"
   *     }
   */
  async get() {
    return {
      status: true,
      message: 'Welcome to the Kawkab framework 👋🌎.!',
    };
  }
}