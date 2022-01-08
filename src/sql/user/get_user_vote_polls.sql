SELECT poll.*
  FROM poll
  JOIN poll_vote
    ON poll.id = poll_vote.poll_id
WHERE poll_vote.user_id = $1;
