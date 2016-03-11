// name: create_story
// create a draft story for the user or merge it!
MATCH (u:user {uid: {user_uid}})
WITH (u)
CREATE (sto:story:draft {uid: {uid}, title: {title}, status: {status}})-[r:writes]->(u)
  SET
    r.creation_time = {exec_time},
    r.creation_date = {exec_date}
WITH sto, r, {
    uid: u.uid,
    username: u.username
  } as alias_u
RETURN {
  uid: sto.uid,
  props: sto,
  creation_date: r.creation_date,
  creation_time: r.creation_time,
  owner: alias_u,
  labels: last(labels(sto))
} as result


// name: remove_story
// will remove the story forever and ever. WARNING!!!! destroy everything related to the story, as if it never existed.
MATCH (n:story {uid: {uid}})
OPTIONAL MATCH (n)-[r]-()
DELETE  n, r