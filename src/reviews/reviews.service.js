const db = require("../db/connection");

const tableName = "reviews";

async function destroy(reviewId) {
  // TODO: Write your code here
  return db("reviews").where({ review_id: reviewId }).delete();
}

async function list(movie_id) {
  // TODO: Write your code here
  const reviews = await db("reviews")
    .join('critics', 'reviews.critic_id', 'critics.critic_id')
    .select(
      'reviews.*', 
      'critics.organization_name', 
      'critics.preferred_name', 
      'critics.surname'
    )
    .where({ 'reviews.movie_id': movie_id });

  // Manually assemble the critic object for each review
  return reviews.map(review => {
    return {
      ...review,
      critic: {
        organization_name: review.organization_name,
        preferred_name: review.preferred_name,
        surname: review.surname
      }
    };
  });
}

async function read(reviewId) {
  return db("reviews as r")
  .select("r.*")
  .where({ review_id: reviewId })
  .first();
}

async function readCritic(critic_id) {
  return db("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

async function update(review) {
  return db(tableName)
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(setCritic);
}

module.exports = {
  destroy,
  list,
  read,
  update,
};
