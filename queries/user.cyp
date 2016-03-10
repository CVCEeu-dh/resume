// name: create_user
// to be used with OAuth2provider
CREATE (k:user {email:{email}, id:{id}})
  SET
    k.id = {id},
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
RETURN k



// name: remove_user
// WARNING!!!! destroy everything related to the user, as if it never existed.
MATCH (n:user {username:{username}})
OPTIONAL MATCH (n)-[r]-()
DELETE  n, r