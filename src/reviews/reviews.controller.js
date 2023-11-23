const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

async function reviewExists(request, response, next) {
  // TODO: Write your code here
  const review = await service.read(request.params.reviewId);
  if (review) {
    response.locals.review = review;
    return next();
  }
  response.status(404).json({ error: "Review cannot be found" });
}

async function destroy(request, response) {
  // TODO: Write your code here
  await service.destroy(response.locals.review.review_id);
  response.sendStatus(204);
}

async function list(request, response) {
  // TODO: Write your code here
  const { movieId } = request.params; // Extract movieId from request parameters
  if (!movieId) {
    return response.status(400).json({ error: "Movie ID is required" });
  }
  const data = await service.list(movieId); // Pass movieId to the service function
  response.json({ data });
}

function hasMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return next();
  }
  methodNotAllowed(request, response, next);
}

function noMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return methodNotAllowed(request, response, next);
  }
  next();
}

async function update(request, response) {
  // TODO: Write your code here
  const updatedReview = {
    ...response.locals.review,
    ...request.body.data,
    review_id: response.locals.review.review_id,
  };
  const data = await service.update(updatedReview);
  response.json({ data });
}

module.exports = {
  destroy: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  list: [hasMovieIdInPath, asyncErrorBoundary(list)],
  update: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};
