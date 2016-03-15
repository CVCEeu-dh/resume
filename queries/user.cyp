// name: create_user
// to be used with OAuth2provider
MERGE (k:user {email:{email}})
  SET
    k.username   = {username},

    k.status     = {status},

    {if:picture}
    k.picture  = {picture},
    {/if}
    
    {if:firstname}
    k.firstname  = {firstname},
    {/if}

    {if:gender}
    k.gender     = {gender},
    {/if}

    k.strategy   = {strategy},
    k.about      = {about},

    k.last_notification_time={exec_time},
    k.last_notification_date={exec_date},

    k.creation_time = {exec_time},
    k.creation_date = {exec_date},
    k.last_modification_time = {exec_time},
    k.last_modification_date = {exec_date},

    k.password   = {password},
    k.salt       = {salt},
    k.status     = {status},
    k.activation = {activation}
RETURN {
  uid: k.uid,
  username: k.username,
  props: k
}

// name: count_users
// return the number of users
MATCH (u:user)
RETURN {
  labels: last(labels(u)),
  c: count(u)
} as total_items

// name: get_users
// return the users items with privacy for internal properties
MATCH(u:user)
WITH (u)
SKIP {offset}
LIMIT {limit}
RETURN {
  uid: u.uid,
  username: u.username
}

// name: remove_user
// WARNING!!!! destroy everything related to the user, as if it never existed.
MATCH (n:user {username:{username}})
OPTIONAL MATCH (n)-[r]-()
DELETE  n, r